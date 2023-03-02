import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import './JourneysLeadBoard.css'
const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function JourneysLeadBoard(){

    const [rankedJourneys, setRankedJourneys] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const {user} = useContext(AuthContext)



    useEffect(()=>{
        axios.get(`${API_ROUTE}/api/journeys`)
            .then(response=>{
                let journeysArray = response.data.publicJourneys
                let newArray = journeysArray.map((journey,index)=>{
                  let counter=0
        
                  journey.blocks.map(block=>{
                    if (block.steps.length!==0){
                    counter += block.steps.length
                    return journey
                }
                    else {
                        counter +=0 
                        return journey
                }
                  })
                  journey.stepsLength = counter
                  return journey
                })
                let filteredArray = newArray.filter(journey=>{
                    return journey.stepsLength > 0
                })
                let sortedArray = filteredArray.sort((a,b)=>{
                    return b.upvoteUsers.length - a.upvoteUsers.length
                })
                setRankedJourneys(sortedArray)
                setIsLoading(false)
            })
    },[])

    return(
        <div>
            {!isLoading && <table className="">
                <thead className="thead-dark">
                    <tr className="table2">
                        <td className="table-row-heading table-journeys">Rank</td>
                        <td className="table-row-heading">Title</td>
                        <td className="table-row-heading">Upvoted</td>
                        <td className="table-row-heading">Author</td>
                    </tr>
                </thead>
                <tbody>
                    {rankedJourneys && rankedJourneys.map((journey,index)=>{
                        return <tr key={journey._id} className="table-row table-journeys table2">
                            <td className={index%2===0 ? "table-row-par font-color " : "table-row-odd  "}>{index+1}</td>
                            {!user && <td className={index%2===0 ? "table-row-par font-color " : "table-row-odd "}><Link className={index%2===0 ?"font-color underlined" : "colored underlined"} to={`/journeys/${journey._id}`}> {journey.title}</Link></td>}
                            {user && <td className={index%2===0 ? "table-row-par font-color " : "table-row-odd "}>{user._id === journey.author._id ? <Link className={index%2===0 ?"font-color underlined" : "colored underlined"} to={`/profile/journeys/${journey._id}`}> {journey.title}</Link> : <Link className={index%2===0 ?"font-color underlined" : "colored underlined"} to={`/journeys/${journey._id}`}> {journey.title}</Link>}</td>}
                            <td className={index%2===0 ? "table-row-par font-color " : "table-row-odd "}>{journey.upvoteUsers.length}</td>
                            {!user && <td className={index%2===0 ? "table-row-par font-color  underlined" : "table-row-odd underlined"}><Link className={index%2===0 ?"font-color underlined bold" : "underlined bold"} to={`/profile/${journey.author._id}`}> {journey.author.username.charAt(0).toUpperCase()+journey.author.username.slice(1)}</Link></td>} 
                            {user && <td className={index%2===0 ? "table-row-par font-color  underlined" : "table-row-odd underlined"}>{user._id === journey.author._id ? <Link className={index%2===0 ?"font-color underlined bold" : "underlined bold"} to={`/profile`}> {journey.author.username.charAt(0).toUpperCase()+journey.author.username.slice(1)}</Link> : <Link className={index%2===0 ?"font-color underlined bold" : "underlined bold"} to={`/profile/${journey.author._id}`}> {journey.author.username.charAt(0).toUpperCase()+journey.author.username.slice(1)}</Link>}</td>}
                        </tr>
                    })}
                </tbody>
            </table>}
        </div>
    )



}
export default JourneysLeadBoard