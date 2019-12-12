import React, {Component} from 'react';
import {Link, Router} from "@reach/router";
import {connect} from "react-redux";

import Questions from "./Questions";
import Question from "./Question";
import Login from "./Login";
import Alert from "./Alert";
import UserHeader from "./UserHeader";

import { login, logout, loadQuestions, postQuestion, postAnswer, voteAnswerUp, hideAlert } from './actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMsg: ""
        };
    }

    componentDidMount() {
        this.props.loadQuestions();
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
                        <button onClick={() => this.props.hideAlert()} className="delete is-large is-pulled-right" />
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

        return (
            <>
                {notification}

                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <Link to="/"><h1 className="title is-2">Questions and Answers</h1></Link>
                            <h2 className="subtitle">
                                Get help here!
                            </h2>
                        </div>
                    </div>
                </section>

                <UserHeader username={this.props.user.username} logout={_ => this.props.logout()}/>

                <section className="section">
                    <Alert msg={this.state.alertMsg}/>

                    <Router>
                        <Questions path="/"
                            questions={this.props.questions}
                            onAskQuestion={(text) => this.props.postQuestion(text)}
                        />

                        <Question path="/question/:id"
                            getQuestion={(id) => this.props.questions.find(e => e._id === id)}
                            handleVote={(id, aid) => this.props.voteAnswerUp(id, aid)}
                            onPostAnswer={(id, text) => this.props.postAnswer(id, text)}
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
                                <strong>QA Site</strong> by Kristian
                            </p>
                        </div>
                    </div>
                </footer>
            </>
        );
    }
}

const mapStateToProps = state => ({
    questions: state.questions,
    user: state.user,
    notifications: state.notifications
});

const mapDispatchToProps = dispatch => ({
    loadQuestions: _ => dispatch(loadQuestions()),
    postQuestion: text => dispatch(postQuestion(text)),
    postAnswer: (id, text) => dispatch(postAnswer(id, text)),
    login: (username, password) => dispatch(login(username, password)),
    logout: _ => dispatch(logout()),
    voteAnswerUp: (questionId, answerId) => dispatch(voteAnswerUp(questionId, answerId)),
    hideAlert: _ => dispatch(hideAlert())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

