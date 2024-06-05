const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            email: null,
            location: null,
            user_id: null,
            events: [],
            favorites: [],
            currentIndex: 0,

        },
        actions: {
            newUser: async (email, password, location) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/users", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password, location }),
                    });
                    const data = await resp.json();
                    return { ok: resp.ok, msg: data.msg };
                } catch (error) {
                    console.log("From actions.newUser: Error creating new user", error);
                    return { ok: false, msg: "Error creating new user" };
                }
            },  // closing newUser method

            login: async(email, password) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({email, password}),
                    });
                    const data = await resp.json();
                    if (resp.ok) {
                        const store = getStore();
                        localStorage.setItem("token", data.access_token);
                        localStorage.setItem("email", data.email);
                        localStorage.setItem("userID", data.user_id);
                        localStorage.setItem("location", data.location);
                        store.token = data.access_token;
                        store.email = data.email;
                        store.user_id = data.user_id;
                        store.location = data.location
                    }
                    console.log(`From actions.login: ok: ${resp.ok}, msg: ${resp.msg}`);
                    return { ok: resp.ok, msg: resp.msg };
                } catch (error){
                    console.log("From actions.login: Error logging in", error);
                    return {ok: false, msg: "Error logging in"};
                }
            }, // closing login method

            data: async (action, payload) => {
                const store = getStore();
                let data = [];
            
                switch (action) {
                    case "events":
                        if (store.events.length !== 0) {
                            data = store.events;
                            console.log("From actions.data: Events fetched from store");
                        } else if (localStorage.getItem("events")) {
                            data = JSON.parse(localStorage.getItem("events"));
                            console.log("From actions.data: Events fetched from local storage");
                        } else {
                            console.log("From actions.data: Starting API call for events");
                            try {
                                const resp = await fetch(process.env.BACKEND_URL + "/api/events", {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${store.token}`
                                    }
                                });
                                const events = await resp.json();
                                if (events.ok) {
                                    data = events.payload;
                                    console.log("From actions.data: Events fetched from API");
                                    store.events = data;
                                    localStorage.setItem("events", JSON.stringify(data));
                                } else {
                                    console.log(`From actions.data: While fetching events from API: ok: ${events.ok}, msg: ${events.msg}`);
                                }
                            } catch (error) {
                                console.log("From actions.data: Error fetching events", error);
                            }
                        }
                        return data;
            
                    case "favorites":
                        if (store.favorites.length !== 0) {
                            data = store.favorites;
                            console.log("From actions.data: Favorites fetched from store");
                        } else if (localStorage.getItem("favorites")) {
                            data = JSON.parse(localStorage.getItem("favorites"));
                            console.log("From actions.data: Favorites fetched from local storage");
                        } else {
                            console.log("From actions.data: Starting API call for favorites");
                            try {
                                const resp = await fetch(process.env.BACKEND_URL + "/api/favorites", {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${store.token}`
                                    }
                                });
                                const favorites = await resp.json();
                                if (favorites.ok) {
                                    data = favorites.payload;
                                    console.log("From actions.data: Favorites fetched from API");
                                    store.favorites = data;
                                    localStorage.setItem("favorites", JSON.stringify(data));
                                } else {
                                    console.log(`From actions.data: While fetching favorites from API: ok: ${favorites.ok}, msg: ${favorites.msg}`);
                                }
                            } catch (error) {
                                console.log("From actions.data: Error fetching favorites", error);
                            }
                        }
                        return data;
            
                    case "add":
                        try {
                            const resp = await fetch(process.env.BACKEND_URL + "/api/favorites", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${store.token}`
                                },
                                body: JSON.stringify(payload)
                            });
                            const favorites = await resp.json();
                            if (favorites.ok) {
                                data = favorites.payload;
                                console.log("From actions.data: Favorite added and fetched from API");
                                store.favorites = data;
                                localStorage.setItem("favorites", JSON.stringify(data));
                            } else {
                                console.log(`From actions.data: There was an issue adding favorite: ok: ${favorites.ok}, msg:${favorites.msg}`);
                            }
                        } catch (error) {
                            console.log("From actions.data: Error adding favorite", error);
                        }
                        return data;
            
                    case "delete":
                        try {
                            const resp = await fetch(`${process.env.BACKEND_URL}/api/favorites/${payload.id}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${store.token}`
                                }
                            });
                            const favorites = await resp.json();
                            if (favorites.ok) {
                                data = favorites.payload;
                                console.log("From actions.data: Favorite deleted and fetched from API");
                                store.favorites = data;
                                localStorage.setItem("favorites", JSON.stringify(data));
                            } else {
                                console.log(`From actions.data: There was an issue deleting favorite: ok: ${favorites.ok}, msg:${favorites.msg}`);
                            }
                        } catch (error) {
                            console.log("From actions.data: Error deleting favorite", error);
                        }
                        return data;
            
                    default:
                        console.log("From actions.data: Unknown action type");
                        return data;
                }
            },  // closing data method

            swipeEvent: (direction, event) => {
                const actions = getActions();
                if (direction === "right") {
                    actions.data("add", event.id, event);
                } else if (direction === "left") {
                    const store = getStore();
                    const newIndex = store.currentIndex - 1;
                    setStore({ currentIndex: Math.max(newIndex, 0) });
                }
            },  // closing swipeEvent method

            fetchEvents: async () => {
                const actions = getActions();
                return await actions.data("events");
            }, // closing fetchEvents method

            resetSwipe: () => {
                const store = getStore();
                setStore({ currentIndex: store.currentIndex + 1 });
            }, // closing resetSwipe method
        }
    };
};

export default getState;
