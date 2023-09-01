import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: {
    employee?: mongodb.Collection<Employee>;
} = {};

export async function connectToDatabase(uri:string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackExpample");
    await applySchemaValidation(db);

    const employeeCollection = db.collection<Employee>("employee");
    collections.employee = employeeCollection;    
}

// Update our existing collection with JSON schema validation 
// so we know our documents will always match the shape of our Employee model, even if added elsewhere.
async function applySchemaValidation(db: mongodb.Db) {
    //throw new Error("Function not implemented.");
    const jsonSchema = {
        $jasonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and String",
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and Stirng",
                    length: 5
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and is one of 'junior', 'mid' or 'señor'",
                    enum: ["junior", "mid", "senior"],
                },            
            },
        },
    };
    // Try applying the modification to the collection, if the collection doesn't exist, create it
    await db.command({
        collMod: "employees",
        validator: jsonSchema,
    }).catch (async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NameSpaceNotFound') {
            await db.createCollection ("employees", {validator: jsonSchema});
        }
    });
}