import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom";
import './UsersLeadBoard.css'
import { AuthContext } from "../../context/auth.context";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function UsersLeadBoard(){

    const [sortedUsersArray, setSortedUsersArray] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const {user} = useContext(AuthContext)

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
                let journeysToDisplay = newArray.filter(user=>{
                    if(user.journeysToDisplay.length>0){
                        return user
                    }
                })
               setSortedUsersArray(journeysToDisplay)
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
                        <td className="table-row-heading">Journeys Created <span className="bold italic">*</span></td>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsersArray && sortedUsersArray.map((userInfo,index)=>{
                        
                            return (
                                <tr key={userInfo._id} className="table-row">
                            <td className={index%2===0 ? "table-row-par font-color" : "table-row-odd"}>{index+1}</td>
                            {!user && <td className={index%2===0 ? "table-row-par font-color underlined" : "table-row-odd underlined"} ><Link className={index%2===0 ? "font-color bold" : "bold colored"} to={`/profile/${userInfo._id}`}>{userInfo.username.charAt(0).toUpperCase()+userInfo.username.slice(1)}</Link></td>}
                            {user && <td className={index%2===0 ? "table-row-par font-color underlined" : "table-row-odd underlined"} >{user._id === userInfo._id ? <Link className={index%2===0 ? "font-color bold" : "bold colored"} to={`/profile`}>{userInfo.username.charAt(0).toUpperCase()+userInfo.username.slice(1)}</Link> : <Link className={index%2===0 ? "font-color bold" : "bold colored"} to={`/profile/${userInfo._id}`}>{userInfo.username.charAt(0).toUpperCase()+userInfo.username.slice(1)}</Link>}</td>}
                            <td className={index%2===0 ? "table-row-par font-color" : "table-row-odd"}>{userInfo.totalUpvotes}</td>
                            <td className={index%2===0 ? "table-row-par font-color" : "table-row-odd"}>{userInfo.journeysToDisplay.length}</td>

                        </tr>)
                        
                    })}
                </tbody>
            </table>}
            <p className="text-allign-l italic"> * : Containing at least <span className="bold">1 Step </span></p>
        </div>
    )
}

export default UsersLeadBoard