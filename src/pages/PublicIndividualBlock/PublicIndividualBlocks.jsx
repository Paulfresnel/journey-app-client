import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios";
import './PublicIndividualBlock.css'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function PublicIndividualBlock(){
    const navigate = useNavigate()
    const {journeyId, blockId} = useParams()
    const [block, setBlock] =useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [updatedDate, setUpdatedDate] = useState('')

useEffect(()=>{
    axios.get(`${API_ROUTE}/api/blocks/${blockId}`)
        .then(response=>{
            const {block} = response.data
            let dateUpdated = block.updatedAt
            let dateObject = new Date(dateUpdated)
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            let readableUpdatedDate = dateObject.toLocaleDateString('en-US', options)
            setUpdatedDate(readableUpdatedDate)
            setBlock(block)
           setTimeout(()=>{
                setIsLoading(false)
           }, 1000) 
        })
}, [])
    console.log(block)


    return(

        <div>
        
        {isLoading && <img src='https://media4.giphy.com/media/y1ZBcOGOOtlpC/200w.webp?cid=ecf05e47wd7jjsjcajwwmcw8vx0gefelzn5rqsr3gy1jhymm&rid=200w.webp&ct=g'/>}
        {!isLoading &&
         
        <div className="margined">
        <button onClick={()=>navigate(-1)} className="btn btn-primary space-r">Go Back</button>
            <i className="bi bi-info-circle-fill log-info"></i>
                <ul className="hide">
                        <li>Last updated on <span className="bold">{updatedDate}</span></li>
                </ul>
            <div className="div-block"/>
            <div className="flex-row-adapted">
                <h1>{block.title}</h1>
                <h2 className="second-link">{block.category}</h2>
            </div>
            <h6 className="importance border-imp">{block.importance}</h6>
            <p className="description bordered">{block.description}</p>
            <div>
                <table className="centered">
                    <thead>
                        <tr>
                            <td>Step title</td>
                            <td># of links</td>
                            <td>Step link</td>
                        </tr>
                    </thead>
                    <tbody>
                        {block.steps.map((step)=>{
                            return (
                            <tr>
                                <td>{step.title}</td>
                                <td>{step.links.length}</td>
                                <td><Link to={`/journeys/${journeyId}/${blockId}/${step._id}`}> Check Step</Link></td>
                            </tr>
                        )})}
                    </tbody>
                </table>

            </div>
        </div>
        }

        </div>
    )
}

export default PublicIndividualBlock