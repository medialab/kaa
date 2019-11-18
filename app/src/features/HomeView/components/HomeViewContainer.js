/**
 * This module prkaas a connected component for handling the home view
 * @module kaa/features/HomeView
 */
/**
 * Imports Libraries
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

/**
 * Imports Project utils
 */
/**
 * Imports Ducks
 */
import * as duck from '../duck';

/**
 * Imports Components
 */
import HomeViewLayout from './HomeViewLayout';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  ( state ) => ( {
    ...duck.selector( state.home ),
  } ),
  ( dispatch ) => ( {
    actions: bindActionCreators( {
      ...duck,
    }, dispatch )
  } )
)
class HomeViewContainer extends Component {

  /**
   * Context data used by the component
   */
  static contextTypes = {

    /**
     * Redux store
     */
    store: PropTypes.object.isRequired
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor( props ) {
    super( props );
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <HomeViewLayout
        { ...this.props }
      />
    );
  }
}

export default withRouter( HomeViewContainer );
