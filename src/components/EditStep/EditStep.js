import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./EditStep.css"
const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function EditStep(){
    
    const navigate = useNavigate();
    const {blockId, stepId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [step, setStep] = useState({title:"", description: "", category:"", difficulty:"", importance:"", image:"", links:[{name:"", link:""}], notes:[""]});
    const [linkMessage, setLinkMessage] = useState('');
    const [noteMessage, setNoteMessage] = useState('');
    const [fieldToEdit, setFieldToEdit] = useState('');
    const [linkFields, setLinkFields] = useState([{name:"", link:""}]);
    const [notesFields, setNotesFields] = useState([""]);
    const [updatedStep, setUpdatedStep] = useState(null);
    const [journeyId, setJourneyId] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const isFirstRender = useRef(true);
    const hiddenFileInput  = useRef(null);

    const handleFieldsChange = (index, event)=>{
        event.preventDefault()
        if (event.target.parentNode.id === 'parent-resource-name' || event.target.parentNode.id === 'parent-resource-link'){
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
    
    const submitResources = () => {
            axios.put(`${API_ROUTE}/api/steps/${step._id}`, {links : linkFields})
                .then(response => setUpdatedStep(response.data))
            setFieldToEdit('')
           
    }
   
    const submitNotes = () => {
        axios.put(`${API_ROUTE}/api/steps/${step._id}`, {notes : notesFields})
            .then(response => setUpdatedStep(response.data))
        setFieldToEdit('')
       
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
    
    const handleImageUpload = () => {
        hiddenFileInput.current.click();
    }

    const handleImageChange = async (event) => {
        let newImageUrl = '';
        const uploadData = new FormData();
        uploadData.append("imageUrl", event.target.files[0]);
        const updatedUrl = await axios.post(`${API_ROUTE}/api/upload`, uploadData)
            .then(response => newImageUrl = response.data.imageUrl)
            .catch(error => setErrorMessage(error.response.data.message));

        axios.put(`${API_ROUTE}/api/steps/${step._id}`, {image: newImageUrl}, {new: true})
            .then((response) => setUpdatedStep(response.data))
            .catch(error => setErrorMessage(error.response.data.message));

    }

    

    // const uploadImage = (file) => {
    //     return axios.post("http://localhost:5005/api/upload", file)
    //       .then(res => {
    //         console.log("file url from cloudinary")
    //         console.log(res.data)
    //         setImageUrl(res.data.imageUrl)
    //         setStep({...step, image: res.data.imageUrl})
    //     })
    //       .catch(err=>console.log(err));
    //   }

    // const handleFileUpload= (e)=>{
    //     const uploadData = new FormData();
 

    // uploadData.append("imageUrl", e.target.files[0]);
    // uploadImage(uploadData)
    //     .then(response=>{
    //         console.log("file url is returning...:")
    //         console.log(response)
    //     })
    //     .catch(err=>console.log(err))
    // }

    const deleteStep = () => {
        console.log('delete step is working')
        axios.delete(`${API_ROUTE}/api/steps/${blockId}/${stepId}`)
            .then(() => navigate(`/profile/journeys/${journeyId}`))
            .catch(err => setErrorMessage(err.response.data.message));
    };

    useEffect(() => {
        axios.get(`${API_ROUTE}/api/${blockId}`)
            .then(response => setJourneyId(response.data._id))
    }, []);

    useEffect(() => {
       axios.get(`${API_ROUTE}/api/steps/${stepId}`)
            .then(response=>{
                const data = response.data;
                setLinkFields(data.links)
                setNotesFields(data.notes)
                setStep(data)
                setImageUrl(data.image)
                setTimeout(()=>{
                setIsLoading(false)
                setIsCompleted(response.data.isCompleted)
                },500) 
            })
    }, [updatedStep]); 
    
    
    useEffect(() => {
        if(isFirstRender.current){
            isFirstRender.current = false;
            return;
        }
            axios.put(`${API_ROUTE}/api/steps/${step._id}`, {isCompleted : isCompleted})
                    .then(response => setUpdatedStep(response.data));
    }, [isCompleted])

   
    return(
        <div className='main-container-step'>
            {isLoading ? 
                <>  
                    <div style={{marginTop: '150px'}} className='text-center'>
                        <div className="spinner-border spinner-border-lg">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                    <p>Loading...</p>
                </>
 : 

            <div>
            <div className="">
            <button onClick={()=>navigate(-1)} className="btn btn-primary margin-top space-r">Go Back</button>
            <i className="bi bi-info-circle-fill log-info"></i>
                <ul className="hide padding">
                        <li>To <span className="bold">edit your Step's information</span>, simply <span className="bold"><span className="underlined">click</span> on any of the Textual fields</span> to make an editable input appear</li>
                </ul>
                </div>
                <div className="div-block"/>                
                        { fieldToEdit === 'journey-step-title' ? 
                        <div>
                            <label>Title:</label>                       
                            <input type='text' name='title' defaultValue={step.title} autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(e)=>handleBlur(e)}></input>
                        </div>
                        : <h1 id= 'journey-step-title' onClick={() => setFieldToEdit('journey-step-title')}>{step.title}</h1>
                        }

                        <div className="flex-c">
                            <img  src={step.image} style={{margin:"0 auto", width:'40%', height: 'auto'}} alt={step.description}  />
                            <label for='update-step-image' style={{marginTop:'25px',marginBottom:"25px"}}>
                                <button className="btn btn-outline-light update-img" onClick={handleImageUpload}>Update Image</button>
                                <input id = 'update-step-image' type='file' name="image" ref={hiddenFileInput} onChange={(event) => handleImageChange(event)} style={{display: 'none'}}></input>
                            </label>
                        </div>  

                        <label  className="title-step">Description: </label>
                        { fieldToEdit === 'journey-step-description' ? 
                           <input type='text-area' name= 'description' defaultValue={step.description} autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(e)=>handleBlur(e)}></input>
                         : <h2 className='step-content' id='journey-step-description' onClick={() => setFieldToEdit('journey-step-description')}>{step.description}</h2>
                        }
                        <br/>
                        <label  className="title-step">Difficulty:</label>
                        { fieldToEdit === 'journey-step-difficulty' ?
                        <>
                            <select name="difficulty" defaultValue={step.difficulty} autoFocus onFocus={(event) => event.currentTarget.select()} onChange={(e)=>handleBlur(e)} onBlur={(e)=>handleBlur(e)}>
                            <option disabled selected defaultValue>-- Choose Difficulty of the Step --</option>
                                <option default>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </> 
                        : <h2 className='step-content' id='journey-step-difficulty' onClick={() => setFieldToEdit('journey-step-difficulty')}>{step.difficulty}</h2> 
                        }
                        <br/>
                        <label  className="title-step">Importance:</label>
                        { fieldToEdit === 'journey-step-importance' ?
                        <>
                            <select name="importance" defaultValue={step.importance} autoFocus onFocus={(event) => event.currentTarget.select()} onChange={(e)=>handleBlur(e)} onBlur={(e)=>handleBlur(e)}>
                            <option disabled selected>-- Choose Degree of importance --</option>
                                <option>Critical</option>
                                <option>Recommended</option>
                                <option>Optional - Bonus Knowledge</option>
                            </select>
                        </>
                        : <h2 className='step-content' id='journey-step-importance' onClick={() => setFieldToEdit('journey-step-importance')}>{step.importance}</h2> 
                        }
                        <br/>   
                    <div className="margined">
                        <h5 className="title-step">Current Resources</h5>
                        { fieldToEdit === 'journey-step-resources' ?
                        <>
                            {linkMessage && <p style={{color:"red"}}>{linkMessage}</p>}
                            {linkFields.map((input, index) => {
                                return (
                                    <div key={index} className="flex-column edit-resources">
                                        <div id='parent-resource-name' className="form-floating mb-3">
                                            <input required
                                                className='form-control'
                                                name='name'
                                                placeholder='name your link resource'
                                                defaultValue={input.name}
                                                onChange={(event) => handleFieldsChange(index, event)}/>
                                            <label>Resource Name: </label>
                                        </div>
                                        <div id='parent-resource-link' className='form-floating mb-3'>
                                                <input required 
                                                    className='form-control'
                                                    name='link'
                                                    placeholder='https:// resource here'
                                                    defaultValue={input.link}
                                                    onChange={(event) => handleFieldsChange(index, event)}
                                                />
                                            <label>http:// </label>
                                        </div>
                                    <button className="btn btn-outline-danger margined-delete" name="removeLink" onClick={(event) => removeFields(index,event)}>Remove Link</button>
                                </div>
                                
                                )
                            })}
                            <button name="addLink" className="btn btn-outline-light update-img" style={{marginRight: '7px'}} onClick={(e)=>addFields(e)}>Add another Link</button>
                            <button className="btn btn-outline-light update-img" onClick={(event) => submitResources(event)}>Update Resources</button>
                        </>
                        : 
                        <div>
                            {step.links && step.links.map(link => {
                                return(<Link to={`http://${link.link}`} target='blank'><h3>{link.name}</h3></Link>)
                                })
                            }
                            <br/>
                            <button className="btn btn-outline-info colored" onClick={() => setFieldToEdit('journey-step-resources')}>Edit Resources</button>
                        </div>
                        }
                    </div>
                    <br/>
            <h5 className='title-step'>Notes:</h5>
            { fieldToEdit === 'journey-step-notes' ?
               <div className='edit-resources'>
                {noteMessage && <p style={{color:"red"}}>{noteMessage}</p>}
                {notesFields.map((input, index) => {
                    return (
                        <div key={index} className='form-floating mb-3'>
                        <textarea className='form-control' required
                            rows="2" 
                            name='notes'
                            placeholder='write your note..'
                            value={input}
                            onChange={(event) => handleFieldsChange(index, event)}
                        />
                        <label>Note</label>
                        <button className="btn btn-outline-danger" name="removeNote" style={{marginTop: '10px'}} onClick={(event) => removeFields(index,event)}>Remove Note</button>
                        </div>
                        )
                    })}
                    <button className="btn btn-outline-light update-img" name="addNote" style={{marginRight:'7px'}} onClick={(e)=>addFields(e)}>Add another Note</button>
                    <button className="btn btn-outline-light update-img" name="addNote" onClick={()=>submitNotes()}>Update Notes</button>
                </div>
              :
                <div div className='edit-resources'>
                    {
                        step.notes && step.notes.map(note => {
                            return <p className='step-content'>{note}</p>
                        })
                    }
                    <button className="btn btn-outline-info colored" onClick={() => setFieldToEdit('journey-step-notes')}>Edit Notes</button>
                </div>
            }
            
            <br/>
            
            {step.isCompleted ?
                <>  <br/>
                    <p className="completed">Step Completed!</p>
                    <br/>
                   <p className='step-content'><b>Not really...</b><span><button className="btn btn-warning margin-l" onClick={() => setIsCompleted(false)}>Uncheck</button></span></p> 
                </>
                
              : <>
              <br/>
                    <label className='title-step is-completed'>Mark As Completed
                        <input type='checkbox' style={{marginLeft: '15px'}} onChange={(event) => setIsCompleted(event.target.checked)}/>
                    </label>
                </>
            }
            

            <br/>
            <div className="margin-t">
            <button className="btn btn-outline-danger margin-b" type='button' onClick={deleteStep}>Delete Step</button>
            </div>


        {/* </form> */}

                    </div>
                }
        </div>
    )
}

export default EditStep
