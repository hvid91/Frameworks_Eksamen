import React, {Component} from 'react';

export default class SellBook extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            author: "",
            categoryID: "",
            price: 0,
            sellerName: "",
            sellerEmail: ""
        };
        this.handleInput = this.handleInput.bind(this);
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
                    <label className="label" htmlFor="QuestionInput">The title</label>
                    <input onChange={event => this.onChange(event)} name="title"/>
                    <label className="label" htmlFor="QuestionInput">The author</label>
                    <input onChange={event => this.onChange(event)} name="author"/>
                    <label className="label" htmlFor="QuestionInput">The category</label>
                    <select onChange={event => this.onChange(event)}
                            name="categoryID">{this.props.categories.map((c, index) =>
                        <option key={index} value={c._id}>{c.category}</option>)}
                    </select>
                    <label className="label" htmlFor="QuestionInput">The price</label>
                    <input onChange={event => this.onChange(event)} type="number" name="price"/>
                    <label className="label" htmlFor="QuestionInput">Your name</label>
                    <input onChange={event => this.onChange(event)} name="sellerName"/>
                    <label className="label" htmlFor="QuestionInput">Your email</label>
                    <input onChange={event => this.onChange(event)} name="sellerEmail"/>
                </div>
                <div className="field">
                    <button className="button is-primary" onClick={this.handleInput} type="submit"
                            id="QuestionButton">Create user
                    </button>
                </div>
            </form>
        )
    };
}