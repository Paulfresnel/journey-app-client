import { Routes, Route, Link, useNavigate} from "react-router-dom";
import { useContext } from "react";

import './App.css';
import CreateStep from './components/CreateStep/CreateStep';
import CreateBlock from './components/CreateBlock/CreateBlock';
import CreateJourney from './components/CreateJourney/CreateJourney';
import EditStep from './components/EditStep/EditStep';
import BlocksStepsPage from './components/BlockStepsPage/BlocksStepsPage';
import SignupPage from './pages/Signup/SignupPage';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { AuthContext } from "./context/auth.context";
import HomePage from "./pages/HomePage/HomePage";
import JourneysList from "./components/JourneysList/JourneysList";
import JourneyBlocksPage from "./pages/JourneyBlocksPage/JourneyBlocksPage";
import UserJourneyPage from "./pages/UserJourneyPage/UserJourneyPage";



function App() {
  const navigate=useNavigate()

  const goBack= ()=>{
    navigate(-1)
  }

  const { isLoggedIn, logoutUser } = useContext(AuthContext);

  return (
    <div className="App">
    
    <button onClick={goBack}>Go Back</button>
    {isLoggedIn && <Link to={"/profile"}>
    <button>Go to Profile</button>
    </Link>}
      <Routes>
      <Route path={"/"} element={<HomePage/>}/>
        <Route path={"blocks/:blockId/edit"} element={<BlocksStepsPage/>} />
        <Route path={"/edit-step/:stepId"} element={<EditStep/>}/>
        <Route path={"/blocks"} element={<CreateBlock/>}/>
        <Route path={"/journeys"} element={<CreateJourney/>}/>
        <Route path={"/profile/journeys/:journeyId"} element={<UserJourneyPage/>}/>
        <Route path={"/sign-up"} element={<SignupPage/>}/>
        <Route path={"/log-in"} element={<LoginPage/>}/>
        <Route path={"/profile"} element={<ProfilePage/>}/>
        <Route path={"/profile/:userId/journeys"} element={<JourneysList/>}/>
        <Route path={"/profile/journeys/:journeyId/edit"} element={<JourneyBlocksPage/>}/>
        <Route path={"/profile/journeys/:journeyId/edit/block/:blockId"} element={<BlocksStepsPage/>}/>

      </Routes>
    </div>
  );
}

export default App;
