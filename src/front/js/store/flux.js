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
                    console.log("Error creating new user", error);
                    return { ok: false, msg: "Error creating new user" };
                }
            },
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
                    return { ok: resp.ok, msg: data.msg };
                } catch (error){
                    console.log("Error logging in", error);
                    return {ok: false, msg: "Error logging in"};
                }
            },

            data: async (action, id, payload) => {
                const store = getStore();
                const actions = getActions();
                let data;
				let events = store.events;
				let favorites = store.favorites;

                switch (action) {
                    case "events":
                        if (store.events.length !== 0) {
							console.log("Events fetched from store");
						} else if (localStorage.getItem(events)) {
							events = JSON.parse(localStorage.getItem("events"))
							console.log("Events fetched from local storage")
						} else {
							console.log("Starting API call for events")
                            try {
                                const resp = await fetch(process.env.BACKEND_URL + "/api/events", {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${store.token}`
                                    }
                                });
                                data = await resp.json();
                                if (data.ok){
                                events = data.payload;
                                console.log("Events fetched from API")
                                } else {
                                    console.log(`While fetching events from API: ok: ${data.ok}, msg: ${data.msg}`)
                                }
                            } catch (error) {
                                console.log("Error fetching events", error);
                            }
						}
                        

                    case "favorites":
                        data = store.favorites;
                        if (data.length === 0) {
                            try {
                                const resp = await fetch(process.env.BACKEND_URL + "/api/favorites", {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${store.token}`
                                    }
                                });
                                data = await resp.json();
                                setStore({ favorites: data });
                            } catch (error) {
                                console.log("Error fetching favorites", error);
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
                            data = await resp.json();
                            if (resp.ok) {
                                setStore({ favorites: [...store.favorites, data] });
                            }
                            return data;
                        } catch (error) {
                            console.log("Error adding favorite", error);
                        }
                        break;

                    case "delete":
                        try {
                            const resp = await fetch(`${process.env.BACKEND_URL}/api/favorites/${id}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${store.token}`
                                }
                            });
                            data = await resp.json();
                            if (resp.ok) {
                                setStore({ favorites: store.favorites.filter(fav => fav.id !== id) });
                            }
                            return data;
                        } catch (error) {
                            console.log("Error deleting favorite", error);
                        }
                        break;

                    default:
                        console.log("Unknown action type");
                }
				store.events = events;
				store.favorites = favorites;
            },

            swipeEvent: (direction, event) => {
                const actions = getActions();
                if (direction === "right") {
                    actions.data("add", event.id, event);
                } else if (direction === "left") {
                    const store = getStore();
                    const newIndex = store.currentIndex - 1;
                    setStore({ currentIndex: Math.max(newIndex, 0) });
                }
            },

            fetchEvents: async () => {
                const actions = getActions();
                return await actions.data("events");
            },

            resetSwipe: () => {
                const store = getStore();
                setStore({ currentIndex: store.currentIndex + 1 });
            },
        }
    };
};

export default getState;
