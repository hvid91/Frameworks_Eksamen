import React, {Component} from 'react';
import {Link} from "@reach/router";
// import PostAnswer from "./PostAnswer";

export default class Books extends Component {

    render() {
        const category = this.props.getCategories(this.props.category);
        let categoryContent = <p>loading...</p>;

        if (category) {
            categoryContent = category.books ?
                category.books.map(
                    book =>
                        <li key={book._id}>
                            <Link className="list-item" to={"/books/" + book._id}>
                                {<div key={book._id} className="columns">
                                    <div className="column">{book.title}</div>
                                </div>}</Link>
                        </li>
                ) : [];
        }

        return (
            <>
                <div className="container">
                    <section className="section">
                        {category ? <h2 className="title is-4">{category.category}</h2> : <p>"loading text..."</p>}
                    </section>
                    <section className="section has-background-white-bis">
                        <ul>
                            {categoryContent}
                        </ul>
                    </section>
                </div>
            </>
        )
    };
}