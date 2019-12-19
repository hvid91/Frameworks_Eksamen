module.exports = (dal, io) => {
    let express = require('express');
    let router = express.Router();
    let error = require("../helpers/error_check");

    router.get('/', (req, res) => {
        dal.getCategories().then(categories => res.json(categories));
    });

    router.post('/', (req, res) => {
        if (!req.user.admin) {
            return res.sendStatus(401);
        } else {
            const category = req.body.category;

            if (!category) {
                error.checker(res, "category");
                return;
            }

            const newCategory = {
                category: category,
                books: []
            };

            dal.createCategory(newCategory).then(newCategory => res.json(newCategory));

            io.of("/my_app").emit("new-data", {
                msg: "New data is available"
            });
        }
    });

    router.delete("/", (req, res) => {
        if (!req.user.admin) {
            return res.sendStatus(401);
        } else {
            const id = req.body.id;

            if (!id) {
                error.checker(res, "id");
                return;
            }

            dal.removeCategory(req.body.id).then(deletedCategory => res.json(deletedCategory));

            io.of("/my_app").emit("new-data", {
                msg: "New data is available"
            });
        }
    });

    router.post('/:id/books', (req, res) => {
        const title = req.body.title;
        const author = req.body.author;
        const price = req.body.price;
        const sellerName = req.body.sellerName;
        const sellerEmail = req.body.sellerEmail;

        if (!title) {
            error.checker(res, "title");
            return;
        }
        if (!author) {
            error.checker(res, "author");
            return;
        }
        if (!price) {
            error.checker(res, "price");
            return;
        }
        if (!sellerName) {
            error.checker(res, "sellerName");
            return;
        }
        if (!sellerEmail) {
            error.checker(res, "sellerEmail");
            return;
        }

        const newBook = {
            title: title,
            author: author,
            price: price,
            sellerName: sellerName,
            sellerEmail: sellerEmail
        };

        dal.addBook(req.params.id, newBook).then(newBook => res.json(newBook));
    });

    return router;
};