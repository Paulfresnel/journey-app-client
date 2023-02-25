import CreateBlock from "../../components/CreateBlock/CreateBlock"
import { Link, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/auth.context"
import axios from "axios"
const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function JourneyBlocksPage(){

     const {journeyId} = useParams()
     const [showForm, setShowForm] = useState(false)
     const [isLoading, setIsLoading] = useState(true)
     const {user, setUser} = useContext(AuthContext)
     const [journey, setJourney] = useState(
        {_id:"", title:"", description:"", blocks:[{}], usersCopying:[""], tags:[""], upvoteUsers:[''], isPublic:"",image:""  }
     )




    const [block, setBlock] = useState('');
    const [blocksInJourney, setBlocksInJourney] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');   


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setBlock({...block, [name] : value});
    }

   
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${API_ROUTE}/api/${journeyId}/blocks`, block)
            .then( (apiResponse) => {
                console.log("new journey updated")
                let updatedJourney = apiResponse.data
                console.log(updatedJourney)
                setJourney(updatedJourney)
                console.log("copy array after block push")
                console.log(journey)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const deleteBlock = (e)=>{
        e.preventDefault()
        let blockId = e.target.value
        axios.delete(`${API_ROUTE}/api/${journeyId}/blocks/${blockId}`)
            .then(apiResponse=>{
                console.log(apiResponse)
                
                   let filteredBlocks =  journey.blocks.filter(block=>{
                        return block._id !== blockId
                    })
                    setJourney({...journey, blocks: filteredBlocks})
                
            })
    }
    const showHideForm=()=>{
        setShowForm(!showForm)
    }

    useEffect(()=>{
        axios.get(`${API_ROUTE}/api/journeys/${journeyId}`)
            .then(apiResponse=>{
                console.log(apiResponse)
                console.log("here")
                setJourney(apiResponse.data)
                console.log(journey)
                setIsLoading(false)
            })
    },[journeyId])


    return(
        <div >

        {isLoading && <p>Data is Loading...</p>} 
        
        {journey._id !=='' && <table style={{margin:'0 auto'}} >
            <thead>
                <tr>
                    <td>Block #</td>
                    <td>Title</td>
                    <td>Description</td>
                    <td># of Steps</td>
                    <td></td>
                    <td></td>
                </tr>
            </thead>
            
                <tbody>
                 {journey.blocks.map((block, index)=>{
                    return <tr key={block._id}>
                        <td>{index+1}</td>
                        <td>{block.title}</td>
                        <td>{block.description}</td>
                        <td>{block.steps.length}</td>
                        
                        <td><Link to={`/profile/journeys/${journeyId}/edit/block/${block._id}`}><button value={block._id}>Edit</button></Link></td>
                        
                        <td><button onClick={(e)=>deleteBlock(e)} value={block._id}>DELETE</button></td>

                    </tr>
                })}
                </tbody>
            
        </table>}
                <button onClick={showHideForm}>Show/Hide Form</button>
         {showForm && <div>
            <h1>Create a Block</h1>
            <form onSubmit={(event) => handleSubmit(event)}>
                <label> Title:
                    <input type='text' name='title' onChange={(event) => handleChange(event)}/>
                </label>  
                <br/> 
                <label> Description:
                    <input type='text' name='description' onChange={(event) => handleChange(event)}/>
                </label>
                <br/>  
                <label>Category:
                    <input type='text' name='category' onChange={(event) => handleChange(event)}/>
                </label>
                <br/> 
                <label> Importance Level:
                    <select name='importance' onChange={(event) => handleChange(event)}>
                        <option disabled selected>Select Priority</option>
                        <option value='Critical'>Critical</option>
                        <option value='Recommended'>Recommended</option>
                        <option value='Optional'>Critical</option>
                    </select>
                </label>
                <br/> 
                <button>Add Block</button>
            </form>
            {errorMessage && <h2>{errorMessage}</h2>}
         </div>}
        </div>
    )
}

export default JourneyBlocksPage