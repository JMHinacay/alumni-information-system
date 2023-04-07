import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { ApolloClient } from 'apollo-boost';

// import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import fetch from 'node-fetch';
import axios from 'axios';
import _ from 'lodash';
const { createUploadLink } = require('apollo-upload-client');
import { apiUrlPrefix } from './settings';
import parseUrl from 'parse-url';
import { newConfig } from '../routes/config';

export function getUrlPrefix() {
  return apiUrlPrefix;
}

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

// https://www.apollographql.com/docs/link/links/http/#upgrade-apollo-client-10
const errorLink = onError(({ networkError }) => {
  if (networkError && networkError.statusCode === 401) {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/reset-password') {
        // if (
        //   _.has(newConfig, window.location.pathname) &&
        //   !newConfig[window.location.pathname]?.isPublic
        // ) {

        window.showSessionExpiredModal();
        // }
      }
    }
  }
});

const mylink = createUploadLink({
  uri: apiUrlPrefix + '/graphql',
  fetch: fetch,
  credentials: 'include',
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(mylink),
  defaultOptions: defaultOptions,
});

const defaultConfig = {
  withCredentials: true,
  crossDomain: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  xsrfCookieName: 'CSRF-TOKEN',
  xsrfHeaderName: 'X-Csrf-Token',
};

export let get = (path, config, track = false) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);

  config.track = track;

  return axios.get(apiUrlPrefix + path, config).then((response) => {
    return response.data;
  });
};

export let post = (path, body, config, track = true) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);

  config.track = track;

  return axios.post(apiUrlPrefix + path, body || {}, config);
};

export let put = (path, body, config) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);

  return axios.put(apiUrlPrefix + path, body || {}, config);
};

export let patch = (path, body, config, track = true) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);
  config.track = track;

  return axios.patch(apiUrlPrefix + path, body || {}, config);
};

export let _delete = (path, config) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);

  return axios.delete(apiUrlPrefix + path, config);
};
