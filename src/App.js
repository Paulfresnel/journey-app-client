import logo from './logo.svg';
import './App.css';
import CreateStep from './components/CreateStep/CreateStep';
import {Routes, Route} from "react-router-dom"
import { Link } from 'react-router-dom';
import EditStep from './components/EditStep/EditStep';

function App() {
  return (
    <div className="App">
    <Link to={"/create-step"}>
    <button>Create a New Step</button>
    </Link>
      <Routes>
        <Route path={"/create-step"} element={<CreateStep/>} />
        <Route path={"/edit-step/:stepId"} element={<EditStep/>}/>
      </Routes>
    </div>
  );
}

export default App;
