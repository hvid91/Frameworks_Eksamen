import React, {Component} from 'react';
import {Link} from "@reach/router";

export default class Book extends Component {

    render() {
        const bookData = this.props.getBook(this.props._id);
        console.log(bookData);
        let bookContent = <p>loading...</p>;

        if (bookData) {
            bookContent =
                <li key={bookData._id}>
                    {<div key={bookData._id}>
                        <div>{"Title: " + bookData.title}</div>
                        <div>{"Author: " + bookData.author}</div>
                        <div>{"Price : " + bookData.price + "kr"}</div>
                        <div>{"Seller name: " + bookData.sellerName}</div>
                        <div>{"Seller email: " + bookData.sellerEmail}</div>
                    </div>}
                </li>
        }

        return (
            <>
                <div className="container">
                    <section className="section">
                        {bookData ? <h2 className="title is-4">{bookData.category}</h2> : <p>"loading text..."</p>}
                    </section>
                    <section className="section has-background-white-bis">
                        <ul>
                            {bookContent}
                        </ul>
                    </section>
                </div>
                <Link to={"/category/" + this.props.category}><h2 className={"subtitle"}>{`Go back to list of books from ${this.props.category}`}</h2></Link>
            </>
        )
    };
}