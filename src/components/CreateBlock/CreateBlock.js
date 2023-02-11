import { useState } from "react"
import axios from "axios"
import './CreateBlock.css'
import { Link } from "react-router-dom"
const API_ROUTE = process.env.REACT_APP_SERVER_URL
const testArray = [];

function CreateBlock() {

   

    const [block, setBlock] = useState('');
    const [blocksInJourney, setBlocksInJourney] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    console.log(blocksInJourney)

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setBlock({...block, [name] : value});
    }

   

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${API_ROUTE}/api/23408393/blocks`, block)
            .then(createdBlock => {
                testArray.push({block: createdBlock.data});
                setBlocksInJourney(testArray);

             })
            .catch(err => {
                setErrorMessage(err.response.data.message)
            })
    }

    return(
        <div>
            <div>
                {blocksInJourney && blocksInJourney.map(blocks => {
                   return <div>
                        <h1>{blocks.block.name}</h1>
                        <h2>{blocks.block.description}</h2>
                        <h2>{blocks.block.category}</h2>
                        <h2>{blocks.block.importance}</h2>
                    </div>
                })}
            </div>
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
        </div>

    )
}

export default CreateBlock;