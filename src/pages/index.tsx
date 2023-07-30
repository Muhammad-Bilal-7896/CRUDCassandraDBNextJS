// Path : src/pages/index.tsx

import { useEffect, useRef, useState } from "react";

import axios from "axios";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import { Button, CircularProgress, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

// Importing Components
import Footer from "@/components/Footer";
import SnackBar from "@/components/SnackBar";
import TodoList from "@/components/TodoList";
import { TODO_LIST_TYPE } from "@/components/types";
import Head from "next/head";

const Home = () => {
  const ref: any = useRef(null);

  // Snack Bar Alert
  const [snackBarHandler, setSnackBarHandler] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  //

  const [loading, setLoading] = useState<boolean>(true);

  // To store the all todo items from the database. It is an array dear learners.
  const [todosList, setTodosList] = useState<any>([]);

  // Todo Values
  const [todoTitle, setTodoTitle] = useState<string>("");
  const [todoDescription, setTodoDescription] = useState<string>("");
  const [todoCompleted, setTodoCompleted] = useState<string>("incomplete");

  const handleChangeTodoStatus = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTodoCompleted((event.target as HTMLInputElement).value);
  };

  // To check while updating the todo item so that you are able to show the update button
  const [updatingTodo, setUpdatingTodo] = useState<boolean>(false);

  // To store current updating todo item
  const [currentUpdatingTodo, setCurrentUpdatingTodo] =
    useState<TODO_LIST_TYPE>(
      {} as {
        postedBy: string;
        date: string;
        title: string;
        description: string;
        completed: boolean;
        id: string;
      }
    );

  // The table name which you have created in the Astra DB database
  const TABLE_NAME: string = "todos";

  // The partition key of the table from which you will filter/fetch the todo items
  const FILTERED_BY: string = "Muhammad-Bilal";

  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to fetch all the todo items from the database
  const fetchTodos = async () => {
    // Astra DB REST API GET request
    axios
      .get(`/api/${TABLE_NAME}/${FILTERED_BY}`)
      .then((response) => {
        // alert("GET Response response.data.data ==> ")
        console.log("GET Response response.data.data ==> ", response);

        let todo_list = response.data.response.data;

        //reverse the todo list
        todo_list.reverse();

        setTodosList(todo_list);
        setLoading(false);
      })
      .catch((error) => {
        // alert("Error ==> ")
        console.log("Error is ==> ", error);
      });
  };

  // Function to update a todo item by id
  const addTodo = async () => {
    let date = new Date().toUTCString();

    // If the user clicks the cancel button, then return early from this function
    if (todoTitle === "" || todoDescription === "" || date === null) {
      setSnackBarHandler({
        open: true,
        message: "Please enter all the todo item details to add todo!",
        severity: "error",
      });
      return;
    }

    // Check if the user entered all the updated todo item details
    if (todoTitle !== "" && todoDescription !== "" && date !== null) {
      const todoData = {
        posted_by: FILTERED_BY,
        date: date,
        title: todoTitle,
        description: todoDescription,
        completed: todoCompleted === "completed" ? true : false,
        id: uuidv4(),
      };

      console.log("Todo Data is ==> ", todoData);

      try {
        // Make a POST request to add the todo item
        const response = await axios.post(`/api/${TABLE_NAME}`, todoData);

        // add the todo item to the todo list at the top
        setTodosList([todoData, ...todosList]);

        setSnackBarHandler({
          open: true,
          message: "Todo 🚀 item added successfully!",
          severity: "success",
        });

        // Reset the todo item details in the state
        setTodoTitle("");
        setTodoDescription("");
        setTodoCompleted("incomplete");

        console.log("Adding Todo ⏳ Response:", response);
      } catch (error) {
        setSnackBarHandler({
          open: true,
          message: "Error ⚠️ adding todo item!",
          severity: "error",
        });

        console.error("Error ⚠️ adding todo item! ", error);
      }
    } else {
      setSnackBarHandler({
        open: true,
        message: "Please enter all the todo item details to add todo!",
        severity: "error",
      });

      return;
    }
  };

  const startUpdatingTodo = (item: TODO_LIST_TYPE) => {
    // Prompt the user to enter the updated todo item details
    ref.current?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      // Set the todo item details in the state
      setTodoTitle(item.title);
      setTodoDescription(item.description);
      setTodoCompleted(item.completed === true ? "incomplete" : "completed");

      // Set the current updating todo item in the state
      setCurrentUpdatingTodo(item);

      // Set the updating todo state to true
      setUpdatingTodo(true);
    }, 1000);
  };

  // Function to update a todo item by id
  const updateTodo = async () => {
    // Check if the user entered all the updated todo item details
    if (todoTitle !== "" && todoDescription !== "") {
      const updatedData = {
        title: todoTitle,
        description: todoDescription,
        completed: todoCompleted === "completed" ? true : false,
      };

      let updateAPIUrl = `/api/${TABLE_NAME}/${FILTERED_BY}/${currentUpdatingTodo.date}/${currentUpdatingTodo.id}`;

      // alert("updateAPIUrl ==> " + updateAPIUrl);

      try {
        setLoading(true);
        // Make a PUT request to update the todo item
        const response = await axios.put(updateAPIUrl, updatedData);
        // setLoading(true);
        // fetchTodos();

        setTodosList((prevTodos: any) =>
          prevTodos.map((todo: any) => {
            if (todo.id === currentUpdatingTodo.id) {
              return {
                ...todo,
                title: todoTitle,
                description: todoDescription,
                completed: todoCompleted === "completed" ? true : false,
              };
            }
            return todo;
          })
        );

        // alert("Todo 📅 item updated successfully!");

        setSnackBarHandler({
          open: true,
          message: `Todo 📅 : ${currentUpdatingTodo.title} updated successfully!`,
          severity: "success",
        });

        setLoading(false);

        setUpdatingTodo(false);

        // Reset the todo item details in the state
        setTodoTitle("");
        setTodoDescription("");
        setTodoCompleted("incomplete");

        console.log("Update Todo 📅 Item Response:", response);
      } catch (error) {
        // alert("Error ⚠️ updating todo 📅 item!");

        setLoading(false);

        setUpdatingTodo(false);

        // Reset the todo item details in the state
        setTodoTitle("");
        setTodoDescription("");
        setTodoCompleted("incomplete");

        setSnackBarHandler({
          open: true,
          message: `Error ⚠️ updating todo 📅 ${currentUpdatingTodo.title}!`,
          severity: "error",
        });

        console.error("Update Error:", error);
      }
    } else {
      setSnackBarHandler({
        open: true,
        message:
          "Please enter all the updated todo item details to update todo! Thanks.",
        severity: "error",
      });
    }
  };

  // Function to mark a todo as completed
  const markTodoAsCompleted = async (item: TODO_LIST_TYPE) => {
    try {
      const updatedData = {
        completed: !item.completed,
      };

      setUpdatingTodo(true);

      // Make a PUT request to update the todo item
      const response = await axios.put(
        `/api/${TABLE_NAME}/${FILTERED_BY}/${item.date}/${item.id}`,
        updatedData
      );
      // setLoading(true);
      // fetchTodos();

      setTodosList((prevTodos: any) =>
        prevTodos.map((todo: any) => {
          if (todo.id === item.id) {
            return {
              ...todo,
              completed: !item.completed,
            };
          }
          return todo;
        })
      );

      setUpdatingTodo(false);
      // alert("Todo 📅 item marked as complete successfully!");

      setSnackBarHandler({
        open: true,
        message: `Todo 📅 : ${item.title} marked as complete successfully!`,
        severity: "success",
      });

      console.log("Todo 📅 Item marked as completed Response:", response);
    } catch (error) {
      // alert("Error ⚠️ marking todo item 📅 as complete!");

      setUpdatingTodo(false);

      setSnackBarHandler({
        open: true,
        message: `Error ⚠️ marking todo ${item.title} as complete!`,
        severity: "error",
      });

      console.log("Error ⚠️ marking todo item 📅 as complete!", error);
    }
  };

  // Function to delete a todo item by id
  const deleteTodo = async (item: any) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Cassandra-Token":
            "AstraCS:UMHldokDeYIhSkNHRHDuIShI:71cef8c7f57909521b2eb550d593e8cf0bc399521633e8fc5c525fa8ee2cb928",
        },
      };

      // Make a DELETE request to delete the todo item
      const response = await axios.delete(
        `/api/${TABLE_NAME}/${FILTERED_BY}/${item.date}/${item.id}`,
        config
      );
      // alert("Todo item deleted successfully!");

      setSnackBarHandler({
        open: true,
        message: `Todo 📅 : ${item.title} deleted successfully!`,
        severity: "success",
      });

      console.log("Delete Response:", response);

      // After successful deletion, update the todosList state to remove the deleted item from the UI
      setTodosList((prevTodos: any) =>
        prevTodos.filter((newItem: any) => newItem.id !== item.id)
      );
    } catch (error) {
      // alert("Error deleting todo item!");

      setSnackBarHandler({
        open: true,
        message: `Error ⚠️ deleting todo ${item.title}!`,
        severity: "error",
      });

      console.error("Delete Error:", error);
    }
  };

  return (
    <div>
      <Head>
        <title>Cassandra Db Todo App</title>
        <meta
          name="description"
          content={`
          A Todo app that will use Apache Cassandra to store the todos and addition, deletion and update of todos will be handled by the Apache Cassandra.
          We will discuss the following in detail
          Overview of Apache Cassandra 
          Cassandra Data Modeling
          Cassandra Db Structure
          Creating a new serverless Astra Db Database and utilizing its API using NextJS that will perform CRUD(create,read,update,delete) operations utilizing Astra DB 
          Build a front end using Next JS to utilize that API
          At the end we will be ready with a full stack cassandra db todo app
          I will do everything from scratch so that every begginer can understand and everything will be step by step.
          <a
            className="subscribeButton mt-2"
            href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=6945124839913320448"
            target="_blank"
          >
            Subscribe on LinkedIn
          </a>
        `}
        />
        <meta name="author" content="Muhammmad-Bilal-7896" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container ml-auto mr-auto">
        <h1
          ref={ref}
          className="text-4xl text-center mt-4 font-bold font-sans text-blue-500"
        >
          Cassandra DB Todo App 🚀 Made by{" "}
          <a href="https://github.com/Muhammad-Bilal-7896/">Muhammad Bilal</a>
        </h1>
        <p className="text-center mt-4 text-2xl">
          <a
            className="text-gray-600 font-light"
            href="https://github.com/Muhammad-Bilal-7896/"
          >
            Want to develop similar application, follow this{" "}
            <span className="text-blue-500 underline">
              FullStack Cassandra + Next JS CRUD
            </span>
          </a>
        </p>
        <br />
        <div className="flex flex-row items-center justify-center text-center w-100">
          <a
            className="subscribeButton mt-2"
            href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=6945124839913320448"
            target="_blank"
          >
            Subscribe on LinkedIn
          </a>
        </div>
        <div className="flex justify-center item-center">
          <Image
            src="/logo.png"
            alt="Picture of the author"
            title="Picture of the author"
            width={500}
            height={300}
            style={{
              height: 200,
              width: 400,
              borderRadius: 10,
              marginTop: 20,
              marginBottom: 20,
            }}
          />
        </div>
        {!loading ? (
          <>
            <div className="flex flex-col justify-center item-center">
              <div>
                <TextField
                  variant="standard"
                  label="Todo Title"
                  placeholder="Enter Todo title"
                  className="w-full"
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                />
                <TextField
                  variant="standard"
                  label="Todo Description"
                  placeholder="Enter Todo description"
                  className="w-full mt-2"
                  multiline
                  rows={4}
                  value={todoDescription}
                  onChange={(e) => setTodoDescription(e.target.value)}
                />
                <FormControl className="mt-6">
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Todo Status
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={todoCompleted}
                    onChange={handleChangeTodoStatus}
                  >
                    <FormControlLabel
                      value="completed"
                      control={<Radio />}
                      label="Completed"
                    />
                    <FormControlLabel
                      value="incomplete"
                      control={<Radio />}
                      label="InComplete"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <Button
                variant="contained"
                color={(updatingTodo && "success") || "primary"}
                // className="bg-blue-700 mt-3 mb-4"
                className={`${
                  updatingTodo ? "bg-green-700" : "bg-blue-700"
                } sm:text-1xl text-[15px] normal-case sm:normal font-thin sm:font-normal mt-3 mb-4`}
                // Ok So Learners here I have used the ternary operator to trigger updateTodo function
                // when updatingTodo is true and addTodo function when updatingTodo is false
                onClick={updatingTodo ? updateTodo : addTodo}
              >
                {(updatingTodo && "Update Todo 📅") || "Add Todo 📅"}
              </Button>
            </div>

            {todosList.length === 0 ? (
              <div className="flex flex-col justify-center items-center mt-3 mb-6">
                <h3 className="text-2xl text-center">No Todos 📅 found!</h3>
              </div>
            ) : (
              <>
                {todosList.map((item: any, index: number) => (
                  <div key={index}>
                    <div>
                      <TodoList
                        item={item}
                        index={index}
                        // To load the todo item details in the input fields
                        startUpdatingTodo={startUpdatingTodo}
                        // Checking while updating the todo item
                        updatingTodo={updatingTodo}
                        // Function to delete a todo item by id
                        deleteTodo={deleteTodo}
                        // Mark todo completed
                        markTodoAsCompleted={markTodoAsCompleted}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-2xl text-center">Loading Todos 📅 ...</h3>
            <br />
            <CircularProgress />
          </div>
        )}
      </div>

      <Footer />

      <SnackBar
        isOpen={snackBarHandler.open}
        message={snackBarHandler.message}
        severity={snackBarHandler.severity}
        setIsOpen={(isOpen: boolean) =>
          setSnackBarHandler({ ...snackBarHandler, open: isOpen })
        }
      />
    </div>
  );
};
export default Home;
