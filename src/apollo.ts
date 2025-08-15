import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { nhost } from './nhost';

const httpLink = createHttpLink({
  uri: nhost.graphql.getUrl()
});

const authLink = setContext(async (_, { headers }) => {
  const accessToken = await nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});