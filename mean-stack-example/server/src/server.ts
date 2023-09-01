// Load the environment variables from it, connect to the database, and start the server:
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { dot } from "node:test/reporters";
import { employeeRouter } from "./employee.routes";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase (ATLAS_URI)
    .then (() => {
        const app = express();
        app.use(cors());
        // Registar and start the express server
        app.use("employees", employeeRouter);
        app.listen(5200, () => {
            console.log(`server running at https://localhost:5200..`)
        })

    })
    .catch(error => console.error(error));
    