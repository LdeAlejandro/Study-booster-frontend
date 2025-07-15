// App.jsx
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
import SingleQuestionPage from './pages/SingleQuestionPage/SingleQuestionPage';
import ElectronNavigationListener from './ElectronNavigationListener';

function WithElectronListener({ children }) {
  return (
    <>
      <ElectronNavigationListener />
      {children}
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<WithElectronListener><Home /></WithElectronListener>} />
      <Route path="/subject/:subjectId" element={<WithElectronListener><Subject /></WithElectronListener>} />
      <Route path="/subject/:subjectId/module/:moduleId/question" element={<WithElectronListener><Questions /></WithElectronListener>} />
      <Route path="/subject/:subjectId/module/:moduleId/doc/:docId" element={<WithElectronListener><Doc /></WithElectronListener>} />
      <Route path="/subject/:subjectId/module/parent" element={<WithElectronListener><Module /></WithElectronListener>} />
      <Route path="/SingleQuestion" element={<WithElectronListener><SingleQuestionPage /></WithElectronListener>} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
