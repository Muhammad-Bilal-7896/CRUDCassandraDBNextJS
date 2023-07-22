export type TODO_LIST_TYPE = {
    title: string;
    description: string;
    completed: boolean;
    id: string;
    date: string;
    postedBy: string;
};

export type TodoListProps = {
  item: TODO_LIST_TYPE;
  index: number;
  startUpdatingTodo: (item: TODO_LIST_TYPE) => void;
  updatingTodo: boolean;
  deleteTodo: (item: TODO_LIST_TYPE) => void;
  markTodoAsCompleted: (item: TODO_LIST_TYPE) => void;
};