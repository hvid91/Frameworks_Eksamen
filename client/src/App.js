import React, {Component} from 'react';
import {Link, Router} from "@reach/router";
import {connect} from "react-redux";
import io from 'socket.io-client';

import Categories from "./Categories";
import Books from "./Books";
import Login from "./Login";
import Alert from "./Alert";
import UserHeader from "./UserHeader";
import CreatUser from "./CreatUser";
import Book from "./Book";
import SellBook from "./SellBook";
import Admin from "./Admin";

import {login, logout, loadCategories, postBook, postCategory, loggedInUser, hideAlert, creatUser, deleteCategory} from './actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMsg: ""
        };
    }

    SOCKET_URL = "https://frameworks-eksamen-2019.herokuapp.com/my_app";

    componentDidMount() {
        this.props.loadCategories();
        this.props.loggedInUser();

        const socket = io(this.SOCKET_URL);

        socket.on("new-data", (data) => {
            console.log(`server msg: ${data.msg}`);
            this.props.loadCategories();
        });
    }

    resetAlert() {
        this.setState({
            alertMsg: "",
            suppressInfo: true
        })
    }

    render() {
        let notification = <></>;
        if (this.props.notifications.active) {
            const notif = this.props.notifications;
            const level = notif.level === "error" ? "is-danger" : "is-warning";

            notification = <section className={`hero ${level} is-small`}>
                <div className="hero-body">
                    <div className="container">
                        <button onClick={() => this.props.hideAlert()} className="delete is-large is-pulled-right"/>
                        <h1 className="title">
                            {notif.title}
                        </h1>
                        <h2 className="subtitle">
                            {notif.text}
                        </h2>
                    </div>
                </div>
            </section>
        }

        let userLoggedIn = <></>;
        if (this.props.user.username) {
            userLoggedIn = <Link to="/books/sell"><h2 className={"subtitle"}>Sell books</h2></Link>
        } else {
            userLoggedIn = <Link to="/login"><h2 className={"subtitle"}>Sell books</h2></Link>
        }

        let adminLoggedIN = <></>;
        if (this.props.user.admin) {
             adminLoggedIN = <Link to="/admin"><h2 className={"subtitle"}>Admin page</h2></Link>
        }

        return (
            <>
                {notification}

                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <Link to="/"><h1 className="title is-2">Marketplace for books</h1></Link>
                            <h2 className="subtitle">
                                Pick a category and find books!
                            </h2>
                            <Link to="/users/create"><h2 className={"subtitle"}>Create User</h2></Link>
                            {userLoggedIn}
                            {adminLoggedIN}
                        </div>
                    </div>
                </section>

                <UserHeader username={this.props.user.username} logout={_ => this.props.logout()}/>

                <section className="section">
                    <Alert msg={this.state.alertMsg}/>

                    <Router>
                        <Categories path="/"
                                    categories={this.props.categories}
                        />

                        <CreatUser path="/users/create"
                                   creatUser={(username, password, admin) => this.props.creatUser(username, password, admin)}
                        />

                        <Books path="/category/:category"
                               getCategories={(category) => this.props.categories.find(e => e.category === category)}
                        />

                        <Book path="/books/:category/:_id"
                            getBook={_id => this.props.categories.map(d => d.books.find(e => e._id === _id)).filter(c => c !== undefined)[0]}
                        />

                        <SellBook path="/books/sell"
                                  categories={this.props.categories}
                                  postBook={(title, author, categoryID, price, sellerName, sellerEmail) => this.props.postBook(title, author, categoryID, price, sellerName, sellerEmail)}
                                  loggedIn={this.props.user.username}
                                  loggedInUser={_ => this.props.loggedInUser()}
                    />

                        <Admin path="/admin"
                               categories={this.props.categories}
                               loggedIn={this.props.user.admin}
                               loggedInUser={_ => this.props.loggedInUser()}
                               postCategory={category => this.props.postCategory(category)}
                               deleteCategory={id => this.props.deleteCategory(id)}
                        />

                        <Login path="/login"
                               login={(username, password) => this.props.login(username, password)}
                               infoMsg={this.state.infoMsg}
                        />
                    </Router>
                </section>
                <footer className="footer">
                    <div className="container">
                        <div className="content has-text-centered">
                            <p>
                                <strong>Site</strong> by Michael
                            </p>
                        </div>
                    </div>
                </footer>
            </>
        );
    }
}

const mapStateToProps = state => ({
    categories: state.categories,
    user: state.user,
    notifications: state.notifications
});

const mapDispatchToProps = dispatch => ({
    loadCategories: _ => dispatch(loadCategories()),
    loggedInUser: _ => dispatch(loggedInUser()),
    postBook: (title, author, categoryID, price, sellerName, sellerEmail) => dispatch(postBook(title, author, categoryID, price, sellerName, sellerEmail)),
    postCategory: (category) => dispatch(postCategory(category)),
    deleteCategory: id => dispatch(deleteCategory(id)),
    login: (username, password) => dispatch(login(username, password)),
    logout: _ => dispatch(logout()),
    creatUser: (username, password, admin) => dispatch(creatUser(username, password, admin)),
    hideAlert: _ => dispatch(hideAlert())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

