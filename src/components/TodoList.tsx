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
import useTodoStore, { Todo } from "../store/index";

function TodoList() {
  const { todos, addTodo, deleteTodo, updateTodo, getTodo } = useTodoStore();
  const [editText, setEditText] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [completed, setCompleted] = useState<boolean>(false);
  const initialRef = useRef<HTMLInputElement>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const add = async (text: string): Promise<void> => {
    const todoApp = {
      id: Math.random().toString(),
      text: text,
      completed: completed,
    };
    addTodo(todoApp);
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
    const todo = todos.find((todo) => todo?.id === id);
    if (todo) {
      onOpen();
      setEditText(todo.text);
      setCompleted(todo.completed);
      setEditId(id);
    }
  };

  const update = async (): Promise<void> => {
    const todo = {
      text: editText,
      completed: completed,
    };
    if (editId !== null) {
      updateTodo(editId, todo);
      onClose();
      setEditText("");
      setCompleted(false);
      toast({
        title: `Updated successfully`,
        status: "warning",
        isClosable: true,
      });
    }
  };

  const changeCompleted = (value: string): void => {
    setCompleted(value === "true");
  };

  const handleCheck = (todo: Todo): void => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };
    updateTodo(updatedTodo.id, updatedTodo);
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
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setCompleted(false);
          setEditText("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? "Update Todo" : "Add Todo"}</ModalHeader>
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
            {editId === null ? (
              <Button
                isDisabled={!editText}
                onClick={() => add(editText)}
                colorScheme="blue"
                mr={3}
              >
                Save
              </Button>
            ) : (
              <Button
                isDisabled={!editText}
                onClick={update}
                colorScheme="blue"
                mr={3}
              >
                Update
              </Button>
            )}
            <Button
              onClick={() => (
                onClose(), setEditText(""), setCompleted(false), setEditId(null)
              )}
            >
              Cancel
            </Button>
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
          }}
        >
          Add
        </Button>
      </div>
      <div>
        <Box marginTop={"50px"} padding={"20px"} bg={"rgb(237, 235, 245)"}>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <Box
                key={todo.id}
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
                    {todo?.completed ? (
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
