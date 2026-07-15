import React from 'react';
import ReactDOM from 'react-dom/client';
import "../App.css";
import { HashRouter } from "react-router-dom";
import { Layout } from './layout';
import { initializeI18n } from "./i18n";

initializeI18n();

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Layout />
  </HashRouter>
);
