import Reimbursement from "../models/reimbursement";
import db from '../util/pg-connector';

export async function ReimbursementStatus(statusId: number): Promise<Reimbursement[]> {
    const result = await PrintOut("reimbursement.status", statusId);
    return result;
}

export async function ReimbursementUser(userId: number): Promise<Reimbursement[]> {
    return await PrintOut("reimbursement.author", userId);
}

export async function CreateReimbursement(reimbursement: Reimbursement): Promise<Reimbursement[]> {

    // This operation will send a query to the database,
    // which will then return a new promise that includes
    // only the row data

    const today = new Date();
    const day = String(today.getDate()); // .padStart(2, '0');
    const month = String(today.getMonth() + 1); // .padStart(2, '0');
    const year = String(today.getFullYear());
    const submitDate = year + "-" + month + "-" + day;

    const data = await db.query(`INSERT INTO reimbursement
        (author, amount, datesubmitted, description, status, type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING reimbursementid, author, amount, datesubmitted, dateresolved,
        description, resolver, status, type`,
            [reimbursement.author, reimbursement.amount, submitDate,
            reimbursement.description, '0', reimbursement.type]);

    return await PrintOut("reimbursement.reimbursementid", data.rows[0].reimbursementid);
}

export async function PatchReimbursement(patch: Reimbursement) {

    const today = new Date();
    const day = String(today.getDate()); // .padStart(2, '0');
    const month = String(today.getMonth() + 1); // .padStart(2, '0');
    const year = String(today.getFullYear());
    const submitDate = year + "-" + month + "-" + day;

    if (patch.resolver) {
        patch.dateResolved = submitDate;
    }

    patch = new Reimbursement(patch);
    const reimbursement = new Reimbursement({
        amount: await UpdateAmount(patch.amount, patch.reimbursementId),
        author: await UpdateAuthor(patch.author, patch.reimbursementId),
        dateresolved: await UpdateDateResolved (patch.dateResolved, patch.reimbursementId),
        datesubmitted: await UpdateDateSubmitted(patch.dateSubmitted, patch.reimbursementId),
        description: await UpdateDescription(patch.description, patch.reimbursementId),
        reimbursementid: patch.reimbursementId,
        resolver: await UpdateResolver(patch.resolver, patch.reimbursementId),
        status: await UpdateStatus(patch.status, patch.reimbursementId),
        type: await UpdateType(patch.type, patch.reimbursementId),
    });
    return (await PrintOut("reimbursement.reimbursementid", reimbursement.reimbursementId))[0];
}

async function UpdateAuthor(
    author: Reimbursement["author"], id: Reimbursement["reimbursementId"]): Promise<Reimbursement["author"]> {

        if (author || author == 0) {
            const reimbursement = await db.query(`UPDATE reimbursement SET author = COALESCE($1, author) \
                                    WHERE reimbursementid = $2 \
                                    RETURNING author;`,
                                    [author, id]);
            return reimbursement.rows[0].author;
        } else {
            const reimbursement = await db.query(`SELECT author FROM reimbursement WHERE reimbursementid = $1;`,
                                    [id]);
            return reimbursement.rows[0].author;
        }
}

async function UpdateAmount(
    amount: Reimbursement["amount"], id: Reimbursement["reimbursementId"]): Promise<Reimbursement["amount"]> {

    if (amount || amount == 0) {
        const reimbursement = await db.query(`UPDATE reimbursement SET amount = COALESCE($1, amount) \
                                WHERE reimbursementid = $2 \
                                RETURNING amount;`,
                                [amount, id]);
        return reimbursement.rows[0].amount;
    } else {
        const reimbursement = await db.query(`SELECT amount FROM reimbursement WHERE reimbursementid = $1;`,
                                [id]);
        return reimbursement.rows[0].amount;
    }
}

async function UpdateDateSubmitted(
    datesubmitted: Reimbursement["dateSubmitted"], id: Reimbursement["reimbursementId"])
    : Promise<Reimbursement["dateSubmitted"]> {

        if (datesubmitted) {
            const reimbursement = await db.query(`UPDATE reimbursement SET datesubmitted = COALESCE($1, datesubmitted) \
                                    WHERE reimbursementid = $2 \
                                    RETURNING datesubmitted;`,
                                    [datesubmitted, id]);
            return reimbursement.rows[0].datesubmitted;
        } else {
            const reimbursement = await db.query(`SELECT datesubmitted FROM reimbursement WHERE reimbursementid = $1;`,
                                    [id]);
            return reimbursement.rows[0].datesubmitted;

        }
}

