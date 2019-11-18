/**
 * This module prkaas a connected component for displaying the home view
 * @module kaa/features/HomeView
 */
/* eslint react/jsx-no-bind:0 */
/* eslint react/prefer-stateless-function : 0 */
/* eslint react/no-danger : 0 */
/**
 * Imports Libraries
 */
import React from 'react';

/**
 * Imports Project utils
 */

/**
 * Imports Components
 */

 const HomeViewLayout = ( {
  actions: {
    requestTestData
  },
  testData,
  clientStatus
 } ) => {
   return (
     <div>
       <h1>Hello world !</h1>
       <p>
         <button onClick={ () => requestTestData() }>Get test data</button>
       </p>
       <p>
        <i>Client status : {clientStatus}</i>
       </p>
       {
         testData &&
         <div>
           <h2>Data:</h2>
          <pre>
            <code>
              {JSON.stringify( testData )}
            </code>
          </pre>
         </div>
       }
     </div>
   );
 };
export default HomeViewLayout;
