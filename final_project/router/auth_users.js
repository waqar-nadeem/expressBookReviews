const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if username is valid (not already registered)
const isValid = (username) => {
    return !users.some(user => user.username === username);
};

// Function to authenticate user credentials
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// ✅ Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT token
        const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
        req.session.authorization = { token, username }; // Save token & username in session
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password." });
    }
});

// ✅ Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    if (books[isbn]) {
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review; // Add or update review for this user
        return res.status(200).json({ message: "Review added/updated successfully.", reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// ✅ Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // Remove only the logged-in user's review
        return res.status(200).json({ message: "Review deleted successfully." });
    } else {
        return res.status(404).json({ message: "Review not found for this user or book." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