async function UpdateDateResolved(
    dateresolved: Reimbursement["dateResolved"], id: Reimbursement["reimbursementId"])
    : Promise<Reimbursement["dateResolved"]> {

        if (dateresolved) {
            const reimbursement = await db.query(`UPDATE reimbursement SET dateresolved = COALESCE($1, dateresolved) \
                                    WHERE reimbursementid = $2 \
                                    RETURNING dateresolved;`,
                                    [dateresolved, id]);
            return reimbursement.rows[0].dateresolved;
        } else {
            const reimbursement = await db.query(`SELECT dateresolved FROM reimbursement WHERE reimbursementid = $1;`,
                                    [id]);
            return reimbursement.rows[0].dateresolved;

        }
}

async function UpdateDescription(
    description: Reimbursement["description"], id: Reimbursement["reimbursementId"])
    : Promise<Reimbursement["description"]> {

        if (description) {
            const reimbursement = await db.query(`UPDATE reimbursement SET description = COALESCE($1, description) \
                                    WHERE reimbursementid = $2 \
                                    RETURNING description;`,
                                    [description, id]);
            return reimbursement.rows[0].description;
        } else {
            const reimbursement = await db.query(`SELECT description FROM reimbursement WHERE reimbursementid = $1;`,
                                    [id]);
            return reimbursement.rows[0].description;
        }
}

async function UpdateResolver(
    resolver: Reimbursement["resolver"], id: Reimbursement["reimbursementId"]): Promise<Reimbursement["resolver"]> {

        if (resolver || resolver == 0) {
            const reimbursement = await db.query(`UPDATE reimbursement SET resolver = COALESCE($1, resolver) \
                                    WHERE reimbursementid = $2 \
                                    RETURNING resolver;`,
                                    [resolver, id]);
            return reimbursement.rows[0].resolver;
        } else {
            const reimbursement = await db.query(`SELECT resolver FROM reimbursement WHERE reimbursementid = $1;`,
                                    [id]);
            return reimbursement.rows[0].resolver;
        }
}

async function UpdateStatus(
    status: Reimbursement["status"], id: Reimbursement["reimbursementId"])
    : Promise<Reimbursement["status"]> {

        if (status || status == 0) {
            const reimbursement = await db.query(`UPDATE reimbursement SET status = COALESCE($1, status) \
                                    WHERE reimbursementid = $2 \
                                    RETURNING status;`,
                                    [status, id]);
            return reimbursement.rows[0].status;
        } else {
            const reimbursement = await db.query(`SELECT status FROM reimbursement WHERE reimbursementid = $1;`,
                                    [id]);
            return reimbursement.rows[0].status;
        }
}
async function UpdateType(
    type: Reimbursement["type"], id: Reimbursement["reimbursementId"]): Promise<Reimbursement["type"]> {

    if (type || type == 0) {
        const reimbursement = await db.query(`UPDATE reimbursement SET type = COALESCE($1, type) \
                                WHERE reimbursementid = $2 \
                                RETURNING type;`,
                                [type, id]);
        return reimbursement.rows[0].type;
    } else {
        const reimbursement = await db.query(`SELECT type FROM reimbursement WHERE reimbursementid = $1;`,
                                [id]);
        return reimbursement.rows[0].type;
    }
}

export async function PrintOut(searchColumn: string, searchCriteria) {

    const result = await db.query(
        `SELECT reimbursement.reimbursementid, users.firstname as author, reimbursement.amount,
            reimbursement.datesubmitted, reimbursement.dateresolved, reimbursement.description,
            users2.firstname AS resolver, reimbursementstatus.status, reimbursementtype."type"
        FROM reimbursement
        LEFT JOIN users on users.userid = reimbursement.author
        LEFT JOIN reimbursementstatus on reimbursement.status = reimbursementstatus.statusid
        LEFT JOIN reimbursementtype on reimbursement."type" = reimbursementtype.typeid
        LEFT JOIN users AS users2 on reimbursement.resolver = users2.firstname
        WHERE ` + searchColumn + ` = $1;`, [searchCriteria]);

    return result.rows;
}
