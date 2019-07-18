import bodyParser from 'body-parser';
import express, {Request, Response} from 'express';
import session from 'express-session';
import loginRouter from './routers/login-router';
import reimbursementRouter from './routers/reimbursement-router';
import userRouter from './routers/user-router';
import { closePool } from './util/pg-connector';
import checkToken from './util/token';

const app = express();
const port = 3000;

// Close the pool when app shuts down
process.on("SIGINT", () => {
    closePool();
});

// Register middleware
app.use(bodyParser.json());

app.use(session({
    resave: false,
    saveUnitialized: true,
    secret: "my-secret",
}));

// Register routers
// app.use("/users", checkToken, userRouter);
app.use("/users", userRouter);
app.use("/login", loginRouter);
// app.use("/reimbursements", checkToken, reimbursementRouter);
app.use("/reimbursements", reimbursementRouter);

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
