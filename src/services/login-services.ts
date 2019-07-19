import User from "../models/User";
import db from '../util/pg-connector';

export async function validateLogin(userCredentials): Promise<User>{
    const result = await db.query(`SELECT userid, username, firstname, lastname, email, role
                                    FROM users
                                    WHERE username = $1 AND password = $2;`,
                                        [userCredentials.username, userCredentials.password]);
    if (!result.rows[0]) {
        // throw error
    } else {
        return new User(result.rows[0]);
    }
}
