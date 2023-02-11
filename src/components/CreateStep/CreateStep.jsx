import { useState } from "react"
import axios from "axios"
import './CreateStep.css'
import { Link, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

function CreateStep(props){

    const {blockId} = useParams()
    console.log(blockId)
    const navigate= useNavigate()
    const [imageUrl,setImageUrl] = useState('')

    const [linkFields, setLinkFields] = useState([
        {name:"", link:""}
    ])

    const {step, setStep, block, setBlock} = props

    const [notesFields, setNotesFields] = useState([
        ""
    ])
    const [linkMessage, setLinkMessage] = useState('')
    const [noteMessage, setNoteMessage] = useState('')
    const [formMessage, setFormMessage] = useState('')

    const handleFieldsChange = (index, event)=>{
        event.preventDefault()
        setFormMessage('')
        if (event.target.parentNode.className === "parent"){
           let data = [...linkFields]
        data[index][event.target.name] = event.target.value
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
            setNoteMessage('')
            let newField = ""
            setNotesFields([...notesFields, newField])
        }
        else if (e.target.name === "addLink"){
            setLinkMessage('')
            let newField = {name:"", link:""}
            setLinkFields([...linkFields, newField])
        }
        
    }

    const removeFields = (index, event)=>{
        if (event.target.name === "removeNote"){
            let data = [...notesFields]
            if (data.length<=1){
                setNoteMessage("You need to write at least 1 note for your step")
             }
             else {
        data.splice(index, 1)
        setNotesFields(data)
        }
    }
        else if (event.target.name === "removeLink"){
            let data = [...linkFields]
            if (data.length<=1){
                setLinkMessage("You need to have at least 1 Link resource attached to your step!")
             }
             else {
            data.splice(index, 1)
            setLinkFields(data)
        }     
    }
}

    const uploadImage = (file) => {
        return axios.post("http://localhost:5005/api/upload", file)
          .then(res => {
            console.log("file url from cloudinary")
            console.log(res.data)
            setImageUrl(res.data.imageUrl)
            setStep({...step, image: imageUrl})
            console.log(step)
        })
          .catch(err=>console.log(err));
      }

    const handleFileUpload= (e)=>{
        const uploadData = new FormData();
 

    uploadData.append("imageUrl", e.target.files[0]);
    uploadImage(uploadData)
        .then(response=>{
            console.log(response)
        })
        .catch(err=>console.log(err))
    }

    const formHandleSubmit = async (e)=>{
        e.preventDefault()
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/${blockId}/steps`, step)
            .then(async (response)=>{
                await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/blocks/${blockId}`)   
                    .then((blockUpdated)=>{
                        setBlock(blockUpdated.data.block)
                        setFormMessage(response.data.message)
                    })
                
                
            })
    }

    const handleChange = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setStep({...step, [name]: value})
        setFormMessage('')
    }

    
    return(
        <div className="flex-step">
            
            <div>
                <h1>Add a new Step</h1>
                <form>
                    <div>
                        <label>Title:</label>
                        <input required onChange={(e)=>handleChange(e)}  type='text' name="title" value={step.title}></input>
                    </div>
                    <div>
                        <label>Description:</label>
                        <input required onChange={(e)=>handleChange(e)} type='text-area' name="description" value={step.description}></input>
                    </div>
                    <div>
                        <label>Difficulty:</label>
                        <select required onChange={(e)=>handleChange(e)} name="difficulty" value={step.difficulty}>
                        <option disabled selected>-- Choose Difficulty of the Step --</option>
                            <option default>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div>
                        <label>Importance:</label>
                        <select required onChange={(e)=>handleChange(e)} name="importance" value={step.importance}>
                        <option disabled selected>-- Choose Degree of importance --</option>
                            <option>Critical</option>
                            <option>Recommended</option>
                            <option>Optional</option>
                        </select>
                    </div>
                    <div>
                        <label>Image:</label>
                        <input required onChange={(e)=>handleChange(e)} type='text' name="image" value={step.image}></input>
                        <input  type="file" onChange={(e) => handleFileUpload(e)} />
                    </div>
                    <div>
                    <h3>Add Link Resources</h3>
                    {linkMessage && <p style={{color:"red"}}>{linkMessage}</p>}
                    {linkFields.map((input, index) => {
          return (
            <div key={index} className="parent"> 
              <input required
                name='name'
                placeholder='name your link resource'
                value={input.name}
                onChange={(event) => handleFieldsChange(index, event)}
              />
              <input required
                name='link'
                placeholder='link https:// ressource here'
                value={input.link}
                onChange={(event) => handleFieldsChange(index, event)}
              />
              <button name="removeLink" onClick={(event) => removeFields(index,event)}>Remove Link</button>
            </div>
          )
        })}
        <button name="addLink" onClick={(e)=>addFields(e)}>Add another Link</button>
        </div>


        <div>
            <h3>Add Notes</h3>
            {noteMessage && <p style={{color:"red"}}>{noteMessage}</p>}
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




        {formMessage.includes("fill") ? <p style={{color:"red"}}>{formMessage}</p> : <p style={{color:"green"}}>{formMessage}</p>}
        <button onClick={(e)=>formHandleSubmit(e)}>Create Step</button>
                </form>
            </div>
        </div>
    )
}

export default CreateStep