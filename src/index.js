import React from 'react';
import firebaseConfig from './firebaseConfig';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import reportWebVitals from './reportWebVitals';
import {FirebaseAppProvider} from 'reactfire';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider domain="dev-p4jtlhvn.us.auth0.com" 
    clientId="iV6eUEGHCRL4lkc5njihOiM7o52xHTDL" 
    redirectUri={window.location.origin}>
    <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
