import axios, { AxiosResponse } from "axios";
import { create, SetState } from "zustand";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string;
  getTodo: () => Promise<void>;
  addTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (id: number, updatedTodo: Partial<Todo>) => Promise<void>;
}

const useTodoStore = create<TodoStore>((set: SetState<TodoStore>) => ({
  todos: [],
  loading: true,
  error: "",
  getTodo: async () => {
    set({ loading: true, error: "" });
    try {
      const response: AxiosResponse<Todo[]> = await axios.get(
        "http://localhost:3000/todos"
      );
      set({ todos: response.data, loading: false });
    } catch (error) {
      set({ error: "Error", loading: false });
    }
  },
  addTodo: async (todo: Todo) => {
    try {
      const response: AxiosResponse<Todo> = await axios.post(
        "http://localhost:3000/todos",
        todo
      );
      set((state) => ({ todos: [...state.todos, response.data] }));
    } catch (error) {
      console.error("Todo qo‘shishda xatolik:", error);
    }
  },
  deleteTodo: async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`);
      set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) }));
    } catch (error) {
      console.error("Todo o‘chirishda xatolik:", error);
    }
  },
  updateTodo: async (id: number, updatedTodo: Partial<Todo>) => {
    try {
      const response: AxiosResponse<Todo> = await axios.put(
        `http://localhost:3000/todos/${id}`,
        updatedTodo
      );
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo?.id === id ? response.data : todo
        ),
      }));
    } catch (error) {
      console.error("Todo yangilashda xatolik:", error);
    }
  },
}));

export default useTodoStore;
