export class DB {
    constructor() {
        // Our example static data set
        this.books = [
            {
                title: 'The Awakening',
                author: 'Kate Chopin',
            },
            {
                title: 'City of Glass',
                author: 'Paul Auster',
            },
        ];
    }
    getBooks() {
        // simulate fetching a list of books
        return this.books;
    }
    // We are using a static data set for this small example, but normally
    // this Mutation would *mutate* our underlying data using a database
    // or a REST API.
    async addBook(book) {
        this.books.push(book);
        console.log(this.books);
        return {
            code: '200',
            success: true,
            message: 'New book added!',
            book: this.books[this.books.length - 1],
        };
    }
}
