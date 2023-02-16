import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import CreateJourney from "../../components/CreateJourney/CreateJourney";
import axios from "axios";
import { Link } from "react-router-dom";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function ProfilePage() {


    const {user, setUser} =  useContext(AuthContext)
    console.log(user)
    const [showForm, setShowForm] = useState(false)


    return(
        <div>
        {user ? <div><h1>Hello {user.username}</h1>
            <Link to={`/profile/${user._id}/journeys`}>
            <button>Check the Journeys created</button>
            </Link>
            <button onClick={()=>setShowForm(!showForm)}>Show Form</button>
            {showForm && <CreateJourney/>}</div> : <p>Loading..</p> }
            
        </div>
    )

}

export default ProfilePage;