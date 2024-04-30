import { ChakraProvider, Container } from "@chakra-ui/react";
import TodoList from "./components/TodoList";
const App = () => {
  return (
    <>
      <ChakraProvider>
        <Container maxWidth={"900px"} margin={"auto"}>
          <TodoList />
        </Container>
      </ChakraProvider>
    </>
  );
};

export default App;
