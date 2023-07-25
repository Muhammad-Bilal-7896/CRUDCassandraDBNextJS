import { useState, useEffect } from "react";

import Image from "next/image";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { Button, CircularProgress, TextField } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// Importing Components
import TodoList from "@/components/TodoList";
import SnackBar from "@/components/SnackBar";
import { TODO_LIST_TYPE } from "@/components/types";

const Home = () => {

  ///////////////////////////////// Snackbar State /////////////////////////////////
  const [snackBarHandler, setSnackBarHandler] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  ///////////////////////////////// Snackbar State /////////////////////////////////

  const [loading, setLoading] = useState<boolean>(true);

  // To store the all todo items from the database. It is an array dear learners.
  const [todosList, setTodosList] = useState<any>([]);

  // Todo Values
  const [todoTitle, setTodoTitle] = useState<string>("");
  const [todoDescription, setTodoDescription] = useState<string>("");
  const [todoCompleted, setTodoCompleted] = useState<string>('incomplete');

  const handleChangeTodoStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoCompleted((event.target as HTMLInputElement).value);
  };

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

        let todo_list = response.data.response.data;

        //reverse the todo list
        todo_list.reverse();

        setTodosList(todo_list);
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
    // let title = prompt("Enter todo title:");
    // let description = prompt("Enter todo description:");
    // let completed = prompt("Enter todo completed status:");
    let date = new Date().toLocaleDateString();

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
        "posted_by": FILTERED_BY,
        "date": date,
        "title": todoTitle,
        "description": todoDescription,
        "completed": todoCompleted === "completed" ? true : false,
        "id": uuidv4()
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
          <div className="flex flex-col justify-center item-center">
            <div>
              <TextField
                variant='standard'
                label='Todo Title'
                placeholder='Enter Todo title'
                className="w-full"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
              />
              <TextField
                variant='standard'
                label='Todo Description'
                placeholder='Enter Todo description'
                className="w-full mt-2"
                multiline
                rows={4}
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
              />
              <FormControl className="mt-6">
                <FormLabel id="demo-controlled-radio-buttons-group">Todo Status</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={todoCompleted}
                  onChange={handleChangeTodoStatus}
                >
                  <FormControlLabel value="completed" control={<Radio />} label="Completed" />
                  <FormControlLabel value="incomplete" control={<Radio />} label="InComplete" />
                </RadioGroup>
              </FormControl>
            </div>
            <Button
              variant='contained'
              color={"primary"}
              className="bg-blue-700 mt-3 mb-4"
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

      <SnackBar
        isOpen={snackBarHandler.open}
        message={snackBarHandler.message}
        severity={snackBarHandler.severity}
        setIsOpen={
          // Only pass the setIsOpen function to the SnackBar component
          // and not the whole state object
          (isOpen: boolean) =>
            setSnackBarHandler({ ...snackBarHandler, open: isOpen })
        }
      />
    </div>
  )
}
export default Home;