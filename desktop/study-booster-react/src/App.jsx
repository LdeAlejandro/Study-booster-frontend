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
import Questions from './pages/subject/module/questions/Questions';
import Doc from './pages/subject/module/doc/Doc';


function App() {

    //router
  const router = createBrowserRouter(
  createRoutesFromElements(
  
  <>
    <Route path="/" element={<Home />} />
    <Route path="/subject/:subjectId" element={<Subject />} />
    <Route path="/subject/:subjectId/module/:moduleId/question" element={<Questions />} />
    <Route path="/subject/:subjectId/module/:moduleId/doc/:docId" element={<Doc />} />
    <Route path="/subject/:subjectId/module/parent" element={<Module />} />
    
  </>

    
  )
);
 

  return <RouterProvider router={router} />;
}

export default App
