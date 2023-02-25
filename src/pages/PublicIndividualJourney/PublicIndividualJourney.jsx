import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios";
import './PublicIndividualJourney.css'


const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function PublicIndividualJourney(){
    const [journey, setJourney] = useState({})
    const {journeyId} = useParams() 
    const [counter, setCounter] =useState(0)
    const [creationDate, setCreationDate] = useState('')
    const [updatedDate, setUpdatedData] = useState('')
    const [isLoading, setIsLoading] = useState(true)

useEffect(()=>{
    if (journeyId){
        axios.get(`${API_ROUTE}/api/journeys/${journeyId}`)
            .then(response=>{
                let journey = response.data 
                setJourney(journey)
                let dateCreation = response.data.createdAt
                let dateUpdated = response.data.updatedAt

                let dateObject = new Date(dateCreation)
                let dateUpdatedObject = new Date(dateUpdated)
                const options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                let readableCreationDate = dateObject.toLocaleDateString('en-US', options)
                let readableUpdatedData = dateUpdatedObject.toLocaleDateString('en-US', options)
                setCreationDate(readableCreationDate)
                setUpdatedData(readableUpdatedData)
                console.log(journey)
                let counterIt =0
                journey.blocks.map((block)=>{
                    if (block.steps !== []){
                        counterIt += block.steps.length
                    return counterIt
                }
                })
                setCounter(counterIt)
                setTimeout(()=>{setIsLoading(false)},1000)
            })
    }
},[])

    return(
        <div className="margined">
        {isLoading && <img src="https://media4.giphy.com/media/y1ZBcOGOOtlpC/200w.webp?cid=ecf05e47wd7jjsjcajwwmcw8vx0gefelzn5rqsr3gy1jhymm&rid=200w.webp&ct=g"/>}
            {!isLoading && <div>
                <i className="bi bi-info-circle-fill log-info"></i>
                <ul className="hide">
                        <li >Created on <span className="bold">{creationDate}</span></li>
                        <li>Last updated on <span className="bold">{updatedDate}</span></li>
                    </ul>
                    <div className="div-block"/>
            <div className="journey-main-info">
            
                <div className="flex-row-adapted">
                    <div>
                    <h1 className="small-font">{journey.title}</h1>
                    
                    </div>
                    
                    <h3 className="small-font">{journey.upvoteUsers && journey.upvoteUsers.length} Upvotes</h3>
                </div>
                {journey.author && <div>
                
                <h4 className="author">Author: <Link to={`/profile/${journey.author._id}`}> {journey.author.username}</Link></h4>
                </div>}                    
                    <img className="img-fluid" src={journey.image}/>
                    <h4 className="italic">{journey.description}</h4>
                    <h5>Total learning Blocks in Journey: {journey.blocks.length}</h5>
                    <h6>Total Steps in Journey : {counter}</h6>
                
            </div>
            
            <h2>Learning Blocks</h2>
            <div className="journey-blocks-info">
            {journey.blocks !==[] && journey.blocks.map(block=>{
                return <div className="card" style={{width: "18rem"}}>
                    <div className="card-body">
                       <h5 className="card-title">{block.title}</h5>
                      
                       <h6 className="card-subtitle mb-2 text-muted">{block.importance}</h6>
                       <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                       <div className="card-links">
                      <Link to={`/journeys/${journeyId}/${block._id}`}> <p href="undefined" className="card-link">Card link</p></Link>
                       <p className="card-link second-link">{block.category}</p>
                        </div>
                    </div>
                </div>
            })
                
                }
            </div>

            </div>}
        </div>
    )
}

export default PublicIndividualJourney