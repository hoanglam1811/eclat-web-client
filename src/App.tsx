import { useState } from 'react'
import { Provider } from 'react-redux';
import { Toaster } from './components/ui/toaster';
import store from './store/store';
import './App.css'
import { RouterProvider } from 'react-router-dom';
import router from './router';
// import "antd/dist/reset.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function App() {
  return (
    <>
        <Provider store={store}>
            <RouterProvider router={router} />
            <Toaster />
        </Provider>
    </>
  )
}

export default App
