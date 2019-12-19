import React, {Component} from 'react';
import {navigate} from "@reach/router";

export default class Admin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            category: ""
        };
        this.handleInput = this.handleInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }

   async componentDidMount() {
       await this.props.loggedInUser();

       //Navigate user if they not logged in and have no rights to be here.
       if(!this.props.loggedIn){
            navigate("/login")
        }
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
                        <label className="label" >New category</label>
                        <div className="control">
                        <textarea className="textarea" onChange={this.onChange}
                                  placeholder="Category"
                                  id="AdminInput"/>
                        </div>
                    </div>
                    <div className="field">
                        <button className="button is-primary" onClick={this.handleInput} type="submit"
                                id="CategoryButton">Add Category
                        </button>
                    </div>
                </form>
            </>
        )
    };
}