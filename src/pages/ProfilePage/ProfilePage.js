import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import CreateJourney from "../../components/CreateJourney/CreateJourney";
import axios from "axios";
import { Link } from "react-router-dom";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function ProfilePage() {
    
    
    const { user, isLoading } =  useContext(AuthContext);
    const [showForm, setShowForm] = useState(false);
    const [userLogged, setUserLogged] = useState({user});
    const [journeys, setJourneys] = useState([]);



    useEffect(() => {

    if(user){

        setUserLogged(user);
        axios.get(`${API_ROUTE}/api/users/${user._id}/`)
            .then(foundUser => setJourneys(foundUser.data.journeysCreated))}
            
    }, [user])

    

    return(
        <div>
            {user && 
                <>
                    <h1>Hello {user.username}</h1>
                    {journeys.map(journey => {
                        return (
                            <div key={journey._id}>
                                <Link to={`/journeys/${journey._id}`}>
                                    <h1>{journey.title}</h1>
                                </Link>
                                <img src={journey.image} alt={`${journey.title}`} style={{width: '300px', height: 'auto'}}/>
                                <h2>{journey.description}</h2>
                            </div>)
                    })}
                    <div>
                        <button onClick={()=>setShowForm(!showForm)}>Show Form</button> 
                            {showForm && <CreateJourney/>}
                    </div>
                </>}

                {isLoading && <h1>Loading...</h1>}
                
        </div>
    )
}

export default ProfilePage;