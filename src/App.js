import logo from './logo.svg';
import './App.css';
import CreateStep from './components/CreateStep/CreateStep';
import CreateBlock from './components/CreateBlock/CreateBlock';
import CreateJourney from './components/CreateJourney/CreateJourney'
import {Routes, Route} from "react-router-dom"
import { Link } from 'react-router-dom';
import EditStep from './components/EditStep/EditStep';
import BlocksStepsPage from './components/BlockStepsPage/BlocksStepsPage';
import { useNavigate } from 'react-router-dom';
import SignupPage from './pages/Signup/SignupPage';

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

    <Link to={"/blocks"}>
    <button>Create a Block</button>
    </Link>
    
    <Link to={"/journeys"}>
    <button>Create a Journey</button>

    </Link>

    <Link to={"/sign-up"}>
    <button>Sign Up</button>
    </Link>


      <Routes>
        <Route path={"blocks/:blockId/edit"} element={<BlocksStepsPage/>} />
        <Route path={"/edit-step/:stepId"} element={<EditStep/>}/>
        <Route path={"/blocks"} element={<CreateBlock/>}/>
        <Route path={"/journeys"} element={<CreateJourney/>}/>
        <Route path={"/sign-up"} element={<SignupPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
