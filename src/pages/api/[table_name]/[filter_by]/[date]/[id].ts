import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import axios from "axios";

// Initialize the cors middleware
const corsMiddleware = cors({
    origin: '*', // Allow requests from any origin. Replace '*' with your actual frontend domain during production.
    methods: ['PUT', 'DELETE'], // Allow GET, PUT, and DELETE requests from the frontend.
});

// Wrap the API route handler with the cors middleware
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const corsAsync = () => new Promise<void>((resolve, reject) => {
        corsMiddleware(req, res, (err?: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    try {
        await corsAsync();

        // Id that will be used for the update,read,delete operations
        // const id = req.query.id as string; 
        const table_name = req.query.table_name as string;
        const filter_by = req.query.filter_by as string;
        const date = req.query.date as string;
        const id = req.query.id as string;

        // Check the HTTP method and handle the corresponding operation
        if (req.method === 'PUT') {
            // Make the Axios request to fetch data by id and wait for the response
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Cassandra-Token': 'AstraCS:UMHldokDeYIhSkNHRHDuIShI:71cef8c7f57909521b2eb550d593e8cf0bc399521633e8fc5c525fa8ee2cb928'
                    }
                };

                const body = JSON.stringify(req.body);

                let path = `${filter_by}/${date}/${id}`;
                let url = `https://70271e02-9616-4b61-8902-f8cd73d5b470-us-east1.apps.astra.datastax.com/api/rest/v2/keyspaces/live_coding/${table_name}/${path}`;

                const response = await axios.put(url, body, config);
                const responseData = response.data; // Extract the data from the response

                res.status(200).json({
                    response: JSON.stringify(responseData),
                    message: "Updated the data successfully"
                });
            } catch (error) {
                console.log("Error is ==>", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        } else if (req.method === 'DELETE') {
            // Make the Axios request to fetch data by id and wait for the response
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Cassandra-Token': 'AstraCS:UMHldokDeYIhSkNHRHDuIShI:71cef8c7f57909521b2eb550d593e8cf0bc399521633e8fc5c525fa8ee2cb928'
                    }
                };

                let path = `${filter_by}/${date}/${id}`;
                let url = `https://70271e02-9616-4b61-8902-f8cd73d5b470-us-east1.apps.astra.datastax.com/api/rest/v2/keyspaces/live_coding/${table_name}/${path}`;

                const response = await axios.delete(url, config);
                const responseData = response.data; // Extract the data from the response

                res.status(200).json({
                    response: JSON.stringify(responseData),
                    message: `Deleted the data successfully with id ${id}`
                });
            } catch (error) {
                console.log("Error Deleting the data ==>", error);
                res.status(500).json({ message: "Error Deleting the data" });
            }
        }
        // Handle unsupported HTTP methods
        res.status(405).end();
    }
    catch (error) {
        console.log("Error with CORS middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default handler;
