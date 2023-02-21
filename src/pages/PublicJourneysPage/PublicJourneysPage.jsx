import { useContext, useEffect, useState } from 'react'
import './PublicJourneysPage.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function PublicJourneysPage(){
    
    const [isLoading, setIsLoading] = useState(true)
    const [allPublicJourneys, setAllPublicJourneys] = useState([{}])
    const {user} = useContext(AuthContext)

    const likeJourney = (e) => {
        e.preventDefault();
        const journeyId = e.target.parentNode.value;
        axios.get(`${API_ROUTE}/api/users/${user._id}`)
          .then(async (userResponse) => {
            const currentUser = userResponse.data;
            
            await axios.put(`${API_ROUTE}/api/journeys/${journeyId}/like`, { userId: user._id })
                .then(apiResponse=>{
                    console.log("api response")
                    console.log(apiResponse)
                 })
                 .catch(err=>console.log(err))
            await axios.get(`${API_ROUTE}/api/journeys/`)
            .then(apiResponse=>{
                console.log("all journeys here")
                console.log(apiResponse)
                setAllPublicJourneys(apiResponse.data.publicJourneys)
             })
            
          })
          .catch(error => {
            console.log(error);
          })
          ;
      };
    

    useEffect(()=>{
        axios.get(`${API_ROUTE}/api/journeys`)
            .then(journeysArray=>{
                console.log("api response")
                let journeysArrayReceived = journeysArray.data.publicJourneys
                setAllPublicJourneys(journeysArrayReceived)
                console.log(allPublicJourneys)
                setIsLoading(false)
            })
    }, [])

    return(
        <div>
        {allPublicJourneys && !isLoading && allPublicJourneys.map((journey,index)=>{
            return ( <div className="card">
                    <img className="card-img-top" src={journey.image} alt="Card  cap"/>
                <div className="card-body">
                    <h5 className="card-title">{journey.title}</h5> 
                    <div>
                    <p>{journey.upvoteUsers.length} Likes</p> 
                    {user && <button value={journey._id} onClick={(e)=>likeJourney(e)} type="button" className="btn btn-primary btn-sm"><i className={journey.upvoteUsers.includes(user._id) ? "bi bi-balloon-heart-fill": "bi bi-balloon-heart"}> Like </i></button>}
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