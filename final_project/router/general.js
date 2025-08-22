const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ✅ Task 7: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists." });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully." });
});

// ✅ Task 10: Get the list of books (async/await)
public_users.get('/', async (req, res) => {
    try {
        const result = await Promise.resolve(books);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// ✅ Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await Promise.resolve(books[isbn]);
        if (book) res.status(200).json(book);
        else throw "Book not found";
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// ✅ Task 12: Get book details based on Author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const filteredBooks = await Promise.resolve(
            Object.entries(books)
                .filter(([isbn, book]) => book.author.toLowerCase() === author)
                .map(([isbn, book]) => ({ isbn, title: book.title, author: book.author }))
        );
        if (filteredBooks.length > 0) res.status(200).json(filteredBooks);
        else throw "No books found for this author";
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// ✅ Task 13: Get book details based on Title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const filteredBooks = await Promise.resolve(
            Object.values(books).filter(book => book.title.toLowerCase() === title)
        );
        if (filteredBooks.length > 0) res.status(200).json(filteredBooks);
        else throw "No books found with this title";
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// ✅ Task 5: Get book review (synchronous)
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        if (Object.keys(reviews).length > 0) {
            return res.status(200).json(reviews);
        } else {
            return res.status(200).json({ message: "No reviews available for this book." });
        }
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.general = public_users;
