import { useEffect, useState } from "react"
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './PublicUserPage.css'
import UserJourneyPage from "../UserJourneyPage/UserJourneyPage";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function PublicUserPage(){
    const navigate = useNavigate()
    const {userId} = useParams()
    const [journeys, setJourneys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] =useState('')
    const [userImg, setUserImg] =useState('')
    const [creationDate, setCreationDate] =useState('')


    const [totalUpvotes,setTotalUpvotes] = useState(0)



    useEffect(()=>{
        let counter=0
        axios.get(`${API_ROUTE}/api/users/${userId}`)
            .then(response=>{
                let user = response.data
                if(user.createdAt){
                let userCreationDate = user.createdAt
                let userCreationDateObject = new Date(userCreationDate)
                const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            let readableUpdatedDate = userCreationDateObject.toLocaleDateString('en-US', options)
              setCreationDate(readableUpdatedDate)
}
                let userJourneysCreated = user.journeysCreated.filter((journey,)=>{
                    if (journey.isPublic === true){
                        return journey
                    }
                })

                userJourneysCreated.map(journey=>{
                    if (journey.upvoteUsers){
                        return counter += journey.upvoteUsers.length
                    }
                })
                setTotalUpvotes(counter)
                
                let usernameMaj = user.username.charAt(0).toUpperCase()+ user.username.slice(1)
                setUserImg(user.profilePicture)
                setUsername(usernameMaj)
                setJourneys(userJourneysCreated)
                setIsLoading(false)
            })
    },[])

    return(
        <div className="margined">
                <button onClick={()=>navigate(-1)} className="btn btn-primary space-r">Go Back</button>

            <div className='main-container-carousel no-padding'>
                        <div className="div-block"/>

            {creationDate && <div> <i className="bi bi-info-circle-fill log-info"></i>
                <ul className="hide">
                        <li>Last updated on <span className="bold">{creationDate}</span></li>
                </ul>
                </div>}
            {!isLoading &&<h2><span className="bold username">{username}</span>'s Profile Page</h2>}
            <br/>
            <div className="flex-row-adjusted">
            {!isLoading && <img className="small-pic img-fluid" src={userImg}/>}
            
            {!isLoading && <div className="flex-row-public">
            <div className="flex-column-public green">
                <h3 className="btn btn-outline-success upvotes-received">Upvotes</h3>
                <h5 className="number">{totalUpvotes}</h5>
            </div>
            <div className="flex-column-public gray">
             <h3 className="btn btn-secondary total-journeys">Journeys</h3>
             <h5 className="number">{journeys.length}</h5>
            </div>
             </div>}
            

            
            </div>
            <div className="div-block"/>
            <br/>
            <h1>{journeys.length !==0 ? 'Public Journeys Created' : 'This user has currently no public Journeys'}</h1>
            {isLoading && <img alt="spinner loading" src="https://media4.giphy.com/media/y1ZBcOGOOtlpC/200w.webp?cid=ecf05e47wd7jjsjcajwwmcw8vx0gefelzn5rqsr3gy1jhymm&rid=200w.webp&ct=g"/>}
            
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
             <h1 className="carousel-title">{journey.title}{!journey.blocks && <span class="badge bg-danger new-badge">Empty Journey</span>}</h1>
            <p className="upvote">Total Upvotes received: {journey.upvoteUsers.length}</p>
            <Link to={`/journeys/${journey._id}`}>
            <button className="btn btn-primary carousel-btn">Check Journey</button>
            </Link>
        </div>
    </div>
     )
} else {
    return (<div className="carousel-item">
        <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
        <div className="carousel-caption">
        
            <h1 className="carousel-title">{journey.title}{journey.blocks.length ===0 && <span class="badge bg-danger new-badge">Empty Journey</span>}</h1>
            
            {journey.upvoteUsers && <p className="upvote">Total Upvotes received: {journey.upvoteUsers.length}</p>}
            {journey.category && <h6 className="category">{journey.category}</h6>}
            <Link to={`/journeys/${journey._id}`}>
            <button className="btn btn-primary carousel-btn">Check Journey</button>
            </Link>
        </div>
    </div>
     )
}
     }) }
     </div> 
     
  </div>
  {journeys.length !== 0 && <div><button className="carousel-control-prev" type="button" data-bs-target="#journeysCreated" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#journeysCreated" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden black">Next</span>
  </button>
  </div>}
</div>
    }
    </div>
    </div>)}

export default PublicUserPage