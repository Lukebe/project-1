import express, {Request, Response, response} from 'express';
import Reimbursement from '../models/reimbursement';
import * as reimbursementService from '../services/reimbursement-services';

const reimbursementRouter = express.Router();

// This route is attempting to find all reimbursements in the database
// Only the financeal manager, admin and user if it is their reimbursement can access this successfully
// Will return a list of users or an unauthorized message
reimbursementRouter.get("/status/:statusId",
    async (request: any, response: Response) => {
        if (request.session.roleId == 0 || request.session.roleId === undefined){
            response.status(401).json({message : "You are not authorized for this operation"});
        }
        const statusId = parseInt(request.params.statusId);
        if (statusId > 2 || statusId < 0) {
            response.status(400).json({message : "Invalid Credentials use numbers 0-2"});
        }
        const reimbursement: Reimbursement[] = await reimbursementService.ReimbursementStatus(statusId);

        if (reimbursement.length) {
            response.status(201).json(reimbursement);
        } else {
            response.status(400).json({message : "Invalid Credentials"});
        }
});

reimbursementRouter.get("/author/userId/:userId",
    async (request: any, response: Response) => {
        const userId = parseInt(request.params.userId);
        if (request.session.uid != userId && request.session.roleId == 0 || request.session.roleId === undefined) {
            response.status(401).json({message : "You are not authorized for this operation"});
        }
        const reimbursement: Reimbursement[] = await reimbursementService.ReimbursementUser(userId);

        if (reimbursement.length > 0) {
            response.status(201).json(reimbursement);
        } else {
            response.status(400).json({message: "Invalid Credentials"});
        }
});

reimbursementRouter.post("",
    (request: any, response: Response) => {
        if (!request.session.uid && request.session.uid != 0) {
            response.status(401).json("You must be logged in");
        }

        const reimbursement = new Reimbursement(request.body);
        if (reimbursement.amount && reimbursement.description && (reimbursement.type || reimbursement.type == 0)) {

            reimbursement.author = request.session.uid;

            reimbursementService.CreateReimbursement(reimbursement)
                // This handler recieves the row data from the service method
                .then((rows) => {
                    if (rows.length > 0) {
                        response.status(201).json(rows[0]);
                    } else {
                        response.status(400).json({message: "Invalid Credentials"});
                    }
        });
    } else {
        response.status(401).json({message : "You must supply the amount, description and type."});
    }
});

reimbursementRouter.patch("",
    async (request: any, response: Response) => {
        const patch: Reimbursement = new Reimbursement(request.body);
        if (request.session.roleId == 0 || request.session.roleId === undefined) {
            response.status(401).json({message : "You are not authorized for this operation."});
        }
        if (!patch.reimbursementId) {
            response.status(400).json({
                message : `You must provide the ID number of the reimbursement you wish to change.`,
            });
        }
        if (patch.status > 2 || patch.status < 0){
            response.status(400).json({message : "Invalid Credentials, please enter status 0-2"});
        }
        if (patch.type > 3 || patch.status < 0 ) {
                response.status(400).json({message : "Invalid Credentials, please enter type 0-3"});

            }

        if (patch.dateResolved && !patch.status) {
            patch.status = 2;
        }

        if (patch.status && patch.status > 0) {
            patch.resolver = request.session.uid;
        } else {
            patch.resolver = undefined;
        }

        const patchedReimb = await reimbursementService.PatchReimbursement(patch);

        if (patchedReimb.reimbursementid) {
            response.status(201).json(patchedReimb);
        } else {
            response.sendStatus(400);
        }

});

export default reimbursementRouter;
