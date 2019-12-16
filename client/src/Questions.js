import React, {Component} from 'react';
import { Link } from "@reach/router";
import AskQuestion from "./AskQuestion";

export default class Questions extends Component {

    render() {
        if (!this.props.questions) return <p>Loading...</p>;

        let trList = this.props.categories.map(elm =>
            <li key={elm._id}><Link className="list-item" to={"/category/" + elm.category}>{elm.text}</Link></li>
        );

        return (
            <div className="container">
                <h2 className="title is-4">Categories</h2>

                <ul className="has-background-white-bis">
                    {trList}
                </ul>
                <div className="container">
                    <AskQuestion onAskQuestion={this.props.onAskQuestion}/>
                </div>
            </div>
        )
    };
}