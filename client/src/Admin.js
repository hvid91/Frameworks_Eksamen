import React, {Component} from 'react';
import {Link, navigate} from "@reach/router";

export default class Admin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            category: ""
        };
        this.handleInput = this.handleInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleInput(event) {
        event.preventDefault();
        this.props.postCategory(this.state.category);
    }

    handleDeleteInput(event, id){
        event.preventDefault();
        this.props.deleteCategory(id)
    }

    onChange(event) {
        this.setState({
            category: event.target.value
        });
    }

    render() {
        if(!this.props.loggedIn){
            navigate("/login")
        }

        return (
            <>
                <div className="container">
                    <section className="section">
                            <ul>
                                {this.props.categories.map(e => <li key={e._id}>{e.category} <button onClick={event => this.handleDeleteInput(event, e._id)}>Delete</button></li>)}
                            </ul>
                    </section>
                </div>

                <form>
                    <div className="field">
                        <label className="label" htmlFor="AnswerInput">New category</label>
                        <div className="control">
                        <textarea className="textarea" onChange={this.onChange}
                                  placeholder="Category"
                                  id="AnswerInput"/>
                        </div>
                    </div>
                    <div className="field">
                        <button className="button is-primary" onClick={this.handleInput} type="submit"
                                id="AnswerButton">Add Category
                        </button>
                    </div>
                </form>
            </>
        )
    };
}