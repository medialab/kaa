/**
 * This module exports logic-related elements for the home view
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module kaa/features/HomeView
 */
import { combineReducers } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getStatePropFromActionSet } from '../../helpers/reduxUtils';

import { getTestData } from '../../helpers/client';

/**
 * ===================================================
 * ACTION NAMES
 * ===================================================
 */
/**
 * ui
 */
const SET_INTERFACE_COLOR = 'SET_INTERFACE_COLOR';
const REQUEST_DATA = 'REQUEST_DATA';

/**
 * data
 */

/**
 * ===================================================
 * ACTION CREATORS
 * ===================================================
 */
export const setInterfaceColor = ( payload ) => ( {
  type: SET_INTERFACE_COLOR,
  payload,
} );

export const requestTestData = ( payload ) => ( {
  type: REQUEST_DATA,
  payload,
  promise: () => getTestData()
} );

/**
 * ===================================================
 * REDUCERS
 * ===================================================
 */

/**
 * Default/fallback state of the ui state
 */
const UI_DEFAULT_STATE = {

  hasRequested: false,
  clientStatus: 'inactive'
};

/**
 * This redux reducer handles the global ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function ui( state = UI_DEFAULT_STATE, action ) {
  const { payload } = action;
  let propName;
  switch ( action.type ) {
    case SET_INTERFACE_COLOR:
      propName = getStatePropFromActionSet( action.type );
      return {
        ...state,
        [propName]: payload
      };
    case `${REQUEST_DATA}`:
      return {
        ...state,
        clientStatus: 'pending'
      };
    case `${REQUEST_DATA}_ERROR`:
      return {
        ...state,
        clientStatus: 'error'
      };
    case `${REQUEST_DATA}_SUCCESS`:
      return {
          ...state,
          clientStatus: 'success'
        };
    case `${REQUEST_DATA}_RESET`:
        return {
            ...state,
            clientStatus: 'inactive'
          };
    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  testData: undefined,
};

/**
 * This redux reducer handles the global ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data( state = DATA_DEFAULT_STATE, action ) {
  const { result } = action;
  switch ( action.type ) {
    case `${REQUEST_DATA}_SUCCESS`:
      return {
        ...state,
        testData: result
      };
    default:
      return state;
  }
}

/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default combineReducers( {
  ui,
  data,
} );

/**
 * ===================================================
 * SELECTORS
 * ===================================================
 */

const interfaceColor = ( state ) => state.ui.interfaceColor;
const clientStatus = ( state ) => state.ui.clientStatus;
const testData = ( state ) => state.data.testData;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector( {
  interfaceColor,
  clientStatus,
  testData,
} );
