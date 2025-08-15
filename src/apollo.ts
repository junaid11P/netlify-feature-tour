import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { nhost } from './nhost';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: nhost.graphql.getUrl()
});

const wsLink = new GraphQLWsLink(createClient({
  url: nhost.graphql.getUrl().replace('https', 'wss'),
  connectionParams: async () => {
    const accessToken = await nhost.auth.getAccessToken();
    return { headers: { Authorization: accessToken ? `Bearer ${accessToken}` : '' } };
  }
}));

const authLink = setContext(async (_, { headers }) => {
  const accessToken = await nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});