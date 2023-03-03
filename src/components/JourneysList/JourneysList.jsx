import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import './JourneysList.css'
import CreateJourney from "../CreateJourney/CreateJourney";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function JourneysList(){
    const {user, setUser} = useContext(AuthContext)
    const {userId} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [showForm,setShowForm] = useState(false)

    const changeVisibility = ()=>{
        setShowForm(!showForm)
    }

    useEffect(()=>{
        axios.get(`${API_ROUTE}/api/users/${userId}`)
            .then(apiResponse=>{
                let updatedUser = apiResponse.data
                setUser(updatedUser)
                setIsLoading(false)
            })
    },[userId])

    return(
        <div>
        <button onClick={changeVisibility} >Show/Hide Form</button>
        {showForm && <div>
            <CreateJourney/>
        </div>}
    <h1>Journeys Created</h1>
    {isLoading && <p>Loading..</p>}  
    {!isLoading && <div> {user.journeysCreated.map((journey, index)=>{
        return <div>
                <img className="journey-image" src={journey.image}/>
                <h1>{journey.title}</h1>
                <h2>{journey.description}</h2>
                <h2>Learning Block in Journey: {journey.blocks.length}</h2>
                <h3>Total Copiers: {journey.usersCopying.length}</h3>
                <h4>Total Upvotes: {journey.upvoteUsers.length}</h4>
                <h5>{journey.isPublic ? "Journey is currently Public" : "Journey is currently Private" }</h5>
                <Link to={`/profile/journeys/${journey._id}/edit`}>
                <button>Edit Journey</button>
                </Link>
                <button value={journey._id} >Delete Journey</button>
        </div>
    })
    } 
    </div>
    }
        </div>
    )
}

export default JourneysList