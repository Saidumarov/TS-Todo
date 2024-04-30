import { useEffect, useState, useRef } from "react";
import "./index.scss";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Select,
  Box,
  ButtonGroup,
  Text,
  Checkbox,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import useTodoStore from "../store/index";
import axios from "axios";

interface TodoApp {
  id: number;
  text: string;
  completed: boolean;
}

function TodoList() {
  const { todos, addTodo, deleteTodo, updateTodo, getTodo } = useTodoStore();
  const [editText, setEditText] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [completed, setCompleted] = useState<boolean>(false);
  const initialRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLButtonElement>(null);
  const [btnActive, setbtnActive] = useState<boolean>(false);
  const [editId, seteditId] = useState<string>("");

  const add = async (text: string): Promise<void> => {
    const todo = {
      text: text,
      completed: completed,
    };
    addTodo(todo);
    onClose();
    setEditText("");
    setCompleted(false);
    toast({
      title: `Added successfully`,
      status: "success",
      isClosable: true,
    });
  };

  const toggleTodo = async (id: string): Promise<void> => {
    setbtnActive(false);
    onOpen();
    const todo = await axios.get<TodoApp>(`http://localhost:3000/todos/${id}`);
    setEditText(todo.data.text);
    setCompleted(todo.data.completed);
    seteditId(id);
  };

  const update = async (): Promise<void> => {
    const todo = {
      text: editText,
      completed: completed,
    };
    updateTodo(editId, todo);
    onClose();
    setEditText("");
    setCompleted(false);
    toast({
      title: `Updated successfully`,
      status: "warning",
      isClosable: true,
    });
  };

  const changeCompleted = (value: string): void => {
    setCompleted(value === "true");
  };

  const handleCheck = (el: TodoApp): void => {
    const todo = {
      text: el.text,
      completed: !el.completed,
    };
    updateTodo(el.id, todo);
  };

  const deleteBtn = (id: string): void => {
    deleteTodo(id);
    toast({
      title: `Deleted successfully`,
      status: "error",
      isClosable: true,
    });
  };

  useEffect(() => {
    getTodo();
  }, []);

  return (
    <div className="todo-container">
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setCompleted(false);
          setEditText("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                ref={initialRef}
                placeholder="Title"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Status</FormLabel>
              <Select
                value={completed ? "true" : "false"}
                onChange={(e) => changeCompleted(e.target.value)}
              >
                <option value="false">Incomplete</option>
                <option value="true">Completed</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {btnActive ? (
              <Button onClick={() => add(editText)} colorScheme="blue" mr={3}>
                Save
              </Button>
            ) : (
              <Button onClick={update} colorScheme="blue" mr={3}>
                Update
              </Button>
            )}
            <Button onClick={() => onClose()}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="header">
        <Heading>TODO LIST</Heading>
        <Button
          width={"120px"}
          height={"45px"}
          colorScheme="teal"
          variant="outline"
          onClick={() => {
            onOpen();
            setbtnActive(true);
          }}
        >
          Add
        </Button>
      </div>
      <div>
        <Box marginTop={"50px"} padding={"20px"} bg={"rgb(237, 235, 245)"}>
          {todos?.length > 0 ? (
            todos.map((todo, i) => (
              <Box
                key={i}
                marginTop={"20px"}
                bg={"rgb(255, 255, 255)"}
                padding={"20px"}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Checkbox
                    size="lg"
                    colorScheme="green"
                    isChecked={todo.completed}
                    onChange={() => handleCheck(todo)}
                  >
                    {todo.completed ? (
                      <Text>{todo.text}</Text>
                    ) : (
                      <s>
                        <Text>{todo.text}</Text>
                      </s>
                    )}
                  </Checkbox>
                  <ButtonGroup>
                    <Button
                      colorScheme="red"
                      onClick={() => deleteBtn(todo.id)}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      colorScheme="orange"
                      onClick={() => toggleTodo(todo.id)}
                    >
                      <EditIcon />
                    </Button>
                  </ButtonGroup>
                </Flex>
              </Box>
            ))
          ) : (
            <Heading textAlign={"center"} fontSize={"22px"}>
              No Todos
            </Heading>
          )}
        </Box>
      </div>
    </div>
  );
}

export default TodoList;
