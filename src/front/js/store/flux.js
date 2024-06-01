
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
                        setStore({ token: data.token, email});
                    }
                    return { ok: resp.ok, msg: data.msg};
                } catch (error){
                    console.log("Error logging in", error);
                    return {ok: false, msg; "Error logging in"};
            }
        },
    },
};