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
    const [ blockToDisplay, setBlockToDisplay ] = useState(''); 
    const [ fieldToEdit, setFieldToEdit ] = useState('');
    const { journeyId } = useParams();


    useEffect(() => {
        axios.get(`${API_ROUTE}/api/journeys/${journeyId}`)
            .then(foundJourney => {
                if(foundJourney){
                    console.log(foundJourney.data);
                setUserJourney(foundJourney.data);
                setIsLoading(false)}
            })
    }, [updatedJourney]);

    const handleEditValue = (event) => {
        if(event.target.value && event.target.value !== userJourney.title){
            axios.put(`${API_ROUTE}/api/journeys/${userJourney._id}`, {title: event.target.value})
                .then(response => setUpdatedJourney(response.data))
            setFieldToEdit('')
            } else setFieldToEdit('');
        }
        

    return(
        <div>
            {isLoading && <h1>Loading...</h1>}   
            {userJourney &&
            <>
                <div>
                    {fieldToEdit === 'user-journey-title' ? <input type="text" defaultValue={userJourney.title} autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(event) => handleEditValue(event)}/> : <h1 id='user-journey-title' onClick={() => setFieldToEdit('user-journey-title')}>{userJourney.title}</h1>}
                    <img src={userJourney.image} alt={`${userJourney.title}`} style={{width: '300px', height: 'auto'}}/>
                    <h2>{userJourney.description}</h2>
                    <div>
                        {userJourney.tags && userJourney.tags.map(tag => {
                            return <h3 key={Math.random()*10}>{tag}</h3>
                        })}
                    </div>
                    {userJourney.isPublic && <h2>Upvotes: {userJourney.upvoteUsers}</h2>}
                    {userJourney.isPublic && <h2>Copied {userJourney.usersCopying.length} times</h2>}
                    <div>
                        {userJourney.blocks && userJourney.blocks.map(block => {
                                if(blockToDisplay === block._id){
                                 return (
                                    <div key={block._id} style={{display:'flex', flexDirection: 'column'}}>
                                        <button onClick={() => setBlockToDisplay("")}><h2>{block.title}</h2></button>
                                        <p>{block.description}</p>
                                        <p>{block.category}</p>
                                        <p>{block.importance}</p>
                                    </div>)
                                } else return (
                                    <div key={block._id} style={{display:'flex', flexDirection: 'column', justifyItems: 'center'}}>
                                        <button onClick={() => setBlockToDisplay(block._id)}><h2>{block.title}</h2></button>
                                    </div>
                                    )}
                                )}
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