import React from 'react';
import ReactDOM from 'react-dom';

import Application from './Application';

import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';

import configureStore from './redux/configureStore';

const syncHistoryWithStore = ( store, history ) => {
  const { routing } = store.getState();
  if ( routing && routing.location ) {
    history.replace( routing.location );
  }
};

const initialState = {};
const routerHistory = createMemoryHistory();
const store = configureStore( initialState );
syncHistoryWithStore( store, routerHistory );

const rootElement = document.getElementById( 'mount' );
ReactDOM.render(
  <Provider store={ store }>
    <Application history={ routerHistory } />
  </Provider>,
  rootElement
);

// console.log('hiding the element');
document.getElementById( 'loader' ).style.display = 'none';

