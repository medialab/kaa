/**
 * Kaa backoffice Application
 * =======================================
 * Combining the app's reducers
 * @module kaa
 */
import { combineReducers } from 'redux';

import home from '../features/HomeView/duck';

export default combineReducers( {
  home,
} );
