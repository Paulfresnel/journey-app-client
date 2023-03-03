import { useState } from "react"
import axios from "axios"
import './CreateBlock.css'
import './CreateBlock.css'

const API_ROUTE = process.env.REACT_APP_SERVER_URL
function CreateBlock(props) {

    const {journeyId, setUserJourney, setShowForm} = props

    const [block, setBlock] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setBlock({...block, [name] : value});
    }

   
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${API_ROUTE}/api/${journeyId}/blocks`, block)

            .then((apiResponse) => {
                let updatedJourney = apiResponse.data
                
                setUserJourney(updatedJourney)
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
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className='form-floating mb-3'>
                        <input className='form-control' type='text' name='title' placeholder='title' onChange={(event) => handleChange(event)}/>
                        <label> Title:</label> 
                    </div>
                    <div className='form-floating mb-3'>
                        <textarea className='form-control' type='text' name='description' placeholder='description' style={{height: '100px'}} onChange={(event) => handleChange(event)}/>
                    <label>Description:</label>
                    </div>
                    <div className='form-floating mb-3'>
                        <input className='form-control' type='text' name='category' placeholder='category' onChange={(event) => handleChange(event)}/>
                        <label>Category:</label>
                    </div>
                    <div className='form-floating mb-3'>
                        <select className='form-control' name='importance' placeholder='priority' defaultValue={'default'} onChange={(event) => handleChange(event)}>
                            <option value={'default'} disabled>Select Priority</option>
                            <option value='Critical'>Critical</option>
                            <option value='Recommended'>Recommended</option>
                            <option value='Optional'>Critical</option>
                        </select>
                        <label>Importance Level:</label>
                    </div>
                    <br/> 
                    <button className='btn btn-success create-journey'>Add Block</button>
                </form>
                {errorMessage && <h2>{errorMessage}</h2>}
                <button className='btn btn-link' onClick={() => setShowForm(false)}>Close</button>
            </div>
        </>

    )
}

export default CreateBlock;