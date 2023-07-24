import { useState, useEffect } from "react";

import Image from "next/image";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { Button, CircularProgress } from "@mui/material";

// Importing Components
import TodoList from "@/components/TodoList";
import { TODO_LIST_TYPE } from "@/components/types";

const Home = () => {

  const [loading, setLoading] = useState<boolean>(true);

  // To store the all todo items from the database. It is an array dear learners.
  const [todosList, setTodosList] = useState<any>([]);

  // To check while updating the todo item so that you are able to show the update button
  const [updatingTodo, setUpdatingTodo] = useState<boolean>(false);

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
      .then(response => {
        // alert("GET Response response.data.data ==> ")
        console.log("GET Response response.data.data ==> ", response);
        setTodosList(response.data.response.data);
        setLoading(false);
      })
      .catch(error => {
        // alert("Error ==> ")
        console.log("Error is ==> ", error)
      })
  };

  // Function to update a todo item by id
  const addTodo = async () => {
    // Prompt the user to enter the updated todo item details
    let title = prompt("Enter todo title:");
    let description = prompt("Enter todo description:");
    let completed = prompt("Enter todo completed status:");
    let date = new Date().toLocaleDateString();

    // If the user clicks the cancel button, then return early from this function
    if (!title || !description || !completed || !date) {
      alert("Please enter all items to add todo!");
      return;
    }

    // Check if the user entered all the updated todo item details
    if (title !== null && description !== null && completed !== null && date !== null) {
      const todoData = {
        "posted_by": FILTERED_BY,
        "date": date,
        "title": title,
        "description": description,
        "completed": completed === "true" ? true : false,
        "id": uuidv4()
      };

      console.log("Todo Data is ==> ", todoData);

      try {
        // Make a POST request to add the todo item
        const response = await axios.post(`/api/${TABLE_NAME}`, todoData);
        setTodosList([...todosList, todoData]);
        alert("Todo 🚀 item added successfully!");
        console.log("Adding Todo ⏳ Response:", response);
      } catch (error) {
        alert("Error ⚠️ adding todo item!");
        console.error(error);
      }
    } else {
      alert("Please enter all the todo item details to add todo! Thanks.");
      return;
    }
  };

  // Function to update a todo item by id
  const updateTodo = async (item: TODO_LIST_TYPE) => {
    // Prompt the user to enter the updated todo item details
    let title = prompt("Enter updated title:");
    let description = prompt("Enter updated description:");
    let completed = prompt("Enter updated completed status:");

    // If the user clicks the cancel button, then return early from this function
    if (!title || !description || !completed) {
      alert("Todo item update declined!");
      return;
    }

    // Check if the user entered all the updated todo item details
    if (title !== null && description !== null && completed !== null) {

      const updatedData = {
        "title": title,
        "description": description,
        "completed": completed === "true" ? true : false,
      };

      try {
        setLoading(true);
        // Make a PUT request to update the todo item
        const response = await axios.put(`/api/${TABLE_NAME}/${FILTERED_BY}/${item.date}/${item.id}`, updatedData);
        // setLoading(true);
        // fetchTodos();

        setTodosList((prevTodos: any) => prevTodos.map((todo: any) => {
          if (todo.id === item.id) {
            return {
              ...todo,
              title: title,
              description: description,
              completed: completed === "true" ? true : false,
            };
          }
          return todo;
        }));

        // alert("Todo 📅 item updated successfully!");

        setLoading(false);

        console.log("Update Todo 📅 Item Response:", response);
      } catch (error) {
        alert("Error ⚠️ updating todo 📅 item!");
        console.error("Update Error:", error);
      }
    } else {
      alert("Please enter all the updated todo item details to update todo! Thanks.");
    }
  };

  // Function to mark a todo as completed
  const markTodoAsCompleted = async (item: TODO_LIST_TYPE) => {
    try {
      const updatedData = {
        "completed": !item.completed,
      };

      setUpdatingTodo(true);

      // Make a PUT request to update the todo item
      const response = await axios.put(`/api/${TABLE_NAME}/${FILTERED_BY}/${item.date}/${item.id}`, updatedData);
      // setLoading(true);
      // fetchTodos();

      setTodosList((prevTodos: any) => prevTodos.map((todo: any) => {
        if (todo.id === item.id) {
          return {
            ...todo,
            completed: !item.completed,
          };
        }
        return todo;
      }));

      setUpdatingTodo(false);
      // alert("Todo 📅 item marked as complete successfully!");

      console.log("Todo 📅 Item marked as completed Response:", response);

    } catch (error) {
      alert("Error ⚠️ marking todo item 📅 as complete!");
      console.log("Error ⚠️ marking todo item 📅 as complete!", error);
    }
  }

  // Function to delete a todo item by id
  const deleteTodo = async (id: any) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Cassandra-Token': "AstraCS:UMHldokDeYIhSkNHRHDuIShI:71cef8c7f57909521b2eb550d593e8cf0bc399521633e8fc5c525fa8ee2cb928"
        }
      };

      // Make a DELETE request to delete the todo item
      const response = await axios.delete(`/api/todos/${id}`, config);
      alert("Todo item deleted successfully!");
      console.log("Delete Response:", response);

      // After successful deletion, update the todosList state to remove the deleted item from the UI
      setTodosList((prevTodos: any) => prevTodos.filter((item: any) => item.id !== id));
    } catch (error) {
      alert("Error deleting todo item!");
      console.error("Delete Error:", error);
    }
  };

  return (
    <div className='container ml-auto mr-auto'>
      <h1 className='text-4xl text-center mt-4 font-bold font-sans text-blue-500'>Cassandra DB Todo App 🚀</h1>
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
            marginBottom: 20
          }}
        />
      </div>
      {(!loading) ? (
        <>
          <div className="flex justify-center item-center">
            <Button
              variant='contained'
              color={"primary"}
              className="bg-blue-700"
              onClick={addTodo}
              // So disable when updating is happening
              disabled={updatingTodo}
            >
              Add Todo 📝
            </Button>
          </div>
          {todosList
            .map((item: any, index: number) => (
              <div key={index}>
                {(todosList.length === 0) ? (
                  <div className="flex flex-col justify-center items-center">
                    <h3 className="text-2xl text-center">No Todos 📅 found!</h3>
                  </div>
                ) : (
                  <div>
                    <TodoList
                      item={item}
                      index={index}

                      // Function to update a todo item by id
                      updateTodo={updateTodo}

                      // Function to delete a todo item by id
                      deleteTodo={deleteTodo}

                      // Checking while updating the todo item
                      updatingTodo={updatingTodo}

                      // Mark todo completed
                      markTodoAsCompleted={markTodoAsCompleted}
                    />
                  </div>
                )}
              </div>
            ))}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-2xl text-center">Loading Todos 📅 ...</h3>
          <br />
          <CircularProgress />
        </div>
      )}
    </div>
  )
}
export default Home;