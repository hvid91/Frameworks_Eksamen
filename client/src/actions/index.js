import AuthService from "../AuthService";
import {navigate} from "@reach/router"

const API_URL = process.env.REACT_APP_API_URL;
const Auth = new AuthService(`${API_URL}/users/authenticate`);

/******************************************************
 Actions for Notifications
 ******************************************************/
export const showAlert = (title, text, level) => ({
    type: 'SHOW_ALERT',
    title: title,
    text: text,
    level: level
});

export const showAndHideAlert = (title, text, level, delay = 10000) => async function (dispatch) {
    console.log("Delay of " + delay);
    dispatch(showAlert(title, text, level));
    setTimeout(_ => dispatch(hideAlert()), delay);
};

export const hideAlert = (title, text) => ({
    type: 'HIDE_ALERT',
});


/******************************************************
 Actions for User credentials and Login / logout / Creat
 ******************************************************/
export const addUserCredentials = (username) => ({
    type: 'ADD_USER_CRED',
    username: username
});

export const removeUserCredentials = (username) => ({
    type: 'REMOVE_USER_CRED'
});

export const login = (username, password) => async function (dispatch) {
    try {
        const loggedIn = await Auth.login(username, password);
        if (loggedIn.msg === "Username or password missing!" || loggedIn.msg === "Password mismatch!" || loggedIn.msg === "User not found!") {
            dispatch(showAndHideAlert("Login Failed", loggedIn.msg, "error"));
        } else {
            dispatch(addUserCredentials(username));
            navigate("/"); // Front page
        }
    } catch (e) {
        dispatch(showAndHideAlert("Login Failed", e.message, "error"));
    }
};

export const logout = _ => async function (dispatch) {
    Auth.logout();
    dispatch(removeUserCredentials());
};

export const creatUser = (username, password) => async function (dispatch) {
    const url = `${API_URL}/users/create`;
    const response = await Auth.fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        })
    });
    const data = await response.json();

    if (data.msg === "Username or password missing!") {
        dispatch(showAndHideAlert("User not created", data.msg, "error"));
    } else {
        dispatch(showAndHideAlert("User created", data.msg, "alert"));
        navigate("/"); // Front page
    }
};

/******************************************************
 Actions for handling questions and answers.
 ******************************************************/
export const replaceCategories = categories => ({
    type: 'UPDATE_CATEGORIES',
    categories: categories
});

export const loadCategories = _ => async function (dispatch) {
    try {
        const url = `${API_URL}/categories`;
        const response = await Auth.fetch(url);
        const data = await response.json();
        dispatch(replaceCategories(data));
    } catch (e) {
        console.error(e);
        dispatch(showAndHideAlert("Error loading questions", e.message, "error"));
    }
};

export const postQuestion = text => async function (dispatch) {
    if (text === "") return;
    try {
        const newQuestion = {text: text};
        const response = await Auth.fetch(`${API_URL}/questions`, {
            method: "POST",
            body: JSON.stringify(newQuestion)
        });
        if (response.status === 401) {
            dispatch(showAndHideAlert("Login", "You need to login to post questions!", "alert"));
        } else {
            await response.json();
            dispatch(loadCategories());
        }
    } catch (e) {
        dispatch(showAndHideAlert("Send question error", e.message, "error"));
        console.error(e);
    }
};

export const postAnswer = (id, text) => async function (dispatch) {
    if (text === "") return;
    try {
        const response = await Auth.fetch(`${API_URL}/questions/${id}/answers`, {
            method: "POST",
            body: JSON.stringify({text: text})
        });

        if (response.status === 401) {
            dispatch(showAndHideAlert("Login", "You need to login to post answers!", "alert"));
            await navigate("/login");
        } else {
            await response.json();
            dispatch(loadCategories());
        }
    } catch (e) {
        dispatch(showAndHideAlert("Give answer error", e.message, "error"));
        console.error(e);
    }
};

export const voteAnswerUp = (questionId, answerId) => async function (dispatch) {
    try {
        const response = await Auth.fetch(`${API_URL}/questions/${questionId}/answers/${answerId}/vote`, {
            method: "PUT",
            body: JSON.stringify({voteCount: 1})
        });
        if (response.status === 401) {
            dispatch(showAndHideAlert("Login", "You need to login to vote!", "alert"));
            await navigate("/login");
        }
        await response.json();
        dispatch(loadCategories());
    } catch (e) {
        dispatch(showAndHideAlert("Vote error", e.message, "error"));
        console.error(e);
    }
};

