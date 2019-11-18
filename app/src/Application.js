/**
 * Kaa backoffice Application
 * =======================================
 * Root component of the application.
 * @module kaa
 */
import React from 'react';

import { Route } from 'react-router';

import { ConnectedRouter } from 'connected-react-router';

import { AnimatedSwitch } from 'react-router-transition';

import './Application.scss';

import HomeView from './features/HomeView/components';

const routes = [
  (
    <Route
      exact
      key={ 1 }
      path={ '/' }
      component={ () => (
        <HomeView />
      ) }
    />
  ),
];

const Application = ( { history } ) => (
  <ConnectedRouter
    history={ history }
  >
    <AnimatedSwitch
      atEnter={ { opacity: 0 } }
      atLeave={ { opacity: 0 } }
      atActive={ { opacity: 1 } }
      className={ 'switch-wrapper' }
    >
      {routes}
    </AnimatedSwitch>

  </ConnectedRouter>
);

export default Application;
