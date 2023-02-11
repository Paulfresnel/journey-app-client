import logo from './logo.svg';
import './App.css';
import CreateStep from './components/CreateStep/CreateStep';
import CreateBlock from './components/CreateBlock/CreateBlock';
import {Routes, Route} from "react-router-dom"
import { Link } from 'react-router-dom';
import EditStep from './components/EditStep/EditStep';
import BlocksStepsPage from './components/BlockStepsPage/BlocksStepsPage';

function App() {
  return (
    <div className="App">
    <Link to={"/create-step"}>
    <button>Create a New Step</button>
    </Link>
      <Routes>
        <Route path={"/create-step"} element={<BlocksStepsPage/>} />
        <Route path={"/edit-step/:stepId"} element={<EditStep/>}/>
        <Route path={"/blocks"} element={<CreateBlock/>}/>
      </Routes>
    </div>
  );
}

export default App;
