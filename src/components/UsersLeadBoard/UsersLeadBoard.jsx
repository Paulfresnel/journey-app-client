import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom";
import './UsersLeadBoard.css'

const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function UsersLeadBoard(){

    const [sortedUsersArray, setSortedUsersArray] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        axios.get(`${API_ROUTE}/api/users`)
            .then(response=>{
                let userResponseArray = response.data.users
                let filteredArray = userResponseArray.map(user=>{
                    user.totalUpvotes = 0
                    if (user.journeysCreated){
                    user.journeysCreated.map(journey=>{
                        if (journey.upvoteUsers.length){
                            user.totalUpvotes += journey.upvoteUsers.length
                        }
                    })
             }
             return user
               })

               let sortedArray = filteredArray.sort((a,b)=>{
                return b.totalUpvotes - a.totalUpvotes
               })
             let newArray=  sortedArray.map(user=>{
                    user.journeysCreated.map(journey=>{
                        journey.totalSteps = 0
                        journey.blocks.map(block=>{
                            block.totalSteps = block.steps.length
                            journey.totalSteps += block.steps.length
                            return block
                        })
                    return journey
                    })
                return user
                })
              let removeEmptyJourneys = newArray.map(user=>{
                    user.journeysToDisplay = []
                  user.journeysCreated.filter((journey,index)=>{
                        if(journey.totalSteps > 0){
                         user.journeysToDisplay.push(journey)
                         return user
                    } else {
                        return user
                    }
                    })
                    return user
                })
               setSortedUsersArray(removeEmptyJourneys)
               setIsLoading(false)
            })
    },[])

    return(
        <div>
            {!isLoading&& <table className="table table-stripped">
                <thead className="thead-dark">
                    <tr >
                        <td className="table-row-heading">Rank</td>
                        <td className="table-row-heading">Name</td>
                        <td className="table-row-heading">Upvotes Received</td>
                        <td className="table-row-heading">Non-empty Journeys</td>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsersArray && sortedUsersArray.map((user,index)=>{
                        return <tr key={user._id} className="table-row">
                            <td className={index%2===0 ? "table-row-par font-color" : "table-row-odd"}>{index+1}</td>
                            <td className={index%2===0 ? "table-row-par font-color underlined" : "table-row-odd underlined"} ><Link className={index%2===0 ? "font-color bold" : "bold colored"} to={`/profile/${user._id}`}>{user.username.charAt(0).toUpperCase()+user.username.slice(1)}</Link></td>
                            <td className={index%2===0 ? "table-row-par font-color" : "table-row-odd"}>{user.totalUpvotes}</td>
                            <td className={index%2===0 ? "table-row-par font-color" : "table-row-odd"}>{user.journeysToDisplay.length}</td>

                        </tr>
                    })}
                </tbody>
            </table>}
        </div>
    )
}

export default UsersLeadBoard