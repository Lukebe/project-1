import express, {Request, Response} from '../../node_modules/express';
import User from '../models/user';
import * as userService from '../services/user-services';

const userRouter = express.Router();
/**
 * A router has methods to handle specific http methods
 * Additionally, we could handle all of them using 'all'
 * Http Methods
 * ----
 * GET, POST, PATCH, PUT, DELETE
 */

// This route is attempting to find all users in the database
// Only the financeal manager and the admin can access this successfully
// Will output a list of users or an unauthorized message
userRouter.get("",
    async (request: Request, response: Response) => {
        if (request.session.roleId == 0 || request.session.roleId === undefined) {
            response.status(401).json({message : "You are not authorized for this operation"});
        }
        const user: User[] = await userService.getUsers();

        if (user.length > 0) { // } && request.token.role[0] > 0) {
            response.status(201).json(user);
        } else {
            response.status(400).json({message: `There are no users  D:     :'(
                                                    I am so lonely`});
        }
 });

// This route is attempting to find one user in the database by ID number
// Only the financeal manager or admin or the user being looked up can access this successfully
// Will output the user or an unauthorized message
userRouter.get("/:id",
    async (request: Request, response: Response) => {
    const id = parseInt( request.params.id );
    if (request.session.uid != id && request.session.roleId == 0 || request.session.roleId === undefined) {
        response.status(401).json({message : "You are not authorized for this operation"});
    }

    const user: User = await userService.getUserById(id);
    if (user.userId || user.userId == 0) {
        response.status(201).json(user);
    } else {
        response.status(400).json({message: "Invalid Credentials"});
    }
 });

// This route is attempting to update a user's information in the database
// Only the admin can access this successfully
// Will output user with its updated information or an unauthorized message
userRouter.patch("",
    async (request: Request, response: Response) => {
    if (request.session.roleId == 0 || request.session.roleId === undefined) {
        response.status(401).json({message : "You are not authorized for this operation"});
    }
    const patch: User = new User(request.body);
    if (!patch.userId && patch.userId != 0) {
        response.status(400).json({
            message : `You must provide the ID number of the user you wish to update.`,
        });
    }
    try {
        const user: User = await userService.updateUser(patch);

        if (user.userId || user.userId == 0) {
            response.status(201).json(user);
        } else {
            response.status(400).json({message: "Invalid Credentials"});
        }
    } catch (err) {
        response.status(400).json({message: `Invalid Credentials, role not valid
                                            valid role values: "(0,user)", "(1,finance-manager)", "(2,admin)"`});
    }
 });

export default userRouter;
