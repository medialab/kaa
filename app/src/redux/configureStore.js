/**
 * Kaa backoffice Application
 * =======================================
 * Configuring store with appropriate middlewares
 * @module kaa
 */
import {
  applyMiddleware,
  createStore,
  compose
} from 'redux';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import rootReducer from './rootReducer';
import promiseMiddleware from './promiseMiddleware';

const basename = '/';

const history = createBrowserHistory( {
  basename
} );

/**
 * Configures store with a possible inherited state and appropriate reducers
 * @param initialState - the state to use to bootstrap the reducer
 * @return {object} store - the configured store
 */
export default function configureStore ( initialState = {} ) {
  // Compose final middleware with thunk and promises handling
  const middleware = applyMiddleware(
    routerMiddleware( history ),
    promiseMiddleware(),
  );
  // Create final store and subscribe router in debug env ie. for devtools
  const createStoreWithMiddleware = window.__REDUX_DEVTOOLS_EXTENSION__ ?
    compose(
      // related middlewares
      middleware,
      // connection to redux dev tools
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    )( createStore )
    :
    compose(
      // related middlewares
      middleware,
    )( createStore );

  const store = createStoreWithMiddleware(
    connectRouter( history )( rootReducer ),
    initialState,
  );
  // live-reloading handling
  if ( module.hot ) {
    module.hot.accept( './rootReducer', () => {
      const nextRootReducer = require( './rootReducer' ).default;
      store.replaceReducer( nextRootReducer );
    } );
  }
  return store;
}
