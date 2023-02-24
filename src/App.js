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
import PublicJourneysPage from "./pages/PublicJourneysPage/PublicJourneysPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import Header from "./components/Header/Header";



function App() {
  const navigate=useNavigate()

  const goBack= ()=>{
    navigate(-1)
  }

  const { isLoggedIn, logoutUser } = useContext(AuthContext);

  return (
    <div className="App">
    <Header/>
      <Routes>
      <Route path={"/"} element={<HomePage/>}/>
      <Route path={"*"} element={<ErrorPage/>}/>
        <Route path={"blocks/:blockId/edit"} element={<BlocksStepsPage/>} />
        <Route path={"/edit-step/:stepId"} element={<EditStep/>}/>
        
        <Route path={"/profile/journeys/:journeyId"} element={<UserJourneyPage/>}/>
        <Route path={"/sign-up"} element={<SignupPage/>}/>
        <Route path={"/log-in"} element={<LoginPage/>}/>
        <Route path={"/journeys"} element={<PublicJourneysPage/>}/>
        <Route path={"/profile"} element={<ProfilePage/>}/>
        <Route path={"/profile/:userId/journeys"} element={<JourneysList/>}/>
        <Route path={"/profile/journeys/:journeyId/edit"} element={<JourneyBlocksPage/>}/>
        <Route path={"/profile/journeys/:journeyId/edit/block/:blockId"} element={<BlocksStepsPage/>}/>

      </Routes>
    </div>
  );
}

export default App;
