import { ApolloClient, InMemoryCache, createHttpLink, gql, ApolloLink, concat, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient as createWsClient } from 'graphql-ws';

const authenticationLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('chat_app_token');
  if (token) {
    operation.setContext({
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return forward(operation);
});

const queryMutationLink = concat(authenticationLink, createHttpLink({ uri: 'http://localhost:9001/graphql' }));

const wsLink = new GraphQLWsLink(
  createWsClient({
    url: 'ws://localhost:9001/graphql',
  })
);

export const clientApollo = new ApolloClient({
  link: split(isSubscription, wsLink, queryMutationLink),
  cache: new InMemoryCache(),
});

function isSubscription(operation) {
  const definition = getMainDefinition(operation.query);

  return (
    definition.kind === Kind.OPERATION_DEFINITION && 
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
}

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
