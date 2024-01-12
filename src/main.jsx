import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'vite/modulepreload-polyfill';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Albums from './components/Albums';
import Photos from './components/Photos';


const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/albums",
        element: <Albums />
      },
      {
        path: "/photos",
        element: <Photos />
      },
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
