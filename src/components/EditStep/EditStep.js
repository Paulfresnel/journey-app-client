import { useEffect, useState} from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./EditStep.css"
const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function EditStep(){
    
    const navigate = useNavigate();
    const {stepId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState("");
    const [step, setStep] = useState({title:"", description: "", category:"", difficulty:"", importance:"", image:"", links:[{name:"", link:""}], notes:[""]});
    const [linkMessage, setLinkMessage] = useState('');
    const [noteMessage, setNoteMessage] = useState('');
    const [ fieldToEdit, setFieldToEdit ] = useState('');
    const [linkFields, setLinkFields] = useState([{name:"", link:""}]);
    const [notesFields, setNotesFields] = useState([""]);
    const [updatedStep, setUpdatedStep] = useState(null);

    const handleFieldsChange = (index, event)=>{
        event.preventDefault()
        if (event.target.parentNode.parentNode.className === "parent flex-row"){
           let data = [...linkFields]
        data[index][event.target.name] = event.target.value
        setStep({...step, links: data})
        setLinkFields(data) 
        } 
        else if (event.target.name === "notes"){
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
            let newField = {name:"", link:""}
            setLinkFields([...linkFields, newField])
        }
        
    }

    const removeFields = (index, event)=>{
        event.preventDefault()
     console.log(index)
        if (event.target.name === "removeNote" ){
            
        let data = [...notesFields]
        if (data.length<=1){
            setNoteMessage("You can not erase all the notes, please add another one before deleting this one")
         }
         else {
        data.splice(index, 1)
        setNotesFields(data)
        setStep({...step, notes: data})
         }
    }
        
        else if (event.target.name === "removeLink"){
            console.log(event)
            let data = [...linkFields]
            console.log(data.length)
            if (data.length<=1){
                setLinkMessage("You can not erase all the links, please add another one before deleting this one")
             }
             else {
            data.splice(index, 1)
            setLinkFields(data)
            setStep({...step, links: data})
        }
         
     }  
    }

    // const handleChange = (e)=>{
    //     const name = e.target.name;
    //     const value = e.target.value;
    //     setStep({...step, [name]: value})
    // }

    const handleBlur = (event) => {
        const name = event.target.name
        if(event.target.value && event.target.value !== step.name){
            axios.put(`${API_ROUTE}/api/steps/${step._id}`, {[name] : event.target.value})
                .then(response => setUpdatedStep(response.data))
            setFieldToEdit('')
            } else setFieldToEdit('');
        }


    // const handleFormSubmit =(e)=>{
    //     e.preventDefault()
    //     console.log("info sent:")
    //     console.log(step)
    //     axios.put(`${process.env.REACT_APP_SERVER_URL}/api/steps/${stepId}`, {step})
    //         .then(response=>{
    //             const data = response.data.step
    //             console.log(data)
    //             setStep(data)
    //             navigate(-1)
    //         })
    // }

    const uploadImage = (file) => {
        return axios.post("http://localhost:5005/api/upload", file)
          .then(res => {
            console.log("file url from cloudinary")
            console.log(res.data)
            setImageUrl(res.data.imageUrl)
            setStep({...step, image: res.data.imageUrl})
        })
          .catch(err=>console.log(err));
      }

    const handleFileUpload= (e)=>{
        const uploadData = new FormData();
 

    uploadData.append("imageUrl", e.target.files[0]);
    uploadImage(uploadData)
        .then(response=>{
            console.log("file url is returning...:")
            console.log(response)
        })
        .catch(err=>console.log(err))
    }

    
    useEffect( ()=>{
       axios.get(`${API_ROUTE}/api/steps/${stepId}`)
            .then(response=>{
                console.log("response")
                const data = response.data
                setLinkFields(data.links)
                setNotesFields(data.notes)
                setStep(data)
                setImageUrl(data.image)
                setIsLoading(false)
            })
    }, [updatedStep])

   
    return(
        <div>
            {isLoading ? <p>Data is Loading..</p> : 

            <div>
            
            {/* <form onSubmit={(e)=>handleFormSubmit(e)}> */}
                    
                        { fieldToEdit === 'journey-step-title' ? 
                        <div>
                            <label>Title:</label>                       
                            <input type='text' name='title' defaultValue={step.title} autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(e)=>handleBlur(e)}></input>
                        </div>
                        : <h1 id= 'journey-step-title' onClick={() => setFieldToEdit('journey-step-title')}>{step.title}</h1>
                        }
                    
                        <label>Description: </label>
                        { fieldToEdit === 'journey-step-description' ? 
                           <input type='text-area' name= 'description' defaultValue={step.description} autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(e)=>handleBlur(e)}></input>
                         : <h2 id='journey-step-description' onClick={() => setFieldToEdit('journey-step-description')}>{step.description}</h2>
                        }
                    
                
                   
                        <label>Difficulty:</label>
                        { fieldToEdit === 'journey-step-difficulty' ?
                        <>
                            <select name="difficulty" defaultValue={step.difficulty} autoFocus onFocus={(event) => event.currentTarget.select()} onChange={(e)=>handleBlur(e)} onBlur={(e)=>handleBlur(e)}>
                            <option disabled selected defaultValue>-- Choose Difficulty of the Step --</option>
                                <option default>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </> 
                        : <h2 id='journey-step-difficulty' onClick={() => setFieldToEdit('journey-step-difficulty')}>{step.difficulty}</h2> 
                        }
               
                    <div>
                        <label>Importance:</label>
                        <select  name="importance" value={step.importance}>
                        <option disabled selected>-- Choose Degree of importance --</option>
                            <option>Critical</option>
                            <option>Recommended</option>
                            <option>Optional - Bonus Knowledge</option>
                        </select>
                    </div>
                    <div className="flex-c">
                        <img style={{margin:"0 auto",width:'12rem'}} alt={step.description} className="step-image"  src={step.image}/>
                        <label style={{marginTop:'25px',marginBottom:"25px"}}>Update Image by URL:</label>
                        <input  type='text' name="image" value={step.image}></input>
                        <input  type="file" onChange={(e) => handleFileUpload(e)} />
                    </div>  

                    <div>
                    <h3>Edit your Link Resources</h3>
                    {linkMessage && <p style={{color:"red"}}>{linkMessage}</p>}
                    {linkFields.map((input, index) => {
          return (
            <div key={index} className="parent flex-row">
            <div className="flex-column">
            <label>Change the Name:</label>
              <input required
                name='name'
                placeholder='name your link resource'
                value={input.name}
                onChange={(event) => handleFieldsChange(index, event)}
              />
              </div>
              <div className="flex-column">
            <label>Change the Link:</label>
              <input required
                name='link'
                placeholder='link https:// ressource here'
                value={input.link}
                onChange={(event) => handleFieldsChange(index, event)}
              />
              </div>
              <button className="remove" name="removeLink" onClick={(event) => removeFields(index,event)}>Remove Link</button>
            </div>
          )
        })}
        <button name="addLink" onClick={(e)=>addFields(e)}>Add another Link</button>
        </div>

        <div>
            <h3>Edit your Notes</h3>
            {noteMessage && <p style={{color:"red"}}>{noteMessage}</p>}
            {notesFields.map((input, index) => {
          return (
            <div key={index} className="flex-r">
              <textarea className="large" required
                rows="2" cols="35"
                name='notes'
                placeholder='write your note..'
                value={input}
                onChange={(event) => handleFieldsChange(index, event)}
              />
              <button className="remove" name="removeNote" onClick={(event) => removeFields(index,event)}>Remove Note</button>
            </div>
          )
        })}
        <button name="addNote" onClick={(e)=>addFields(e)}>Add another Note</button>
        </div>






                    <button type="submit">Submit Form</button>
        {/* </form> */}

                    </div>
                }
        </div>
    )
}

export default EditStep
