import  React  from 'react';
import ReactDOM from 'react-dom/client';
import "../App.css";
import { BrowserRouter } from "react-router-dom";
import { Layout } from './layout';



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Layout/>
  </BrowserRouter>
);
