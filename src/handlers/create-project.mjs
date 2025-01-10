/*
To create a userID to test function use:
const userId = crypto.randomBytes(8).toString('hex');
*/

import {client} from "../../utils/dynamoClient.mjs";
import crypto from 'crypto';
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {tasksHelper} from "../../functions/tasks-helper.mjs";

export const createProjectHandler = async (event) => {
    const project = JSON.parse(event.body);
    const tableName = process.env.PROJECTS_TABLE; // DynamoDB table in SAM template
    const {ProjectName: projectName, Tasks: tasks} = project;
    const userId = event.requestContext.authorizer.claims.sub; // Get userId from event provided by cognito
    const projectId = crypto.randomUUID() // Generate projectId

    try {
        console.log("Creating Project", project);
        await client.send(new PutCommand({
            TableName: tableName,
            Item: {
                UserId: userId,
                ProjectId: projectId,
                ProjectName: projectName,
                Tasks: tasksHelper(tasks),
            }
        }));
        console.info(`Successfully created project: ${projectName}`);
        return {
            statusCode: 201,
            body: JSON.stringify({message: "Created project"})
        };
    } catch (e) {
        console.error("Error creating project", e);
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Failed to create project", error: e.message})
        };
    }
};
