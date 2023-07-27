// Path : src/pages/api/[table_name]/[filter_by]/[date]/[id].ts

import axios from "axios";
import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
const corsMiddleware = cors({
  origin: "*", // Allow requests from any origin.
  methods: ["PUT", "DELETE"], // Allow only the GET, PUT, and DELETE requests from the frontend.
});

// Wraping the API route handler with the cors middleware
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const corsAsync = () =>
    new Promise<void>((resolve, reject) => {
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

    // Required variables
    const table_name = req.query.table_name as string;
    const filter_by = req.query.filter_by as string;
    const date = req.query.date as string;
    // Id that will be used for the update,read,delete operations
    const id = req.query.id as string;

    // Check the HTTP method and handle the corresponding operation
    if (req.method === "PUT") {
      // Make the Axios request to fetch data by id and wait for the response
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Cassandra-Token":
              "AstraCS:UMHldokDeYIhSkNHRHDuIShI:71cef8c7f57909521b2eb550d593e8cf0bc399521633e8fc5c525fa8ee2cb928",
          },
        };

        const body = JSON.stringify(req.body);

        let path = `${filter_by}/${date}/${id}`;

        const response = await axios.put(
          `https://70271e02-9616-4b61-8902-f8cd73d5b470-us-east1.apps.astra.datastax.com/api/rest/v2/keyspaces/live_coding/${table_name}/${path}`,
          body,
          config
        );
        const responseData = response.data; // Extract the data from the response

        res.status(200).json({
          response: JSON.stringify(responseData),
          message: "Updated the data successfully",
        });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else if (req.method === "DELETE") {
      // Make the Axios request to fetch data by id and wait for the response
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Cassandra-Token":
              "AstraCS:UMHldokDeYIhSkNHRHDuIShI:71cef8c7f57909521b2eb550d593e8cf0bc399521633e8fc5c525fa8ee2cb928",
          },
        };

        let path = `${filter_by}/${date}/${id}`;

        // Demo Path:  70271e02-9616-4b61-8902-f8cd73d5b470-us-east1.apps.astra.datastax.com/api/rest/v2/keyspaces/live_coding/todos/Muhammad-Bilal/2020-10-10/9da1bdfa-1cc0-4c3f-981f-7c0911f78ba8

        let url = `https://70271e02-9616-4b61-8902-f8cd73d5b470-us-east1.apps.astra.datastax.com/api/rest/v2/keyspaces/live_coding/${table_name}/${path}`;

        const response = await axios.delete(url, config);
        const responseData = response.data; // Extract the data from the response

        res.status(204).json({
          response: JSON.stringify(responseData),
          message: `Deleted the data successfully with id ${id}`,
        });
      } catch (error) {
        res.status(500).json({ message: "Error Deleting the data" });
      }
    }
    // Handle unsupported HTTP methods
    res.status(405).end();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
