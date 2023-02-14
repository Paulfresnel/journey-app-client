import { Routes, Route, Link, useNavigate} from "react-router-dom";
import { useContext } from "react";

import './App.css';
/* import CreateStep from './components/CreateStep/CreateStep';
 */import CreateBlock from './components/CreateBlock/CreateBlock';
import CreateJourney from './components/CreateJourney/CreateJourney';
import EditStep from './components/EditStep/EditStep';
import BlocksStepsPage from './components/BlockStepsPage/BlocksStepsPage';
import SignupPage from './pages/Signup/SignupPage';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { AuthContext } from "./context/auth.context";


function App() {
  const navigate=useNavigate()

  const goBack= ()=>{
    navigate(-1)
  }

  const { isLoggedIn, logoutUser } = useContext(AuthContext);

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

    {!isLoggedIn && 
      <>
        <Link to={"/sign-up"}>
          <button>Sign Up</button>
        </Link>

        <Link to={"/log-in"}>
          <button>Log In</button>
        </Link> 
      </>
    }
   
    {isLoggedIn && <button onClick={logoutUser}>Log Out</button>} 

   
      <Routes>
        <Route path={"blocks/:blockId/edit"} element={<BlocksStepsPage/>} />
        <Route path={"/edit-step/:stepId"} element={<EditStep/>}/>
        <Route path={"/blocks"} element={<CreateBlock/>}/>
        <Route path={"/journeys"} element={<CreateJourney/>}/>
        <Route path={"/sign-up"} element={<SignupPage/>}/>
        <Route path={"/log-in"} element={<LoginPage/>}/>
        <Route path={"/profile-page"} element={<ProfilePage/>}/>
      </Routes>
    </div>
  );
}

export default App;
