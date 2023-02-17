import axios from "axios";
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function UserJourneyPage() {

    const [ userJourney, setUserJourney ] = useState({});
    const { journeyId } = useParams();


    useEffect(() => {
        axios.get(`${API_ROUTE}/api/journeys/${journeyId}`)
            .then(foundJourney => setUserJourney(foundJourney.data))
    }, [userJourney])

    return(
        <div>

        </div>
    )

};

export default UserJourneyPage;