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
                    console.log(`From actions.newUser: ok: ${data.ok}, msg: ${data.msg}`);
                    return data;
                } catch (error) {
                    console.log("From actions.newUser: Error creating new user", error);
                    return { ok: false, msg: "Error creating new user" };
                }
            },  // closing newUser method

            login: async(email, password) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/users/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({email, password}),
                    });
                    const data = await resp.json();
                    if (data.ok) {
                        localStorage.setItem("token", data.payload.access_token);
                        localStorage.setItem("email", data.payload.email);
                        localStorage.setItem("userID", data.payload.user_id);
                        localStorage.setItem("location", data.payload.location);
                        setStore({token: data.payload.access_token});
                        setStore({email: data.payload.email});
                        setStore({user_id: data.payload.user_id});
                        setStore({location: data.payload.location});
                    }
                    console.log(`From actions.login: ok: ${data.ok}, msg: ${data.msg}`);
                    return { ok: data.ok, msg: data.msg };
                } catch (error){
                    console.log("From actions.login: Error logging in", error);
                    return {ok: false, msg: "Error logging in"};
                }
            }, // closing login method

            data: async (action, payload) => {
                const store = getStore();
                let response = { ok: false, msg: "This message was never changed by actions.data", payload: [] };
                if (!store.token) {
                    return { ok: false, msg: "Not logged in." }
                }
                switch (action) {
                    case "events":
                        if (store.events.length !== 0) {
                            response.payload = store.events;
                            console.log("From actions.data: Events fetched from store");
                            response.msg = "Events fetched from store";
                            response.ok = true;
                            localStorage.setItem("events", JSON.stringify(response.payload));
                        } else if (localStorage.getItem("events")) {
                            response.payload = JSON.parse(localStorage.getItem("events"));
                            console.log("From actions.data: Events fetched from local storage");
                            response.msg = "Events fetched from local storage";
                            response.ok = true;
                            setStore({events: response.payload});
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
                                    response.payload = events.payload;
                                    console.log("From actions.data: Events fetched from API");
                                    response.msg = "Events fetched from API";
                                    response.ok = true;
                                    setStore({events: response.payload});
                                    localStorage.setItem("events", JSON.stringify(response.payload));
                                } else {
                                    console.log(`From actions.data: While fetching events from API: ok: ${events.ok}, msg: ${events.msg}`);
                                    response.msg = events.msg;
                                    response.ok = events.ok;

                                }
                            } catch (error) {
                                console.log("From actions.data: Error fetching events", error);
                                response.msg = "Error fetching events";
                            }
                        }
                        return response;
            
                    case "favorites":
                        if (store.favorites.length !== 0) {
                            response.payload = store.favorites;
                            console.log("From actions.data: Favorites fetched from store");
                            response.msg = "Favorites fetched from store";
                            response.ok = true;
                            localStorage.setItem("favorites", JSON.stringify(response.payload));
                        } else if (localStorage.getItem("favorites")) {
                            response.payload = JSON.parse(localStorage.getItem("favorites"));
                            console.log("From actions.data: Favorites fetched from local storage");
                            response.msg = "Favorites fetched from local storage";
                            response.ok = true;
                            setStore({favorites: response.payload});
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
                                    response.payload = favorites.payload;
                                    console.log("From actions.data: Favorites fetched from API");
                                    response.msg = "Favorites fetched from API";
                                    response.ok = true;
                                    setStore({favorites: response.payload});
                                    localStorage.setItem("favorites", JSON.stringify(response.payload));
                                } else {
                                    console.log(`From actions.data: While fetching favorites from API: ok: ${favorites.ok}, msg: ${favorites.msg}`);
                                    response.msg = favorites.msg;
                                    response.ok = favorites.ok;
                                }
                            } catch (error) {
                                console.log("From actions.data: Error fetching favorites", error);
                                response.msg = "Error fetching favorites";
                            }
                        }
                        return response;
            
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
                                response.payload = favorites.payload;
                                console.log("From actions.data: Favorite added and fetched from API");
                                response.msg = "Favorite added successfully";
                                    response.ok = true;
                                    setStore({favorites: response.payload});
                                    localStorage.setItem("favorites", JSON.stringify(response.payload));
                            } else {
                                console.log(`From actions.data: There was an issue adding favorite: ok: ${favorites.ok}, msg:${favorites.msg}`);
                                response.msg = favorites.msg;
                                response.ok = favorites.ok;
                            }
                        } catch (error) {
                            console.log("From actions.data: Error adding favorite", error);
                            response.msg = "Error adding favorite";
                        }
                        return response;
            
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
                                response.payload = favorites.payload;
                                console.log("From actions.data: Favorite deleted and fetched from API");
                                response.msg = "Favorite deleted successfully";
                                    response.ok = true;
                                    setStore({favorites: response.payload});
                                    localStorage.setItem("favorites", JSON.stringify(response.payload));
                            } else {
                                console.log(`From actions.data: There was an issue deleting favorite: ok: ${favorites.ok}, msg:${favorites.msg}`);
                                response.msg = favorites.msg;
                                response.ok = favorites.ok;
                            }
                        } catch (error) {
                            console.log("From actions.data: Error deleting favorite", error);
                            response.msg = "Error deleting favorite";
                        }
                        return response;
            
                    default:
                        console.log("From actions.data: Unknown action type");
                        return response;
                }
            },  // closing data method

            forgotPassword: async (email) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/forgot-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    });
                    const data = await resp.json();
                    return data;
                } catch (error) {
                    console.log("From actions.forgotPassword: Error requesting the password change email", error);
                    return { ok: false, msg: "Error requesting email" };
                }
            },  // closing forgotPassword method

            swipe: (action, event) => {
                const actions = getActions();
                const store = getStore();                
                if (action === "right" || direction === "left") {
                    if (action === "right") {
                        actions.data("add", event);
                    }                    
                    setStore({ currentIndex: store.currentIndex + 1 });
                    localStorage.setItem("currentIndex", store.currentIndex + 1)
                }
                if (action === "undo"){
                    const newIndex = store.currentIndex - 1;
                    setStore({ currentIndex: Math.max(newIndex, 0) });
                    localStorage.setItem("currentIndex", Math.max(newIndex, 0))
                }
            },  // closing swipe method

            logout: () => {
                setStore({
                    token: null,
                    email: null,
                    location: null,
                    user_id: null,
                    events: [],
                    favorites: [],
                    currentIndex: 0,
                });
                localStorage.removeItem("token")
                localStorage.removeItem("email")
                localStorage.removeItem("location")
                localStorage.removeItem("userId")
                localStorage.removeItem("events")
                localStorage.removeItem("favorites")
                localStorage.removeItem("currentIndex")
            },  // closing logout method

            setup: () => {
                if (localStorage.getItem("token")) {
                    setStore({ token: JSON.parse(localStorage.getItem("token")) });    
                }
                if (localStorage.getItem("email")) {
                    setStore({ email: JSON.parse(localStorage.getItem("email")) });    
                }
                if (localStorage.getItem("location")) {
                    setStore({ location: JSON.parse(localStorage.getItem("location")) });    
                }
                if (localStorage.getItem("userId")) {
                    setStore({ user_id: JSON.parse(localStorage.getItem("userId")) });    
                }
                if (localStorage.getItem("events")) {
                    setStore({ events: JSON.parse(localStorage.getItem("events")) });    
                }
                if (localStorage.getItem("favorites")) {
                    setStore({ favorites: JSON.parse(localStorage.getItem("favorites")) });    
                }
                if (localStorage.getItem("currentIndex")) {
                    setStore({ currentIndex: JSON.parse(localStorage.getItem("currentIndex")) });    
                }
            },  // closing setup method

        }  // closing actions object
    };  // closing return object
};  // closing getState function

export default getState;
