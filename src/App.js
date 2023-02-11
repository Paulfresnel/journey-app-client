import logo from './logo.svg';
import './App.css';
import CreateStep from './components/CreateStep/CreateStep';
import CreateBlock from './components/CreateBlock/CreateBlock';
import {Routes, Route} from "react-router-dom"
import { Link } from 'react-router-dom';
import EditStep from './components/EditStep/EditStep';
import BlocksStepsPage from './components/BlockStepsPage/BlocksStepsPage';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate=useNavigate()

  const goBack= ()=>{
    navigate(-1)
  }
  return (
    <div className="App">
    <button onClick={goBack}>Go Back</button>
    <Link to={"blocks/63e779d2a9978c010d5502dc/edit"}>
    <button>Create a New Step</button>
    </Link>
    <Link to={"blocks"}>
    <button>Create a New Block</button>
    </Link>
      <Routes>
        <Route path={"blocks/:blockId/edit"} element={<BlocksStepsPage/>} />
        <Route path={"/edit-step/:stepId"} element={<EditStep/>}/>
        <Route path={"/blocks"} element={<CreateBlock/>}/>
      </Routes>
    </div>
  );
}

export default App;
