const bcrypt = require("bcryptjs");
const { api } = require("../helper-files/api");
const db = require("../helper-files/db-conn");
const jwt = require("jsonwebtoken");
const data = {};

const { USERS_CHECK_EXISTING_EMAIL_QUERY, USERS_INSERT_QUERY, FETCH_ALL_USERS_QUERY, INSERT_USER_MESSAGE_QUERY, FETCH_USER_QUERY, FETCH_USER_MESSAGE_QUERY, UPDATE_USER_INFO_QUERY, USERS_CHECK_EXISTING_EMAIL_WITH_ID_QUERY, UPDATE_USER_LOGIN_QUERY } = require("../helper-files/db-query");

const SignUpController = async (req, res) => {
    const { email, password, fullname } = req.body;

    try {
        const existingUser = await db.query(
            USERS_CHECK_EXISTING_EMAIL_QUERY,
            [email]
        );
        if (existingUser.rowCount > 0) {
            return api(res, "User already exists", data, 400);

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            USERS_INSERT_QUERY,
            [fullname, email, hashedPassword]
        ).then((row) => {
            data["userData"] = row.rows[0];

            data["token"] = jwt.sign(
                { userId: row.rows[0].id },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );
            return api(res, "Account Created Successfully", data);
        }).catch((err) => {
            console.log(err);
            return api(res, "Internal server error", [], 500);
        });

    } catch (error) {
        console.log(error);
        return api(res, "Internal server error", [], 500);
    }
}

const SignInController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await db.query(
            USERS_CHECK_EXISTING_EMAIL_QUERY,
            [email]
        );
        if (checkUser.rowCount == 0) {
            return api(res, "No User Found", data, 400);
        }
        const isMatch = await bcrypt.compare(password, checkUser.rows[0].password);
        if (!isMatch) {
            return api(res, "Invalid credentials", [], 401);
        }
        await db.query(UPDATE_USER_LOGIN_QUERY, [true, checkUser.rows[0].id]);

        data["userData"] = checkUser.rows[0];

        data["token"] = jwt.sign(
            { userId: checkUser.rows[0].id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        return api(res, "SignIn successful", data);


    } catch (error) {
        console.error(error);
        return api(res, "Internal server error", [], 500);
    }
}

const LogoutController = async (req, res) => {
    try {
        const { userID } = req.body;

        if (!userID) {
            return api(res, "UserID is required", [], 400);
        }
        const logoutUser = await db.query(UPDATE_USER_LOGIN_QUERY, [false, userID]);

        if (logoutUser.rowCount === 0) {
            return api(res, "No Users Found", [], 404);
        }

        return api(res, "User Logged Out");

    } catch (error) {
        console.error("Error fetching users:", error);
        return api(res, "Internal server error", [], 500);
    }
}

const FetchAllUsers = async (req, res) => {
    try {
        const { userID } = req.query;

        if (!userID) {
            return api(res, "UserID is required", [], 400);
        }
        const getAllUsers = await db.query(FETCH_ALL_USERS_QUERY, [userID]);

        if (getAllUsers.rowCount === 0) {
            return api(res, "No Users Found", [], 404);
        }

        const data = { users: getAllUsers.rows };

        return api(res, `Showing ${getAllUsers.rowCount} users`, data);

    } catch (error) {
        console.error("Error fetching users:", error);
        return api(res, "Internal server error", [], 500);
    }
};

const InsertUserMessage = async (senderId, receiverId, message) => {
    try {
        const result = await db.query(INSERT_USER_MESSAGE_QUERY, [senderId, receiverId, message]);

        if (result.rowCount === 0) {
            return { message: "Unable to send message", status: "error" };
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error saving message:", error);
        return { message: "Error saving message", status: "error" };
    }
};

const FetchUserMessage = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;

        if (!senderId && !receiverId) {
            return api(res, "User IDs are required", [], 400);
        }
        const getUserMessages = await db.query(FETCH_USER_MESSAGE_QUERY, [senderId, receiverId]);

        data.messages = getUserMessages.rows;

        return api(res, "", data);

    } catch (error) {
        console.error("Error fetching messages:", error);
        return api(res, "Internal server error", [], 500);
    }
}

const UpdateUserInfo = async (req, res) => {
    const { email, avatar, fullname, about, id } = req.body;

    try {
        const existingEmail = await db.query(
            USERS_CHECK_EXISTING_EMAIL_WITH_ID_QUERY,
            [email, id]
        );
        if (existingEmail.rowCount > 0) {
            return api(res, "Email already exists", data, 400);

        }

        const updateUser = await db.query(
            UPDATE_USER_INFO_QUERY,
            [fullname, email, avatar, about, id]
        );

        data["userData"] = updateUser.rows[0];

        return api(res, "User Info Updated", data);


    } catch (error) {
        return api(res, "Internal server error", [], 500);
    }
}

module.exports = {
    SignUpController,
    SignInController,
    LogoutController,
    FetchAllUsers,
    FetchUserMessage,
    InsertUserMessage,
    UpdateUserInfo
};