import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import './PublicIndividualJourney.css'


const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function PublicIndividualJourney(){
    const navigate = useNavigate()
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
            {isLoading && 
                <div className="d-flex justify-content-center">  
                    <div style={{marginTop: '150px'}} className='text-center'>
                        <div className="spinner-border spinner-border-lg">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                </div>
            }
            {!isLoading && <div>
                <button onClick={()=>navigate(-1)} className="btn btn-primary space-r">Go Back</button>
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
                {journey.category && <h6 className="btn-outline-dark category sized margin-b">{journey.category}</h6>}

                </div>}                    
                    <img className="img-fluid" src={journey.image}/>
                    <h4 className="italic">{journey.description}</h4>
                    <br/>
                    {journey.blocks.length !==0 && <div><h5>Total learning Blocks in Journey: {journey.blocks.length}</h5>
                    <h6 className="italic">Total Steps in Journey : {counter}</h6></div>}
                
            </div>
            <br/>
            {journey.blocks.length!==0 ? <h2>Learning Blocks</h2> : <div>
            <h2 className="warning">This journey has currently no learning blocks</h2>
            <button  className="btn btn-outline-danger" onClick={()=>navigate(-1)} >Go Back</button>
            </div>}
            <div className="journey-blocks-info">
            {journey.blocks !==[] && journey.blocks.map(block=>{
                return <div className="card" style={{width: "18rem"}}>
                    <div className="card-body">
                       <h5 className="card-title">{block.title}</h5>
                      
                       <h6 className="card-subtitle mb-2 text-muted">{block.importance}</h6>
                       <p className="card-text">{block.description}</p>
                       <p className="italic">{block.steps.length===1 ? `${block.steps.length} Step` : `${block.steps.length} Steps`}</p>
                       <div className="card-links">
                      <Link to={`/journeys/${journeyId}/${block._id}`}> <p  className="btn btn-outline-dark card-link">Block link</p></Link>
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