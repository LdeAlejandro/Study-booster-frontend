//import { useState } from 'react'
import './App.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Home from './pages/home';
import Subject from './pages/subject/subject';
import Module from './pages/subject/module/Module';


function App() {

    //router
  const router = createBrowserRouter(
  createRoutesFromElements(
  
  <>
    <Route path="/" element={<Home />} />
    <Route path="/subject/:subjectId" element={<Subject />} />
    <Route path="/subject/:subjectId/module/parent" element={<Module />} />
  </>

    
  )
);
 

  return <RouterProvider router={router} />;
}

export default App
