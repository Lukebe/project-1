import User from "../models/User";
import db from '../util/pg-connector';
import { userInfo } from "os";

// Returns a user if there is a matching userid
export async function getUserById(id: number): Promise<User> {
    const result = await db.query(`SELECT userid, firstname, lastname, email, role
        FROM users WHERE userId = $1`, [id]);
    return new User(result.rows[0]);
}

// Returns an array of users
export async function getUsers(): Promise<User[]> {
    const result = await db.query(`SELECT userid, firstname, lastname, email, role FROM users ORDER BY userid`);
    return result.rows;

}
export async function updateUser(user: User): Promise<User> {

    updatePassword(user.password, user.userId);

    return new User({
        email: await updateEmail(user.email, user.userId),
        firstname: await updateFirstName(user.firstName, user.userId),
        lastname: await updatelastName(user.lastName, user.userId),
        role: await updateRole(user.role, user.userId),
        userid: user.userId,
        username: await updateUsername,
    });

}

async function updateUsername(username: User["username"], id: User["userId"]): Promise<User["username"]> {
    if (username) {
        const user = await db.query(`UPDATE users SET username = COALESCE($1, username) \
                                WHERE userid = $2 \
                                RETURNING username;`,
                                [username, id]);
        return user.rows[0].username;
    } else {
        const user = await db.query(`SELECT username FROM users WHERE userid = $1;`,
                                [id]);
        return user.rows[0].username;
    }
}

function updatePassword(password: User["password"], id: User["userId"]) {
    if (password) {
        db.query(`UPDATE users SET password = COALESCE($1, password) \
                                WHERE userid = $2 \
                                RETURNING password;`,
                                [password, id]);
    } else {
        db.query(`SELECT password FROM users WHERE userid = $1;`,
                                [id]);
    }
}

async function updateFirstName(firstName: User["firstName"], id: User["userId"]): Promise<User["firstName"]> {
    if (firstName) {
        const user = await db.query(`UPDATE users SET firstname = COALESCE($1, firstname) \
                                WHERE userid = $2 \
                                RETURNING firstname;`,
                                [firstName, id]);
        return user.rows[0].firstname;
    } else {
        const user = await db.query(`SELECT firstname FROM users WHERE userid = $1;`,
                                [id]);
        return user.rows[0].firstname;

    }
}

async function updatelastName(lastName: User["lastName"], id: User["userId"]): Promise<User["lastName"]> {
    if (lastName) {
        const user = await db.query(`UPDATE users SET lastname = COALESCE($1, lastname) \
                                WHERE userid = $2 \
                                RETURNING lastname;`,
                                [lastName, id]);
        return user.rows[0].lastname;
    } else {
        const user = await db.query(`SELECT lastname FROM users WHERE userid = $1;`,
                                [id]);
        return user.rows[0].lastname;

    }
}

async function updateEmail(email: User["email"], id: User["userId"]): Promise<User["email"]> {
    if (email) {
        const user = await db.query(`UPDATE users SET email = COALESCE($1, email) \
                                WHERE userid = $2 \
                                RETURNING email;`,
                                [email, id]);
        return user.rows[0].email;
    } else {
        const user = await db.query(`SELECT email FROM users WHERE userid = $1;`,
                                [id]);
        return user.rows[0].email;
    }
}

async function updateRole(role: User["role"], id: User["userId"]): Promise<User["role"]> {
    if (role) {
        const user = await db.query(`UPDATE users SET role = COALESCE($1, role) \
                                WHERE userid = $2 \
                                RETURNING role;`,
                                [role, id]);
        return user.rows[0].role;
    } else {
        const user = await db.query(`SELECT role FROM users WHERE userid = $1;`,
                                [id]);
        return user.rows[0].role;
    }
}
