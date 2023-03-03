import { Routes, Route} from "react-router-dom";

import './App.css';
import EditStep from './components/EditStep/EditStep';
import BlocksStepsPage from './components/BlockStepsPage/BlocksStepsPage';
import SignupPage from './pages/Signup/SignupPage';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import HomePage from "./pages/HomePage/HomePage";
import JourneysList from "./components/JourneysList/JourneysList";
import JourneyBlocksPage from "./pages/JourneyBlocksPage/JourneyBlocksPage";
import UserJourneyPage from "./pages/UserJourneyPage/UserJourneyPage";
import IsAnon from "./components/isAnon";
import IsPrivate from "./components/isPrivate";

import ErrorPage from "./pages/ErrorPage/ErrorPage";
import Header from "./components/Header/Header";

import PublicJourneysPage from "./pages/PublicJourneysPage/PublicJourneysPage";

import PublicIndividualJourney from "./pages/PublicIndividualJourney/PublicIndividualJourney";
import PublicIndividualBlock from "./pages/PublicIndividualBlock/PublicIndividualBlocks";
import PublicIndividualStep from "./pages/PublicIndividualStep/PublicIndividualStep";
import PublicUserPage from "./pages/PublicUserPage/PublicUserPage";
import UserLeaderboard from "./pages/UsersLeaderboard/UsersLeaderboard";




function App() {

  return (
    <div className="App">
    <Header/>
      <Routes>
      <Route path={"/"} element={<HomePage/>}/>
      <Route path={"*"} element={<ErrorPage/>}/>
        <Route path={"/profile/journeys/:journeyId/:blockId/:stepId"} element={<IsPrivate><EditStep/></IsPrivate>}/>
        <Route path={"/sign-up"} element={<IsAnon><SignupPage/></IsAnon>}/>
        <Route path={"/log-in"} element={<IsAnon><LoginPage/></IsAnon>}/>
        <Route exact path={"/profile/journeys/:journeyId"} element={<IsPrivate><UserJourneyPage/></IsPrivate>}/>

        <Route path={"/journeys"} element={<PublicJourneysPage/>}/>
        <Route path={"/journeys/:journeyId"} element={<PublicIndividualJourney/>}/>
        <Route path={"/journeys/:journeyId/:blockId"} element={<PublicIndividualBlock/>}/>
        <Route path={"/journeys/:journeyId/:blockId/:stepId"} element={<PublicIndividualStep/>}/>
        <Route path={"/profile/:userId"} element={<PublicUserPage/>}/>
        <Route path={"/leaderboard"} element={<UserLeaderboard/> }/>

        <Route path={"/profile"} element={<IsPrivate><ProfilePage/></IsPrivate> }/>
        <Route exact path={"/profile/:userId/journeys"} element={<IsPrivate><JourneysList/></IsPrivate>}/>
        <Route path={"/profile/journeys/:journeyId/edit"} element={<IsPrivate><JourneyBlocksPage/></IsPrivate> }/>
        <Route path={"/profile/journeys/:journeyId/edit/block/:blockId"} element={<IsPrivate><BlocksStepsPage/></IsPrivate> }/>
      </Routes>
    </div>
  );
}

export default App;
