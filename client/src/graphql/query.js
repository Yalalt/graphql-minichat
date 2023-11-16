import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
  ApolloLink,
  concat,
} from "@apollo/client";

const httpLink = createHttpLink({ uri: "http://localhost:9001/graphql" });

const authenticationLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("chat_app_token");
  if (token) {
    operation.setContext({
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return forward(operation);
});

export const clientApollo = new ApolloClient({
  link: concat(authenticationLink, httpLink),
  cache: new InMemoryCache(),
});

export const GET_MESSAGES = gql`
  query MessagesQuery {
    messages {
      id
      user
      text
    }
  }
`;

export const ADD_MESSAGE = gql`
  mutation AddMessageMutation($text: String!) {
    message: addMessage(text: $text) {
      id
      user
      text
    }
  }
`;
