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

    if (!isValid(username)) {
        return res.status(400).json({ message: "Username already exists." });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully." });
});

// ✅ Task 1: Get the book list available in the shop (with Promise)
public_users.get('/', (req, res) => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books available.");
        }
    })
    .then(result => res.status(200).json(result))
    .catch(error => res.status(500).json({ message: error }));
});

// ✅ Task 2: Get book details based on ISBN (with Promise)
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found.");
        }
    })
    .then(result => res.status(200).json(result))
    .catch(error => res.status(404).json({ message: error }));
});

// ✅ Task 3: Get book details based on author (with Promise)
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found for this author.");
        }
    })
    .then(result => res.status(200).json(result))
    .catch(error => res.status(404).json({ message: error }));
});

// ✅ Task 4: Get all books based on title (with Promise)
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found with this title.");
        }
    })
    .then(result => res.status(200).json(result))
    .catch(error => res.status(404).json({ message: error }));
});

// ✅ Task 5: Get book review (still synchronous, as reviews are inside books object)
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.general = public_users;