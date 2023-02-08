import { useState } from "react"
import axios from "axios"
import './CreateStep.css'
import { Link } from "react-router-dom"

function CreateStep(){


    const [linkFields, setLinkFields] = useState([
        ""
    ])
    const [step, setStep] = useState({title:"", description: "", category:"", difficulty:"", importance:"", image:"", links:[""], notes:[""]})


    const [notesFields, setNotesFields] = useState([
        ""
    ])

    const handleFieldsChange = (index, event)=>{
        event.preventDefault()
        
        if (event.target.name === "link"){
           let data = [...linkFields]
        data[index] = event.target.value
        setStep({...step, links: data})
        setLinkFields(data) 
        } 
        else if (event.target.name === "note"){
            let data = [...notesFields]
        data[index] = event.target.value
        setStep({...step, notes: data})
        setNotesFields(data) 
        }
        
    }   

    const addFields = (e) =>{
        e.preventDefault()
        if (e.target.name === "addNote"){
            let newField = ""
            setNotesFields([...notesFields, newField])
        }
        else if (e.target.name === "addLink"){
            let newField = ""
            setLinkFields([...linkFields, newField])
        }
        
    }

    const removeFields = (index, event)=>{
        if (event.target.name === "removeNote"){
            let data = [...notesFields]
        data.splice(index, 1)
        setNotesFields(data)
        }
        else if (event.target.name === "removeLink"){
            let data = [...linkFields]
            data.splice(index, 1)
            setLinkFields(data)
        }     
    }

    const formHandleSubmit = (e)=>{
        e.preventDefault()
        console.log(step)
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/steps`, step)
            .then(response=>{
                console.log("response")
                console.log(response.data.step)
            })
    }

    const handleChange = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setStep({...step, [name]: value})
    }

    return(
        <div className="flex-step">
            <div>
                <h1>Block's Edition Page</h1>
                <h2>Step's Creation Page</h2>
            </div>
            <div>
                <h3>Current Steps in the Learning Block:</h3>
                <table className="steps-table">
                    <thead>
                        <tr>
                            <td>Step #</td>
                            <td>Title</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Leaning javascript</td>
                            <td>
                            <Link to={"/edit-step/63e403947b21639c6d7398eb"}>
                                <button>More Info</button>
                                </Link>
                            </td>
                            <td>
                                <button>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h1>Add a new Step</h1>
                <form>
                    <div>
                        <label>Title:</label>
                        <input onChange={(e)=>handleChange(e)}  type='text' name="title" value={step.title}></input>
                    </div>
                    <div>
                        <label>Description:</label>
                        <input onChange={(e)=>handleChange(e)} type='text-area' name="description" value={step.description}></input>
                    </div>
                    <div>
                        <label>Category:</label>
                        <input onChange={(e)=>handleChange(e)} type='text' name="category" value={step.category}></input>
                    </div>
                    <div>
                        <label>Difficulty:</label>
                        <select onChange={(e)=>handleChange(e)} name="difficulty" value={step.difficulty}>
                        <option disabled defaultValue>-- Choose Difficulty of the Step --</option>
                            <option default>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div>
                        <label>Importance:</label>
                        <select onChange={(e)=>handleChange(e)} name="importance" value={step.importance}>
                        <option disabled>-- Choose Degree of importance --</option>
                            <option>Critical</option>
                            <option>Recommended</option>
                            <option>Optional - Bonus Knowledge</option>
                        </select>
                    </div>
                    <div>
                        <label>Image:</label>
                        <input onChange={(e)=>handleChange(e)} type='text' name="image" value={step.image}></input>
                    </div>
                    <div>
                    <h3>Add Link Resources</h3>
                    {linkFields.map((input, index) => {
          return (
            <div key={index}>
              <input required
                name='link'
                placeholder='link resource'
                value={input.name}
                onChange={(event) => handleFieldsChange(index, event)}
              />
              <button name="removeLink" onClick={(event) => removeFields(index,event)}>Remove Link</button>
            </div>
          )
        })}
        <button name="addLink" onClick={(e)=>addFields(e)}>Add another Link</button>
        </div>


        <div>
            <h3>Add Link Resources</h3>
            {notesFields.map((input, index) => {
          return (
            <div key={index}>
              <input required
                name='note'
                placeholder='write your note..'
                value={input.name}
                onChange={(event) => handleFieldsChange(index, event)}
              />
              <button name="removeNote" onClick={(event) => removeFields(index,event)}>Remove Note</button>
            </div>
          )
        })}
        <button name="addNote" onClick={(e)=>addFields(e)}>Add another Note</button>
        </div>




        
        <button onClick={(e)=>formHandleSubmit(e)}>Create Step</button>
                </form>
            </div>
        </div>
    )
}

export default CreateStep