// The ‘GET /employees’ endpoint which will allow us to get all the employees in the database.
import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { error } from "console";

// I create the Router for the Employees and the middleware so the router can analyze all http request in json format 
export const employeeRouter = express.Router();
employeeRouter.use(express.json());

// All endpoints are registered for this file under the '/employees' route
employeeRouter.get("/", async (_req, res) => {
    try {
        const employee = await collections.employee.find({}).toArray();
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error.message)
    }
})
