import express, {Request, Response} from 'express';
import User from '../models/user';
import * as loginService from '../services/login-services';
import { AnyARecord } from 'dns';

let jwt = require('jsonwebtoken');

const loginRouter = express.Router();

// This route is attempting to login a user
// All users can access this successfully
// Will return the user that was able to login or an invalid credentials message
loginRouter.post("",
    async (request: any, response: Response) => {
    const user: User = await loginService.validateLogin(request.body);
    if (user.username) {
        request.session.uid = user.userId;
        request.session.roleId = user.role[1];
        response.json(user);
    } else {
        response.status(400).json({message : "username or password is incorrect"});
    }
 });

export default loginRouter;
