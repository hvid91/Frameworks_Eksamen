module.exports = (dal, io) => {
    let express = require('express');
    let router = express.Router();

    router.get('/', (req, res) => {
        dal.getCategories().then(categories => res.json(categories));
    });

    router.post('/', (req, res) => {
        let newCategory = {
            category: req.body.category,
            books: []
        };
        dal.createCategory(newCategory).then(newCategory => res.json(newCategory));

        io.of("/my_app").emit("new-data", {
            msg: "New data is available"
        });
    });

    router.delete("/", (req, res) => {
        dal.removeCategory(req.body.id).then(deletedCategory => res.json(deletedCategory));

        io.of("/my_app").emit("new-data", {
            msg: "New data is available"
        });
    });

    router.post('/:id/books', (req, res) => {
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            sellerName: req.body.sellerName,
            sellerEmail: req.body.sellerEmail
        };

        dal.addBook(req.params.id, newBook).then(newBook => res.json(newBook));
    });

    return router;
};