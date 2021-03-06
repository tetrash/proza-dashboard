import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { config } from './config';

const link = createHttpLink({
  uri: `${config.backendDomain}/graphql`,
  credentials: 'include',
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        listPosts: {
          keyArgs: false,
          merge: (existing, incoming) => {
            return incoming;
          },
        },
      },
    },
  },
});

const apolloClient = new ApolloClient({
  link,
  cache,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
