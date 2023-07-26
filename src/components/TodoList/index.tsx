import { Button } from "@mui/material";
import { TodoListProps } from "../types";

const TodoList = (props: TodoListProps) => {
  const {
    item,
    index,
    startUpdatingTodo,
    deleteTodo,
    updatingTodo,
    markTodoAsCompleted,
  } = props;
  return (
    <div className="border shadow-md opacity-80 border-x-blue-900 rounded-[12px] p-2 m-4">
      <h1 className="text-3xl text-center">
        {index}-{" "}
        {item.completed ? (
          <span className="line-through">{item.title}</span>
        ) : (
          <span>{item.title}</span>
        )}
      </h1>
      <p className="text-center">
        {item.completed ? (
          <span className="line-through">{item.description}</span>
        ) : (
          <span>{item.description}</span>
        )}
      </p>
      <p className={`text-center ${item.completed ? "line-through" : ""}`}>
        {item.completed === true ? "true" : "false"}
      </p>
      <p className={`text-center ${item.completed ? "line-through" : ""}`}>
        {item.date}
      </p>
      <div className="flex flex-row justify-center mt-4 mb-2">
        <Button
          variant="contained"
          color={updatingTodo ? "success" : "primary"}
          className={`${
            updatingTodo ? "bg-green-700" : "bg-blue-700"
          } sm:text-1xl text-[15px] lowercase sm:normal-case font-thin sm:font-normal`}
          onClick={() => startUpdatingTodo(item)}
          disabled={updatingTodo}
        >
          {updatingTodo ? "Update" : "Edit"}
        </Button>
        <Button
          variant="contained"
          color="error"
          className="bg-red-700 sm:text-1xl text-[15px] lowercase sm:normal-case font-thin sm:font-normal ml-2"
          onClick={() => deleteTodo(item)}
          disabled={updatingTodo}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color={!item.completed ? "success" : "warning"}
          className={`${
            !item.completed ? "bg-green-500" : "bg-orange-500"
          } sm:text-1xl text-[15px] lowercase sm:normal-case font-thin sm:font-normal ml-2`}
          onClick={() => markTodoAsCompleted(item)}
          disabled={updatingTodo}
        >
          {item.completed ? "Mark As InComplete" : "Mark As Complete"}
        </Button>
      </div>
    </div>
  );
};
export default TodoList;
