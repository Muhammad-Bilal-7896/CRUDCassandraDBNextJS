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
    updatingTodo: boolean;
    updateTodo: (id: TODO_LIST_TYPE) => void;
    deleteTodo: (id: string) => void;
    markTodoAsCompleted: (id: TODO_LIST_TYPE) => void;
}