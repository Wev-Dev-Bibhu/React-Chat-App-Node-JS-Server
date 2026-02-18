// Common Addup queries
const WHERE_DELETED_COLUMN_CHECK = " WHERE deleted_at is null;";
const AND_DELETED_COLUMN_CHECK = " AND deleted_at is null;";
const RETURNING_ALL = " RETURNING *;";

// All Users Table Queries
const USERS_INSERT_QUERY = "INSERT INTO users (fullname, email, password, login) VALUES ($1, $2, $3, true)" + RETURNING_ALL;
const USERS_CHECK_EXISTING_EMAIL_QUERY = "SELECT * FROM public.users WHERE email = $1" + AND_DELETED_COLUMN_CHECK;
const FETCH_ALL_USERS_QUERY = "SELECT id, fullname, login, avatar FROM public.users WHERE id != $1" + AND_DELETED_COLUMN_CHECK;
const INSERT_USER_MESSAGE_QUERY = "INSERT INTO messages (sender_id, recipient_id, message_text) VALUES ($1, $2, $3)" + RETURNING_ALL;
const FETCH_USER_QUERY = "SELECT id, fullname, avatar FROM public.users WHERE id = $1" + RETURNING_ALL;
const FETCH_USER_MESSAGE_QUERY = "SELECT id, message_text as message, sender_id as sender, recipient_id as receiver, read_status, delivered_status, created_at FROM public.messages WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) AND deleted_at is null ORDER BY updated_at ASC";

const USERS_CHECK_EXISTING_EMAIL_WITH_ID_QUERY = "SELECT * FROM public.users WHERE email = $1 AND id != $2" + AND_DELETED_COLUMN_CHECK;
const UPDATE_USER_INFO_QUERY = "UPDATE public.users SET fullname =$1, email= $2, avatar = $3, about= $4, updated_at = NOW() WHERE id = $5 " + RETURNING_ALL;

const LOGOUT_USER_QUERY = "UPDATE public.users SET login = false, updated_at = NOW() WHERE id = $1 " + RETURNING_ALL;



module.exports = {
    USERS_INSERT_QUERY,
    USERS_CHECK_EXISTING_EMAIL_QUERY,
    FETCH_ALL_USERS_QUERY,
    INSERT_USER_MESSAGE_QUERY,
    FETCH_USER_QUERY,
    FETCH_USER_MESSAGE_QUERY,
    USERS_CHECK_EXISTING_EMAIL_WITH_ID_QUERY,
    UPDATE_USER_INFO_QUERY,
    LOGOUT_USER_QUERY
};