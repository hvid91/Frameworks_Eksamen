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
export const addUserCredentials = (username, admin) => ({
    type: 'ADD_USER_CRED',
    username: username,
    admin: admin
});

export const removeUserCredentials = (username) => ({
    type: 'REMOVE_USER_CRED'
});

export const login = (username, password) => async function (dispatch) {
    if (username === "" || password === "") {
        dispatch(showAndHideAlert("Empty fields", "You need to put data in all fields", "error"));
        return;
    }
    try {
        const response = await Auth.login(username, password);
        if (response.msg === "Password mismatch!" || response.msg === "User not found!") {
            dispatch(showAndHideAlert("Login failed", response.msg, "error"));
        } else {
            dispatch(addUserCredentials(username, response.admin));
            dispatch(showAndHideAlert("Logged in", "You are now logged in", "alert"));
            navigate("/"); // Front page
        }
    } catch (error) {
        dispatch(showAndHideAlert("Login failed", error.message, "error"));
    }
};

export const logout = _ => async function (dispatch) {
    Auth.logout();
    navigate("/");
    dispatch(removeUserCredentials());
};

export const creatUser = (username, password, admin) => async function (dispatch) {
    if (username === "" || password === "") {
        dispatch(showAndHideAlert("Empty fields", "You need to put data in all fields", "error"));
        return;
    }

    try{
        const url = `${API_URL}/users/create`;
        const response = await Auth.fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
                admin
            })
        });
        const data = await response.json();

        if(data.msg === "The user already exists!"){
            dispatch(showAndHideAlert("User not created", data.msg, "error"));
        }
        else{
            dispatch(showAndHideAlert("User created", "New user created", "alert"));
            navigate("/"); // Front page
        }
    }
    catch (error) {
        dispatch(showAndHideAlert("Login failed", error.message, "error"));
    }
};

    //The is used to fix the deleting of redux state when refresh(F5).
export const loggedInUser = _ => async function (dispatch) {
    if (Auth.getToken()) {
        dispatch(addUserCredentials(Auth.getUsername(), Auth.getAdmin() === "true"));
    }
};


/******************************************************
 Actions for handling categories and books.
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

export const postBook = (title, author, categoryID, price, sellerName, sellerEmail) => async function (dispatch) {
    const reg = RegExp(/^[ÆØÅæøåA-Za-z0-9._%+-]+@(?:[ÆØÅæøåA-Za-z0-9-]+.)+[A-Za-z]{2,6}$/);
    if (title === "" || author === "" || categoryID === "" || sellerName === "" || sellerEmail === "") {
        dispatch(showAndHideAlert("Empty fields", "You need to put data in all fields", "error"));
        return;
    }
    if(price <= 0){
        dispatch(showAndHideAlert("Price error", "The price can be less or equal then 0", "error"));
        return;
    }
    if(!reg.test(sellerEmail)){
        dispatch(showAndHideAlert("Email not valid", "Type in new email", "error"));
        return;
    }
    try {
        const newBook = {
            title: title,
            author: author,
            price: price,
            sellerName: sellerName,
            sellerEmail: sellerEmail
        };

        const response = await Auth.fetch(`${API_URL}/categories/${categoryID}/books`, {
            method: "POST",
            body: JSON.stringify(newBook)
        });
        if (response.status === 401) {
            dispatch(showAndHideAlert("Login failed", "You need to login to sell books!", "alert"));
        } else {
            await response.json();
            dispatch(showAndHideAlert("Book", "Your book is now for sale", "alert"));
            dispatch(loadCategories());
            navigate("/"); // Front page
        }
    } catch (e) {
        dispatch(showAndHideAlert("Book", e.message, "error"));
        console.error(e);
    }
};

export const postCategory = (category) => async function (dispatch) {
    if (category === "") {
        dispatch(showAndHideAlert("Empty field", "You need to put data in the field", "error"));
        return;
    }
    try {
        const response = await Auth.fetch(`${API_URL}/categories`, {
            method: "POST",
            body: JSON.stringify({category: category})
        });

        if (response.status === 401) {
            dispatch(showAndHideAlert("Post failed", "You need to be a admin to post category!", "error"));
            await navigate("/login");
        } else {
            await response.json();
            dispatch(loadCategories());
            dispatch(showAndHideAlert("Post successful", "New category made!", "alert"));
        }
    } catch (e) {
        dispatch(showAndHideAlert("Category error", e.message, "error"));
        console.error(e);
    }
};

export const deleteCategory = (id) => async function (dispatch) {
    try {
        const response = await Auth.fetch(`${API_URL}/categories`, {
            method: "DELETE",
            body: JSON.stringify({id: id})
        });

        if (response.status === 401) {
            dispatch(showAndHideAlert("Delete failed", "You need to be a admin to delete category!", "error"));
            await navigate("/login");
        } else {
            await response.json();
            dispatch(loadCategories());
            dispatch(showAndHideAlert("Delete successful", "The category was deleted!", "alert"));
        }
    } catch (e) {
        dispatch(showAndHideAlert("Category error", e.message, "error"));
        console.error(e);
    }
};

