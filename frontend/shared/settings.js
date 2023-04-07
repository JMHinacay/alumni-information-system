import parseUrl from 'parse-url';

export let apiUrlPrefix = '';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  apiUrlPrefix = 'http://localhost:8080';
} else {
  if (process.browser) {
    const parts = parseUrl(window.location.href);
    let resource = parts.resource.replace('hr', 'hismk2');
    apiUrlPrefix = parts.protocol + '://srv-' + resource;
  } else {
    apiUrlPrefix = 'http://localhost:8080';
  }
}
