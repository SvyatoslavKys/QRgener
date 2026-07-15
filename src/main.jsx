import React from 'react';
import ReactDOM from 'react-dom/client';
import "../App.css";
import { HashRouter } from "react-router-dom";
import { Layout } from './layout';



ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Layout />
  </HashRouter>
);
