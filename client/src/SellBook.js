import React, {Component} from 'react';
import {navigate} from "@reach/router";

export default class SellBook extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            author: "",
            categoryID: "",
            price: 0,
            sellerName: "",
            sellerEmail: "",
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
        this.props.postBook(this.state.title, this.state.author, this.state.categoryID, this.state.price, this.state.sellerName, this.state.sellerEmail);
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <form>
                <div className="field">
                    <label className="label" >The title</label>
                    <input onChange={this.onChange} name="title"/>
                    <label className="label" >The author</label>
                    <input onChange={this.onChange} name="author"/>
                    <label className="label" >The category</label>
                    <select onChange={this.onChange} name="categoryID">
                        <option value="" selected disabled hidden>Choose here</option>
                        {this.props.categories.map((c) =>
                            <option key={c._id} value={c._id}>{c.category}</option>)}
                    </select>
                    <label className="label" >The price</label>
                    <input onChange={this.onChange} type="number" name="price"/>
                    <label className="label" >Your name</label>
                    <input onChange={this.onChange} name="sellerName"/>
                    <label className="label" >Your email</label>
                    <input onChange={this.onChange} name="sellerEmail"/>
                </div>
                <div className="field">
                    <button className="button is-primary" onClick={this.handleInput} type="submit"
                            id="BookButton">Sell book
                    </button>
                </div>
            </form>
        )
    };
}