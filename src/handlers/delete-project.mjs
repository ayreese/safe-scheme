import { validateBody } from "../../functions/validate.mjs";


// Function to get projects from table based on user-id
export const deleteProjectHandler = async (event) => {
    await validateBody(event);

};
