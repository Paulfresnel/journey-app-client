import axios from "axios";
import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from "react-router-dom";
import CreateBlock from "../../components/CreateBlock/CreateBlock";
import EditTags from "../../components/EditTags/EditTags";
import CreateStep from "../../components/CreateStep/CreateStep";
import UserProgress from "../../components/ProgressBar/ProgressBar";
import './UserJourneyPage.css'

const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function UserJourneyPage() {

    const [ userJourney, setUserJourney ] = useState({});
    const [ journeyBlocks, setJourneyBlocks ] = useState([]);
    const [journeyTags, setJourneyTags] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showForm, setShowForm ] = useState(false);
    const [ updatedJourney, setUpdatedJourney ] = useState({});
    const [ blockToDisplay, setBlockToDisplay ] = useState('');
    const [blockCompleted, setBlockCompleted] = useState(false); 
    const [ fieldToEdit, setFieldToEdit ] = useState('');
    const [ tag, setTag] = useState('');
    const [ tagArray, setTagArray ] = useState([]);
    const [ editTags, setEditTags ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ addStep, setAddStep ] = useState(false);
    const [ activeBlock, setActiveBlock ] = useState('');
    const [ blockProgress, setBlockProgress ] = useState('');
    const [isPublic, setIsPublic] = useState('')
    const { journeyId } = useParams();
    const hiddenFileInput  = useRef(null);
    const isFirstRender = useRef(true);
    const allTags = [...tagArray];
    const checkMark = "\u2713";
   
    const navigate = useNavigate();

    useEffect(() =>  {
     
        axios.get(`${API_ROUTE}/api/journeys/${journeyId}`)
            .then(foundJourney => {
                if(foundJourney){
                setUserJourney(foundJourney.data);
                setJourneyBlocks(foundJourney.data.blocks);
                setJourneyTags(foundJourney.data.tags);
                setIsPublic(foundJourney.data.isPublic)
                setIsLoading(false)}
            });
           
    
    }, [journeyId, addStep, updatedJourney]);


   useEffect(() => {
    // if(isFirstRender.current){
    //     isFirstRender.current = false;
    //     return;
    // }
        if(activeBlock){
            let stepsCompleted = activeBlock.steps.filter(step => step.isCompleted);
            let completedPercentage = stepsCompleted.length ? stepsCompleted.length/activeBlock.steps.length * 100 : 0;
             if(completedPercentage !== 0){
                setBlockProgress(Math.round(completedPercentage))
            } else setBlockProgress(0)};
        
        if(blockProgress === 100){
            axios.put(`${API_ROUTE}/api/blocks/${activeBlock._id}`, { isCompleted: true })
                    .then((response) => setUpdatedJourney(response.data))
        } else {
            axios.put(`${API_ROUTE}/api/blocks/${activeBlock._id}`, { isCompleted: false })
                    .then((response) => setUpdatedJourney(response.data))
        }  
                    
                // if(blockProgress === 100) {
                //     axios.put(`${API_ROUTE}/api/blocks/${activeBlock._id}`, { isCompleted: true })
                //     .then((response) => setUpdatedJourney(response.data))}
                // else{
                //     axios.put(`${API_ROUTE}/api/blocks/${activeBlock._id}`, { isCompleted: false })
                //     .then((response) => setUpdatedJourney(response.data))}
          
        
     }, [blockProgress, activeBlock]);   
     
     
