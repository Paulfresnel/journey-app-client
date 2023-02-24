import { useState } from "react"
import axios from "axios"
import './CreateBlock.css'
import { /* Link, */ useNavigate } from "react-router-dom"
import './CreateBlock.css'

const API_ROUTE = process.env.REACT_APP_SERVER_URL
/* const testArray = [];
 */
function CreateBlock(props) {

    const {journeyId, setJourney, journey, setUpdatedJourney, setShowForm} = props
    const navigate = useNavigate()

    const [block, setBlock] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setBlock({...block, [name] : value});
    }

    // DEFINE setJourney or setUserJourney! ///////////
   
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${API_ROUTE}/api/${journeyId}/blocks`, block)

            .then((apiResponse) => {
                // console.log("new block received")
                let updatedBlock = apiResponse.data
                // console.log(updatedBlock)
                setUpdatedJourney({...journey, blocks: updatedBlock})
                // setJourney({...journey, blocks: updatedBlock})
                
                // console.log("copy array after block push")
                // console.log(journey)
                setShowForm(false);

            })
            .catch(err => {
                console.log(err)
            })
    }

    return(
        <>  
            <div className="overlay-style"/>
            <div className="modal-style">
                <h1>Create a Block</h1>
                {/* <div>
                {} {blocksInJourney && blocksInJourney.map(blocks => {
                    return <div>
                            <h1>{blocks.block.name}</h1>
                            <h2>{blocks.block.description}</h2>
                            <h2>{blocks.block.category}</h2>
                            <h2>{blocks.block.importance}</h2>
                        </div>
                    })}
                </div> */}
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
                        <select name='importance' defaultValue={'default'} onChange={(event) => handleChange(event)}>
                            <option value={'default'} disabled>Select Priority</option>
                            <option value='Critical'>Critical</option>
                            <option value='Recommended'>Recommended</option>
                            <option value='Optional'>Critical</option>
                        </select>
                    </label>
                    <br/> 
                    <button>Add Block</button>
                </form>
                {errorMessage && <h2>{errorMessage}</h2>}
                <button onClick={() => setShowForm(false)}>Close</button>
            </div>
        </>

    )
}

export default CreateBlock;