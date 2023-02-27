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
    const todayMilliseconds = new Date().getTime()  
    const twoDaysMilliseconds = 86400000*2

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

      const toggleBlocks = (index) => {
        setAllPublicJourneys((prevJourneys) =>
          prevJourneys.map((journey, i) =>
            i === index ? { ...journey, showBlocks: !journey.showBlocks } : journey
          )
        );
      };  


    useEffect(()=>{
        console.log('useEffect');
        async function fetchData(){
          await  axios.get(`${API_ROUTE}/api/journeys`)
            .then(async (journeysArray)=>{
                let journeysArrayReceived = journeysArray.data.publicJourneys
               let newArray = journeysArrayReceived.map((journey,index)=>{
                  let counter=0
                  let creationDate = journey.createdAt
                  let creationDateMillisecondsLength = new Date(creationDate).getTime()
                  let updatedDate = journey.updatedAt
                  let updatedDateMillisecondsLength = new Date(updatedDate).getTime()
                  journey.dateCreated = creationDateMillisecondsLength
                  journey.dateUpdated = updatedDateMillisecondsLength

                  journey.blocks.map(block=>{
                    if (block.steps){
                    counter += block.steps.length
                    return counter }
                    else {counter +=0 
                    return counter}
                  })
                  journey.stepsLength = counter
                  console.log(counter)
                  return journey
                })
                await setAllPublicJourneys(newArray)
                setTimeout(()=>{
                  setIsLoading(false)
                },1000)  
            })
            .catch(err=>console.log(err))
        }
        fetchData()
         
    }, [])

    console.log('allPublicJourneys:', allPublicJourneys);
    let showBlocks;
    return(
        <div className='centered-journeys'>
    {isLoading && <img alt="loading spinner" src="https://media4.giphy.com/media/y1ZBcOGOOtlpC/200w.webp?cid=ecf05e47wd7jjsjcajwwmcw8vx0gefelzn5rqsr3gy1jhymm&rid=200w.webp&ct=g"/>}
        {!isLoading && allPublicJourneys.map((journey,index)=>{
          console.log(journey)
            return ( <div className="card" key={journey._id}> 
                    <img className="min-height card-img-top" src={journey.image} alt={journey.title}/>
                <div className="card-body">
                
                    <h5 className="card-title">{journey.title}{(todayMilliseconds - journey.dateCreated<twoDaysMilliseconds) && <span class="badge bg-warning new-badge">New</span>}{(todayMilliseconds - journey.dateUpdated<twoDaysMilliseconds) && <span class="badge bg-success new-badge">Recently Updated</span>}{journey.stepsLength === 0 && <span class="badge bg-danger new-badge">Empty Journey</span>}</h5> 
                    <div className='flex-col'>
                    <p className='btn btn-outline-primary like'><span className='bold'>{journey.upvoteUsers ? journey.upvoteUsers.length : "0"}</span> Upvotes</p> 
                    {user && <button  onClick={(e)=>likeJourney(e)} value={journey.upvoteUsers && journey.upvoteUsers.includes(user._id)}  type="button" className="btn btn-primary btn-sm"><i data-journeyid={journey._id}  className={journey.upvoteUsers && journey.upvoteUsers.includes(user._id) ? "bi bi-balloon-heart-fill": "bi bi-balloon-heart fa-beat"}> {journey.upvoteUsers && journey.upvoteUsers.includes(user._id)? "Upvoted" : "Not Upvoted"} </i></button>}
                    </div>
                    <p className="card-text">{journey.description}</p>
                    <p>Created by: <Link to={`/profile/${journey.author._id}`}> {journey.author.username}</Link></p>
                    <p>Learning Blocks: {journey.blocks.length}</p>
                    <p>Total Steps: {journey.stepsLength}</p>
                  {journey.category && <div><p className='no-m'>Category:</p><h6 className="btn-outline-dark category sized">{journey.category}</h6></div>}
                    {journey.tags.length !==0 && <p>Tags: {journey.tags}</p>}
                    
                </div>
                
                {journey.blocks.length !==0  && <button className='show-blocks btn btn-info' value={showBlocks} onClick={() => toggleBlocks(index)} > Show/Hide Blocks </button>}
             {journey.showBlocks  && <ul className="list-group list-group-flush">
             {allPublicJourneys[index].blocks.map(block=>{
                return (
                    <li className="list-group-item">
                    <p className='bold underline'>{block.title}</p>
                    <p className='italic'>Number of Steps : {block.steps.length}</p>
                    {block.steps.length!==0 && <button className='btn btn-outline-warning'><Link to={`/journeys/${journey._id}/${block._id}`}> Check Block</Link></button>}
                    </li>
                )
             })}
             </ul>}
             
             <div className="card-body">
             <br/>
             <Link to={`/journeys/${journey._id}`}>
               <button href="#" className="btn btn-warning card-link">Journey link</button>
               </Link>
             </div>
            </div>)
        })}
            
    
        </div> 
    )
}

export default PublicJourneysPage