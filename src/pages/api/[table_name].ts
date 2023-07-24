import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import axios from "axios";

// Initialize the cors middleware
const corsMiddleware = cors({
    origin: '*', // Allow requests from any origin. Replace '*' with your actual frontend domain during production.
    methods: ['POST'], // Allow POST requests only from the frontend.
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

        // Table name that will be used for the post operation
        const table_name = req.query.table_name as string;

        // Check the HTTP method and handle the corresponding operation
        if (req.method === "POST") {
            // Make the Axios request to fetch data by id and wait for the response
            let body = JSON.stringify(req.body);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://70271e02-9616-4b61-8902-f8cd73d5b470-us-east1.apps.astra.datastax.com/api/rest/v2/keyspaces/live_coding/${table_name}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Cassandra-Token': 'AstraCS:UMHldokDeYIhSkNHRHDuIShI:71cef8c7f57909521b2eb550d593e8cf0bc399521633e8fc5c525fa8ee2cb928'
                },
                data: body
            };

            axios.request(config)
                .then((response) => {
                    const responseData = response.data; // Extract the data from the response

                    console.log(JSON.stringify(responseData));
                    res.status(200).json({
                        response: JSON.stringify(responseData),
                        message: "Todo Added Successfully"
                    });
                }).catch((error) => {
                    console.log(error);
                    console.log("Error is ==>", error);
                    res.status(500).json({ message: "Error while adding new Todo", error });
                });
        }
    }
    catch (error) {
        console.log("Error with CORS middleware:", error);
        res.status(500).json({ message: "Internal Server Error with CORS middleware", error });
    }
};

export default handler;
