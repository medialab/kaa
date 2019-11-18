import axios from 'axios';

const SERVER_BASE = 'http://127.0.0.1:5000';

const getFromServer = ( endpoint, query = {} ) => {
  const queryStr = Object.keys( query ).length ?
  `?${Object.keys( query ).map( ( key ) => `${key}=${query[key]}` ).join( '&' )}`
  : '';
  return new Promise( ( resolve, reject ) => {
    axios( `${SERVER_BASE}/${endpoint}${queryStr}` )
    .then( ( { data } ) => resolve( data ) )
    .catch( reject );
  } );
};

export const getTestData = () => getFromServer( 'test' );
