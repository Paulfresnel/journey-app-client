import axios from "axios";
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import CreateBlock from "../../components/CreateBlock/CreateBlock";
const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function UserJourneyPage() {

    const [ userJourney, setUserJourney ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showForm, setShowForm ] = useState(false);
    const [ updatedJourney, setUpdatedJourney ] = useState({});
    const { journeyId } = useParams();


    useEffect(() => {
        axios.get(`${API_ROUTE}/api/journeys/${journeyId}`)
            .then(foundJourney => {
                if(foundJourney){
                setUserJourney(foundJourney.data);
                setIsLoading(false)}
            })
    }, [updatedJourney]);

    return(
        <div>
            {isLoading && <h1>Loading...</h1>}   
            {userJourney &&
            <>
                <div>
                    <h1>{userJourney.title}</h1>
                    <img src={userJourney.image} alt={`${userJourney.title}`} style={{width: '300px', height: 'auto'}}/>
                    <div>
                        {userJourney.blocks && userJourney.blocks.map(block => {
                            return (
                                <div>
                                    <h2>{block.title}</h2>
                                </div>)
                        })}
                    </div>
                </div>
                <div>  
                    {showForm ? <CreateBlock journeyId={journeyId} setUpdatedJourney={setUpdatedJourney}/> : <button type="button" onClick={() => setShowForm(true)}>New Block</button>}
                </div>           
            </>} 
       </div> 
    )

};

export default UserJourneyPage;