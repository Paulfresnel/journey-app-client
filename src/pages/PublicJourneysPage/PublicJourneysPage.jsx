import { useContext, useEffect, useState } from 'react'
import './PublicJourneysPage.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function PublicJourneysPage(){
    
    const [isLoading, setIsLoading] = useState(true)
    const [allPublicJourneys, setAllPublicJourneys] = useState([])
    const {user} = useContext(AuthContext)

    const likeJourney = async (e) => {
        e.preventDefault();
        const journeyId = e.target.dataset.journeyid;
        const isLiked = e.target.value;
        try {
          let response;
          if (isLiked) {
            response = await axios.delete(`${API_ROUTE}/api/journeys/${journeyId}/like/${user._id}`);
          } else {
            response = await axios.post(`${API_ROUTE}/api/journeys/${journeyId}/like`, { userId: user._id });
          }
          const updatedJourney = response.data.journey;
          let copyOfJourneys = await [...allPublicJourneys]
          copyOfJourneys.map(journey=>{
            if (journey._id === updatedJourney._id) {
                console.log("updating here")
                console.log(journey)
                journey.upvoteUsers = updatedJourney.upvoteUsers;
                return journey
              } else {
                return journey;
              }
          })

          setAllPublicJourneys(copyOfJourneys);
        } catch (error) {
          console.log(error);
        }
      };
    

    useEffect(()=>{
        console.log('useEffect');
        async function fetchData(){
          await  axios.get(`${API_ROUTE}/api/journeys`)
            .then(async (journeysArray)=>{
                console.log("api response")
                console.log(journeysArray)
                let journeysArrayReceived = journeysArray.data.publicJourneys
                await setAllPublicJourneys(journeysArrayReceived)
                console.log(allPublicJourneys)
                setIsLoading(false)
            })
            .catch(err=>console.log(err))
        }
        fetchData()
         
    }, [])

    console.log('allPublicJourneys:', allPublicJourneys);

    return(
        <div className='centered-journeys'>
        {!isLoading && allPublicJourneys.map((journey,index)=>{
            return ( <div className="card">
                    <img className="card-img-top" src={journey.image} alt="Card  cap"/>
                <div className="card-body">
                    <h5 className="card-title">{journey.title}</h5> 
                    <div>
                    <p>{journey.upvoteUsers ? journey.upvoteUsers.length : "0"} Likes</p> 
                    {user && <button  onClick={(e)=>likeJourney(e)} value={journey.upvoteUsers && journey.upvoteUsers.includes(user._id)}  type="button" className="btn btn-primary btn-sm"><i data-journeyid={journey._id}  className={journey.upvoteUsers && journey.upvoteUsers.includes(user._id) ? "bi bi-balloon-heart-fill": "bi bi-balloon-heart fa-beat"}> Like </i></button>}
                    </div>
                    <p className="card-text">{journey.description}</p>
                    <p>Created by: {journey.author.username}</p>
                    {journey.tags.length !==0 && <p>Tags: {journey.tags}</p>}
                    
                </div>
             <ul className="list-group list-group-flush">
             {allPublicJourneys[index].blocks.map(block=>{
                return (
                    <li className="list-group-item">
                    <p>{block.title}</p>
                    <p>{block.steps.length}</p>
                    </li>
                )
             })}
             </ul>
             <div className="card-body">
             <Link to={`/journeys/${journey._id}`}>
               <button href="#" className="card-link">Journey link</button>
               </Link>
               <button href="#" className="card-link">Another link</button>
             </div>
            </div>)
        })}
            
    
        </div> 
    )
}

export default PublicJourneysPage