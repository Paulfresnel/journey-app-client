import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import CreateJourney from "../../components/CreateJourney/CreateJourney";
import axios from "axios";
import { Link } from "react-router-dom";
import './ProfilePage.css'

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function ProfilePage() {
    
    
    const { user } =  useContext(AuthContext);
    const [showForm, setShowForm] = useState(false);
    const [userLogged, setUserLogged] = useState({user});
    const [journeys, setJourneys] = useState([]);
    const [journeysCopied, setJourneysCopied] = useState([]);
    const [isLoading, setIsLoading] = useState(true)



    useEffect(() => {

    if(user){

        setUserLogged(user);
        axios.get(`${API_ROUTE}/api/users/${user._id}/`)
            .then(foundUser => {
                setJourneys(foundUser.data.journeysCreated)
                setJourneysCopied(foundUser.data.journeysCopied)
                setIsLoading(false)
            })}
            
    }, [user])

    

    return(
        <div className='main-container-carousel'>
    <h1>Journeys Created</h1>
    {isLoading && <h1>Loading...</h1>}
{!isLoading && <div id="journeysCreated" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
        {journeys.map((journey,index)=>{
            if (index===0){ 
                return <button style={{color:"black"}} type="button" data-bs-target="#journeysCreated" data-bs-slide-to={index} className="active" aria-current="true" aria-label="Slide 1" ></button>
            } else {
           return <button style={{color:"black"}} type="button" data-bs-target="#journeysCreated" data-bs-slide-to={index} className="" aria-label={`Slide ${index+1}`} ></button>
        }})}
        </div>  
  <div className="carousel-inner">
     <div> {journeys.map((journey,index)=>{
        if (index===0){
    return (<div className="carousel-item active">
        <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
        <div className="carousel-caption">
             <h1 className="carousel-title">{journey.title}</h1>
            <p className="upvote">Total Upvotes received: {journey.upvoteUsers.length}</p>
            <Link to={`/profile/journeys/${journey._id}`}>
            <button className="btn btn-primary carousel-btn">Edit Journey</button>
            </Link>
        </div>
    </div>
     )
} else {
    return (<div className="carousel-item">
        <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
        <div className="carousel-caption">
            <h1 className="carousel-title">{journey.title}</h1>
            {journey.upvoteUsers && <p className="upvote">Total Upvotes received: {journey.upvoteUsers.length}</p>}
            <Link to={`/profile/journeys/${journey._id}`}>
            <button className="btn btn-primary carousel-btn">Edit Journey</button>
            </Link>
        </div>
    </div>
     )
}
     }) }
     </div> 
     
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#journeysCreated" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#journeysCreated" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden black">Next</span>
  </button>
</div>}


<div className="divider"></div>

<h1>Journeys Upvoted</h1>
{!isLoading && <div id="journeysCopied" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
        {journeysCopied.map((journey,index)=>{
            if (index===0){
                return <button style={{color:"black"}} type="button" data-bs-target="#journeysCopied" data-bs-slide-to={index} className="active" aria-current="true" aria-label="Slide 1" ></button>
            } else {
           return <button style={{color:"black"}} type="button" data-bs-target="#journeysCopied" data-bs-slide-to={index} className="" aria-label={`Slide ${index+1}`} ></button>
        }})}
        </div>  
  <div className="carousel-inner">
     <div> {journeysCopied.map((journey,index)=>{
        if (index===0){
    return (<div className="carousel-item active">
        <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
        <div className="carousel-caption">
             <h1 className="carousel-title">{journey.title}</h1>
             {journey.author && <p className="upvote">Created by: <Link to={`/profile/${journey.author._id}`}>{journey.author.username}</Link></p>}
             <p className="upvote">Total upvotes: {journey.upvoteUsers.length}</p>
            <Link to={`/journeys/${journey._id}`}>
            <button className="btn btn-primary carousel-btn">Check the Journey</button>
            </Link>
        </div>
    </div>
     )
} else {
    return (<div className="carousel-item">
        <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
        <div className="carousel-caption">
            <h1 className="carousel-title">{journey.title}</h1>
            {journey.author && <p className="upvote">Created by: <Link to={`/profile/${journey.author._id}`}>{journey.author.username}</Link></p>}
            <p className="upvote">Total upvotes: {journey.upvoteUsers.length}</p>
            <Link to={`/journeys/${journey._id}`}>
            <button className="btn btn-primary carousel-btn">Check the Journey</button>
            </Link>
        </div>
    </div>
     )
}
     }) }
     </div> 
     
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#journeysCopied" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#journeysCopied" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden black">Next</span>
  </button>
</div>}












            {/* {user && 
                <>
                    <h1>Hello {user.username}</h1>
                    {journeys.map(journey => {
                        return (
                            <div key={journey._id}>
                                <Link to={`/profile/journeys/${journey._id}`}>
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

                 */}
                
        </div>
    )
}

export default ProfilePage;