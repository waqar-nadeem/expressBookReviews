const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session setup for customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['token'];
        jwt.verify(token, "secretKey", (err, user) => {
            if (!err) {
                req.user = user; // attach user info to request
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Mount customer routes (login, review routes, etc.)
app.use("/customer", customer_routes);

// Mount general routes
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
