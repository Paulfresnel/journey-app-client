import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios";
import './PublicIndividualStep.css'

const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function PublicIndividualStep(){
    const navigate = useNavigate()
    const [step, setStep] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [updatedDate, setUpdatedDate] = useState('')



    const {stepId} = useParams()

    useEffect(()=>{
        axios.get(`${API_ROUTE}/api/steps/${stepId}`)
            .then(response=>{
                console.log(response)
                let stepReceived = response.data
                let dateUpdated = stepReceived.updatedAt
                let dateObject = new Date(dateUpdated)
                 const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            let readableUpdatedDate = dateObject.toLocaleDateString('en-US', options)
            setUpdatedDate(readableUpdatedDate)
                setStep(stepReceived)
                setTimeout(()=>{
                    setIsLoading(false)
                },1000)
            })
    },[stepId])

    return(
        <div>
            {isLoading && <img alt="spinner loader" src="https://media4.giphy.com/media/y1ZBcOGOOtlpC/200w.webp?cid=ecf05e47wd7jjsjcajwwmcw8vx0gefelzn5rqsr3gy1jhymm&rid=200w.webp&ct=g"/>}
            {!isLoading && <div>
                <div className="margined">
             <button onClick={()=>navigate(-1)} className="btn btn-primary space-r">Go Back</button>
            <i className="bi bi-info-circle-fill log-info"></i>
                <ul className="hide">
                        <li>Last updated on <span className="bold">{updatedDate}</span></li>
                </ul>
            <div className="div-block"/>
          
                <h1 className="t-a-center m-bottom">{step.title}</h1>
           
            <img alt={step.title} className="img-fluid margin-b" src={step.image}/>
            <br/>
            <h6 className="importance t-a-center">Importance: {step.importance}</h6>
            <br/>
            <h6 className="importance t-a-center">Learning Difficulty: {step.difficulty}</h6>
            <br/>
            <p className="description t-a-center bordered">{step.description}</p>
            </div>
            <div>
            <h3>Step Resources:</h3>
            <table className="centered">
            <thead>
                <tr>
                    <td className="space-td">#</td>
                    <td>Link Name</td>
                </tr>
            </thead>
            <tbody>
                {step.links.map((link,index)=>{
                    return <tr>
                        <td>{index}</td>
                        <td><Link to={link.link}> {link.name}</Link></td>
                    </tr>
                })}
                </tbody>
                </table>
            </div>
            </div>
            }
        </div>
    )
}
export default PublicIndividualStep