//    useEffect(()=> {
//         if(blockCompleted){
//             axios.put(`${API_ROUTE}/api/blocks/${activeBlock._id}`, { isCompleted: true })
//                     .then((response) => setUpdatedJourney(response.data))
//         } else {
//             axios.put(`${API_ROUTE}/api/blocks/${activeBlock._id}`, { isCompleted: false })
//                     .then((response) => setUpdatedJourney(response.data))
//         }
//    }, [blockCompleted, updatedJourney, activeBlock, blockProgress])



    const handleEditValue = (event) => {
        const name = event.target.name;
        if(event.target.value && event.target.value !== userJourney.name){
            axios.put(`${API_ROUTE}/api/journeys/${userJourney._id}`, {[name] : event.target.value})
                .then(response => setUpdatedJourney(response.data))
            setFieldToEdit('')
            } else setFieldToEdit('');
        }

    const handleEditBlock = (event) => {
        const name = event.target.name;
        if(event.target.value && event.target.value !== activeBlock.name){
            axios.put(`${API_ROUTE}/api/blocks/${activeBlock._id}`, {[name] : event.target.value})
                .then(response => {
                    setUpdatedJourney(response.data);
                    setFieldToEdit('');})
            } else setFieldToEdit('');
        }

    

    const handleImageUpload = () => {
        hiddenFileInput.current.click();
    }

    const handleImageChange = async (event) => {
        let newImageUrl = '';
        const uploadData = new FormData();
        uploadData.append("imageUrl", event.target.files[0]);
        const updatedUrl = await axios.post(`${API_ROUTE}/api/upload`, uploadData)
            .then(response => {
                newImageUrl = response.data.imageUrl
                setUserJourney({...userJourney, image: newImageUrl})
            })
            .catch(error => setErrorMessage(error.response.data.message));

        axios.put(`${API_ROUTE}/api/journeys/${userJourney._id}`, {image: newImageUrl})
            .then((response) => setUpdatedJourney(response.data))
            .catch(error => setErrorMessage(error.response.data.message));

    }

    const updateTags = (event) => {
        event.preventDefault();
        if(journeyTags && journeyTags !== userJourney.tags){
            axios.put(`${API_ROUTE}/api/journeys/${userJourney._id}`, {tags : journeyTags})
                .then(response => setUpdatedJourney(response.data))
            setFieldToEdit('')
            } else setFieldToEdit('');
    }

    const deleteBlock = () => {
        axios.delete(`${API_ROUTE}/api/${userJourney._id}/blocks/${activeBlock._id}`)
            .then(response => setUpdatedJourney(response));
    }

    const deleteJourney = () => {
        axios.delete(`${API_ROUTE}/api/journeys/${userJourney._id}/`)
            .then(() => navigate('/profile'));
    }

    

    // const handleBlockClick = (block) => {
    //     console.log(block)
    //     axios.get(`${API_ROUTE}/api/blocks/${block}`)
    //         .then((response) => console.log(response.data))
    //         .catch(error => setErrorMessage(error.response.data.message));
    //     setBlockToDisplay(""); 
    // }

    const handleIsPublic = (e)=>{
        let newState = e.target.checked
        setIsPublic(newState)
        console.log(newState)
        axios.put(`${API_ROUTE}/api/journeys/${userJourney._id}`, {isPublic: newState})
            .then(response=>{
                console.log(response)
            })
    }
        

    return(
        <div className="main-container">
            {isLoading && 
                <>  
                    <div style={{marginTop: '150px'}} className='text-center'>
                        <div className="spinner-border spinner-border-lg">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                    <p>Loading...</p>
                </>}   
            {userJourney && !isLoading &&
            <div className="user-journey-container">
                <div>
                <button onClick={()=>navigate(-1)} className="btn btn-primary space-r margin-top">Go Back</button>
                <div>
                    <p>Your Journey is currently {isPublic ? "public" : "private"}</p>
                    <div className="flex-centered">
                    <p className="no-padding margin-r">{isPublic ? "Uncheck to make journey private :": "Make journey public :"}</p><input checked={isPublic} onClick={(e)=>handleIsPublic(e)} type='checkbox'/>
                    </div>
                </div>
                    {fieldToEdit === 'user-journey-title' ? 
                        <div>
                        
                            <input type="text" defaultValue={userJourney.title} name="title" autoFocus style={{height: '50px', size: `${userJourney.title.length}`, fontSize: '1.8em'}} onFocus={(event) => event.currentTarget.select()} onBlur={(event) => handleEditValue(event)}/>         
                            <br/>
                        </div> 
                    : <h1 id='user-journey-title' onClick={() => setFieldToEdit('user-journey-title')}>{userJourney.title}<span><i className="bi bi-pencil-fill pencil" ></i></span></h1>}             
                    
                    <div>
                        <img src={userJourney.image} alt={`${userJourney.title}`} style={{width: '300px', height: 'auto'}}/>
                        <br/>
                        <label for='update-journey-image'>
                        <br/>
                            <button className="btn btn-light img-upload-btn" onClick={handleImageUpload}>Update Image</button>
                            <input id= 'update-journey-image' type='file' ref={hiddenFileInput} onChange={(event) => handleImageChange(event)} style={{display: 'none'}}/>
                        </label>
                        
                    </div>
                    <br/>
                    {fieldToEdit === 'user-journey-description' ? 
                        <div>
                            <textarea defaultValue={userJourney.description} name="description" className="form-control" style={{height:'75px', width: '400px', marginBottom: '15px'}} autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(event) => {handleEditValue(event)}}/>    
                        </div> 
                    : <p className="description-journey" id='user-journey-description' onClick={() => setFieldToEdit('user-journey-description')}>{userJourney.description}<span><i className="bi bi-pencil-fill pencil" ></i></span></p>}
                   
                   
                    {fieldToEdit === 'user-journey-tags' ?
                      <div >
                        <EditTags  setTagArray={setTagArray} journeyTags={journeyTags} setJourneyTags={setJourneyTags}/>
                        <form onSubmit={(event) => updateTags(event)}>
                            <input type='hidden' value={tagArray} name='tags'/>
                            <button className='btn btn-success create-journey' type="submit" style={{marginTop:'-20px'}}>Update Tags</button>
                        </form>
                        
                      </div>
                    : <div style={{marginTop: '30px'}}>
                        <h2 id='user-journey-tags' onClick={() => setFieldToEdit('user-journey-tags')}>Tags<span><i className="bi bi-pencil-fill pencil"></i></span></h2> 
                            <br/>
                            <div className="tags-display" style={{marginTop: '-10px'}}>
                                {userJourney.tags && userJourney.tags.map(tag => {
                                    if(tag){
                                        return  (
                                            <div >
                                                <button type="button" class="btn btn-outline-primary tag-map" style={{margin: '10px'}}>
                                                    {tag} <span class="badge badge-light"/>
                                                </button>
                                            </div>
                                        )}
                                })}
                            </div>
                            <br/>
                    </div>}
                    {userJourney.isPublic && <p className='user-journey-upvotes'>Upvotes: {userJourney.upvoteUsers.length}</p>}
                    <div className="block-display" >
                        {userJourney.blocks && userJourney.blocks.map(block => {
                                if(blockToDisplay === block._id){
                                 return (
                                    <div key={block._id} style={{display:'flex', flexDirection: 'column'}}>
                                        {fieldToEdit === "journey-block-title" ?
                                         <input name="title" defaultValue={block.title} autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(event) => {handleEditBlock(event)}}/> 
                                         : <button className="btn btn-outline-warning block-btn" onClick={() => setActiveBlock(block)}><h2 id="journey-block-title" className="colored">{block.title}</h2><span><i onClick={() => setFieldToEdit("journey-block-title")} className="bi bi-pencil-fill pencil" ></i></span></button>}
                                        <div className="flex-progress">
                                            <p className="progress-t">Progress:</p>
                                            <p className="progress-bar"><UserProgress now={blockProgress}/></p>
                                        </div>
                                        <label className="title-block">Description:</label>
                                        {fieldToEdit === "journey-block-description" ? 
                                         <input type="text" name="description" defaultValue={block.description} autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(event) => {handleEditBlock(event)}}/>
                                         : <p id="journey-block-description" onClick={() => setFieldToEdit('journey-block-description')}>{block.description} </p>}
                                        <label className="title-block">Category:</label>

                                        {fieldToEdit === "journey-block-category" ?
                                            <select name="category" required onChange={(event) => handleEditBlock(event)}>
                                                <option disabled selected>-- Choose a category --</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Programming">Programming</option>
                                                <option value="Blockchain">Blockchain</option>
                                                <option value="Culture">Culture</option>
                                                <option value="Languages">Languages</option>
                                            </select>
                                        : <p id="journey-block-category" onClick={() => setFieldToEdit('journey-block-category')}>{block.category}</p>}

                                        {fieldToEdit === "journey-block-importance" ? 
                                            <select name='importance' onChange={(event) => handleEditBlock(event)}>
                                                <option value={'default'} disabled>Select Priority</option>
                                                <option value='Critical'>Critical</option>
                                                <option value='Recommended'>Recommended</option>
                                                <option value='Optional'>Critical</option>
                                            </select>
                                         : <p id="journey-block-importance" onClick={() => setFieldToEdit('journey-block-importance')}>{block.importance}</p>}
                                         <p className="bold label-journey">Block Steps:</p>
                                        {block.steps && block.steps.map(step => {
                                            return (
                                                <Link to={`/profile/journeys/${journeyId}/${block._id}/${step._id}`}>
                                                    <button type="button" class="btn btn-primary" style={{margin:'5px', width: '70%'}}>
                                                    {step.title}<span class="badge badge-light">{step.isCompleted ? checkMark : "" }</span>
                                                    </button>
                                                {/* <button className="btn btn-outline-primary">{step.title}</button> */}
                                                </Link>)
                                        })}
                                        <div className="div-block-short"/>
                                        {addStep && <CreateStep journeyId = {userJourney._id} blockId = {block._id} setAddStep={setAddStep} setUpdatedJourney={setUpdatedJourney}/>}
                                        <br/>
                                        {!addStep && <button className="btn btn-outline-success alligned" onClick={() => setAddStep(true)}>Add a Step to Block</button>}
                                        <br/>
                                        <button className="btn btn-outline-danger alligned" onClick={() => deleteBlock()}>Delete Block</button>
                                    </div>)
                                } else return (
                                    <div key={block._id} style={{display:'flex', flexDirection: 'column', justifyItems: 'center'}}>
                                        <button className="btn btn-outline-warning" onClick={() => {setBlockToDisplay(block._id); setActiveBlock(block)}}><h2  className="colored">{block.title}</h2></button>
                                    </div>
                                    )}
                                )}
                    </div>
                </div>
                <div className="margin-t">  
                    {showForm ? <CreateBlock journeyId={journeyId} setUpdatedJourney={setUpdatedJourney} userJourney={userJourney} setUserJourney={setUserJourney} setShowForm={setShowForm}/>
                            : <button className="btn btn-dark margined" type="button" onClick={() => setShowForm(true)}>Create a New Block</button>}
                </div>
                <br/>
                <button className="btn btn-danger m-bottom" onClick={() => deleteJourney()}>Delete Journey</button>
                <br/>           
            </div>} 
       </div> 
    )

};

export default UserJourneyPage;