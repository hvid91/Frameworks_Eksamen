class CategoryDAL {
    constructor(mongoose) {
        this.mongoose = mongoose;
        const categorySchema = new mongoose.Schema({
            category: String,
            books: [{
                title: String,
                author: String,
                category: String,
                price: Number,
                sellerName: String,
                sellerEmail: String
            }]
        });
        this.categoryModel = mongoose.model('category', categorySchema);
    }

    async getCategories() {
        try {
            return await this.categoryModel.find({});
        } catch (error) {
            console.error("getCategory:", error.message);
            return {};
        }
    }

    async getCategory(id) {
        try {
            return await this.categoryModel.findById(id);
        } catch (error) {
            console.error("getCategory:", error.message);
            return {};
        }
    }

    async createCategory(newCategory) {
        try{
            let question = new this.categoryModel(newCategory);
            return question.save();
        }
        catch (error) {
            console.error("createCategory:", error.message);
        }
    }

    async removeCategory(categoryID) {
        try {
             return await this.categoryModel.deleteOne({"_id": categoryID})
        } catch (error) {
            console.error("removeCategory:", error.message);
        }
    }

    async addBook(categoryId, book) {
        try{
            const category = await this.getCategory(categoryId);
            category.books.push({
                title: book.title,
                author: book.author,
                category: category.category,
                price: book.price,
                sellerName: book.sellerName,
                sellerEmail: book.sellerEmail
            });
            return category.save();
        }
        catch (error) {
            console.error("addBook:", error.message);
        }
    }

    async bootstrap() {
        const length = (await this.getCategories()).length;

        if (length === 0) {

            let promises = [];

            const category1 = new this.categoryModel({
                category: 'Programming',
                books: [{
                    title: "This is how you code",
                    author: "Lars",
                    category: "Programming",
                    price: 200,
                    sellerName: "Bent",
                    sellerEmail: "bent@gmail.com"
                }]
            });
            promises.push(category1.save());

            const category2 = new this.categoryModel({
                category: 'Graphical Design',
                books: [{
                    title: "This is how you make graphical designs",
                    author: "Lis",
                    category: "Graphical Design",
                    price: 400,
                    sellerName: "Bent",
                    sellerEmail: "bent@gmail.com"
                }]
            });
            promises.push(category2.save());

            const category3 = new this.categoryModel({
                category: 'Virtual Reality',
                books: [{
                    title: "This is how you make virtual reality",
                    author: "Jens",
                    category: "Virtual Reality",
                    price: 500,
                    sellerName: "Karsten",
                    sellerEmail: "karsten@gmail.com"
                }]
            });
            promises.push(category3.save());

            return Promise.all(promises);
        }
    }
}

module.exports = (mongoose) => new CategoryDAL(mongoose);