import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "react-hot-toast";



import App from './App';
import './index.css';

import {useThemeStore} from './store/useThemeStore';

function MainWithTheme(){
  const darkMode = useThemeStore((state)=>state.darkMode);

  useEffect(() =>{
  if (darkMode){
    document.documentElement.classList.add("dark")
  }
  else {
    document.documentElement.classList.remove("dark")
  }
  
},[darkMode]);

return(
  <BrowserRouter>
  <Toaster position="top-center" />
  <App/>
  </BrowserRouter>
);
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainWithTheme/>
  </React.StrictMode>
);
