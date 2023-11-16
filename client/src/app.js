import { ApolloProvider } from "@apollo/client";
import { useState } from "react";
import { getLoggedUserFromToken } from "./lib/authentication";
import Chat from "./components/chat";
import LoginForm from "./components/login-form";
import NavBar from "./components/navbar";
import { clientApollo } from "./graphql/query";

function App() {
  const [loggedUser, setLoggedUser] = useState(getLoggedUserFromToken());

  return (
    <ApolloProvider client={clientApollo}>
      <header>
        <NavBar loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      </header>
      <main>
        {loggedUser ? (
          <Chat loggedUser={loggedUser} />
        ) : (
          <LoginForm setLoggedUser={setLoggedUser} />
        )}
      </main>
    </ApolloProvider>
  );
}

export default App;
