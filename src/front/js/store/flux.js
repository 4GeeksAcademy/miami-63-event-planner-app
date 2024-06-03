const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: null,
            email: null,
            events: [],
            favorites: [],
            currentIndex: 0,
        },
        actions: {
            newUser: async (email, password, location) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
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
                        body: JSON.stringify({email,password}),
                    });
                    const data = await resp.json();
                    if (resp.ok) {
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("email", email);
                        setStore({ token: data.token, email });
                    }
                    return { ok: resp.ok, msg: data.msg };
                } catch (error){
                    console.log("Error logging in", error);
                    return {ok: false, msg: "Error logging in"};
                }
            },

            data: async (action, id, payload) => {
                const store = getStore();
                const actions = getActions();  // Correct variable name to avoid conflict
                let data;

                switch (action) {
                    case "events":
                        data = store.events;
                        if (data.length === 0) {  // Correct typo in length
                            try {
                                const resp = await fetch(process.env.BACKEND_URL + "/api/events");
                                data = await resp.json();
                                setStore({ events: data });
                            } catch (error) {
                                console.log("Error fetching events", error);
                            }
                        }
                        return data;

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

                    case "add-favorite":
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

                    case "delete-favorite":
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
            },

            swipeEvent: (direction, event) => {
                const actions = getActions();
                if (direction === "right") {
                    actions.data("add-favorite", event.id, event);
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
