const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const loggerEvent= require("../services/logger")
const logger = loggerEvent("auth/authError")

const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization ||req.headers.Authorization;
    if (!authToken) {
        return res.status(401).json({ message: "No token provided, access denied" });
    }
    try {
        const token = authToken.split(" ")[1];
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ _id: decodedPayload.id, token })
        if (!user) {
            return res.status(404).json({ message: "User not found, don't have an account?" });
        }
        req.user = user;
        next();
    } catch (error) {
        logger.error(error.message)
        return res.status(403).json({ message: "Invalid token, access denied" });
    }
};

const verifyUserRole = (role) => (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user.role === role) {
            next();
        } else {
            return res.status(403).json({ message: `Not allowed, only ${role}` });
        }
    });
};

const verifyTokenOnlyUser = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only user can do this" });
        }
    });
};

const verifyTokenAuthorization = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only user or admin can do this" });
        }
    });
};
const verifyAdminOrEditorRole = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user.role === "admin" || req.user.role === "editor") {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only admin or editor can do this" });
        }
    });
};

const verifyAdminOrInstructorRole = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user.role === "admin" || req.user.role === "instructor") {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only admin or editor can do this" });
        }
    });
};
module.exports = {
    authenticate,
    verifyAdminToken: verifyUserRole("admin"),
    verifyInstructorToken: verifyUserRole("instructor"),
    verifyTokenOnlyUser,
    verifyTokenAuthorization,
    verifyAdminOrEditorRole,
    verifyAdminOrInstructorRole
};
