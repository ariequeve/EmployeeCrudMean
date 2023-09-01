// The ‘GET /employees’ endpoint which will allow us to get all the employees in the database.
import e, * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
import { clear, error } from "console";

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
});

// Get enpoint to allow me to get a single Employee by ID
employeeRouter.get("/:id", async(req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const employee = await collections.employee.findOne(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(500).send(`Failed to find an employee ID: ${id}`);
        }
    } catch (error) {
        res.status(400).send(`Failed to find an employee: ID ${req?.params?.id}`);
    }
});

// Define the POST method to create a new employee
employeeRouter.post("/",async (req, res) => {
    try {
        const employee = req.body;
        const result = await collections.employee.insertOne(employee);

        if (result.acknowledged) {
            res.status(200).send(`Created a new employee: ID ${result.insertedId}.`);
        } else {
            res.status(400).send("Failed to create a new employee.")
        }
    } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
    }
});
