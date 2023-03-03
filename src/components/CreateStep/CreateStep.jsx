import { useEffect, useState } from "react"
import axios from "axios"
import './CreateStep.css'
import ReactDOM  from "react-dom"
import { useNavigate } from "react-router-dom"

const API_ROUTE = process.env.REACT_APP_SERVER_URL

function CreateStep(props){

    const { blockId, journeyId, setAddStep } = props;
    const navigate = useNavigate();
    
    const [imageUrl,setImageUrl] = useState('');
    const [linkFields, setLinkFields] = useState([{name:"", link:""}]);
    const [block, setBlock]= useState({title:"", description:"", category:"", importance:"",steps:[{}]});
    const [step, setStep] = useState({title:"", description: "", category:"", difficulty:"", importance:"", image:"", links:[{name:"", link:""}], notes:[""]});
    const [notesFields, setNotesFields] = useState([""]);
    const [linkMessage, setLinkMessage] = useState('');
    const [noteMessage, setNoteMessage] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const handleFieldsChange = (index, event)=>{
        event.preventDefault()
        setFormMessage('')
        if(event.target.parentNode.id === 'parent-resource-name' || event.target.parentNode.id === 'parent-resource-link'){
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
        return axios.post(`${API_ROUTE}/api/upload`, file)
          .then(res => {
            setImageUrl(res.data.imageUrl)
            setStep({...step, image: res.data.imageUrl})
        })
          .catch(err=>setErrorMessage(err.res.data.message));
      }

    const handleFileUpload= (e)=>{
        const uploadData = new FormData();
 
        
        uploadData.append("imageUrl", e.target.files[0]);
            uploadImage(uploadData)
                .then(response=>{
                })
                .catch(err=>setErrorMessage(err.res.data.message))
    }


    const formHandleSubmit = (e)=>{
        e.preventDefault();
        if(step.title && step.description && step.links && step.difficulty && step.importance){
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/${blockId}/steps`, step)
            .then((response) => {
                      navigate(`/profile/journeys/${journeyId}`)
                      setAddStep(false)
                    })
        } else {
            setErrorMessage('Please add a title, description and at least one resource link to this step.')
        }
    }

    const handleChange = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setStep({...step, [name]: value})
        setFormMessage('')
    }


    useEffect(()=>{
        axios.get(`${API_ROUTE}/api/blocks/${blockId}`)
            .then(response=>{
                const {block} = response.data
                setBlock(block)
                setIsLoading(false)
            })
    },[])

    
    return ReactDOM.createPortal(
        <>
            <div className="overlay-style"/>
            <div className="modal-style">
                <div style={{marginTop: '20px'}}>
                    <h1>Add a new Step</h1>
                    <form style={{paddingTop: '20px'}}>
                        <div className='form-floating mb-3'>
                            <input className='form-control' required placeholder='title' onChange={(e)=>handleChange(e)}  type='text' name="title" value={step.title}></input>
                            <label>Title:</label>
                        </div>
                        <div className='form-floating mb-3'>
                            <textarea className='form-control' required  placeholder='description' name="description" value={step.description} style={{height:'100px'}} onChange={(e)=>handleChange(e)}  />
                            <label>Description:</label>
                        </div>
                        <div className='form-floating mb-3'>
                            <select className='form-control' name='difficulty' defaultValue='default' placeholder='difficulty' required onChange={(e)=>handleChange(e)} >
                                <option value='default' disabled>-- Choose Difficulty of the Step --</option>
                                <option value='High'>High</option>
                                <option value='Medium'>Medium</option>
                                <option value='Low'>Low</option>
                            </select>
                            <label>Difficulty:</label>
                        </div>
                        <div className='form-floating mb-3'>
                            <select className='form-control' name="importance" defaultValue='default' placeholder='importance' required onChange={(e)=>handleChange(e)} >
                            <option value='default' disabled>-- Choose Degree of importance --</option>
                                <option>Critical</option>
                                <option>Recommended</option>
                                <option>Optional</option>
                            </select>
                            <label>Importance:</label>
                        </div>
                        <div className='form-floating mb-3'>
                            <input className='form-control' type="file" placeholder='image' onChange={(e) => handleFileUpload(e)} />
                                {step.image && <img width={75} src={step.image} style={{paddingTop:'10px', margin: '0 auto'}} alt='step'/>}
                            <label>Add a Photo:</label>
                        </div>
                        <div>
                        <h3>Add Link Resources</h3>
                        {linkMessage && <p style={{color:"red"}}>{linkMessage}</p>}
                        {linkFields.map((input, index) => {
                            return ( 
                            <div key={index}>  
                                <div id='parent-resource-name' className='form-floating mb-3'> 
                                    <input required
                                        className='form-control'
                                        name='name'
                                        placeholder='name your link resource'
                                        defaultValue={input.name}
                                        onChange={(event) => handleFieldsChange(index, event)}
                                    />
                                    <label>Resource Name: </label>
                                </div>
                                <div id='parent-resource-link' className='form-floating mb-3'>
                                    <input required
                                        className='form-control'
                                        name='link'
                                        placeholder='link https:// ressource here'
                                        onChange={(event) => handleFieldsChange(index, event)}
                                    />
                                    <label>Has to include http://</label>
                                    <button className="btn btn-secondary btn-sm active" name="removeLink" style={{marginTop:'20px'}} onClick={(event) => removeFields(index,event)}>Remove Link</button>
                                </div>
                            </div>
                            )
                            })}
                        <button className="btn btn-primary btn-sm active" name="addLink" onClick={(e)=>addFields(e)}>Add another Link</button>
                        </div>


                        <div style={{marginTop: '20px'}}>
                            <h3>Add Notes</h3>
                            {noteMessage && <p style={{color:"red"}}>{noteMessage}</p>}
                            {notesFields.map((input, index) => {
                            return (
                                <div key={index}>
                                    <div className='form-floating mb-3'>
                                        <textarea required
                                            className='form-control'
                                            name='note'
                                            placeholder='write your note..'
                                            value={input.name}
                                            style={{height: '100px', marginTop: '20px'}}
                                            onChange={(event) => handleFieldsChange(index, event)}
                                        />
                                        <label>Note:</label>
                                    </div>
                                    <button className="btn btn-secondary btn-sm active" name="removeNote" onClick={(event) => removeFields(index,event)}>Remove Note</button>
                                </div>
                                )
                            })}
                            <br/>
                        
                        <button className="btn btn-primary btn-sm active" name="addNote" style={{marginTop: '20px'}} onClick={(e)=>addFields(e)}>Add another Note</button>
                        {errorMessage && <p className='error-message' style={{marginTop: '20px', textAlign: 'center'}}>{errorMessage}</p>}
                        </div>
                        {formMessage.includes("fill") ? <p style={{color:"red"}}>{formMessage}</p> : <p style={{color:"green"}}>{formMessage}</p>}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button className='btn btn-success create-journey' onClick={(e)=>formHandleSubmit(e)}>Create Step</button>
                        </div>
                    </form>
                </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button className='btn btn-link' onClick={() => setAddStep(false)}>Close</button>
                </div>
            </div>
        </>,
        document.getElementById('portal')  
    ) 
   
}

export default CreateStep