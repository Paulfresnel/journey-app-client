import axios from "axios";
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from "react-router-dom";
import CreateBlock from "../../components/CreateBlock/CreateBlock";
import EditTags from "../../components/EditTags/EditTags";
import CreateStep from "../../components/CreateStep/CreateStep";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;


function UserJourneyPage() {

    const [ userJourney, setUserJourney ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showForm, setShowForm ] = useState(false);
    const [ updatedJourney, setUpdatedJourney ] = useState({});
    const [ blockToDisplay, setBlockToDisplay ] = useState(''); 
    const [ fieldToEdit, setFieldToEdit ] = useState('');
    const [tag, setTag] = useState('');
    const [ tagArray, setTagArray ] = useState([]);
    const [ editTags, setEditTags ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ addStep, setAddStep ] = useState(false);
    const { journeyId } = useParams();
    const hiddenFileInput  = useRef(null);
    const allTags = [...tagArray];

    useEffect(() => {
        axios.get(`${API_ROUTE}/api/journeys/${journeyId}`)
            .then(foundJourney => {
                if(foundJourney){
                    console.log(foundJourney.data);
                setUserJourney(foundJourney.data);
                setIsLoading(false)}
            })
    }, [updatedJourney]);

    const handleEditValue = (event) => {
        const name = event.target.name
        if(event.target.value && event.target.value !== userJourney.name){
            axios.put(`${API_ROUTE}/api/journeys/${userJourney._id}`, {[name] : event.target.value})
                .then(response => setUpdatedJourney(response.data))
            setFieldToEdit('')
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
            .then(response => newImageUrl = response.data.imageUrl)
            .catch(error => setErrorMessage(error.response.data.message));

        axios.put(`${API_ROUTE}/api/journeys/${userJourney._id}`, {image: newImageUrl})
            .then((response) => setUpdatedJourney(response.data))
            .catch(error => setErrorMessage(error.response.data.message));

    }

    const handleTagButton = () => {
        if(tag){
            allTags.push(tag);
            setTagArray(allTags);

            setTag('')
        };
    }

    // const handleBlockClick = (block) => {
    //     console.log(block)
    //     axios.get(`${API_ROUTE}/api/blocks/${block}`)
    //         .then((response) => console.log(response.data))
    //         .catch(error => setErrorMessage(error.response.data.message));
    //     setBlockToDisplay(""); 
    // }
        

    return(
        <div>
            {isLoading && <h1>Loading...</h1>}   
            {userJourney &&
            <>
                <div>
                    {fieldToEdit === 'user-journey-title' ? 
                        <div>
                            <input type="text" defaultValue={userJourney.title} name="title" autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(event) => handleEditValue(event)}/>         
                            <br/>
                        </div> 
                    : <h1 id='user-journey-title' onClick={() => setFieldToEdit('user-journey-title')}>{userJourney.title}</h1>}             
                    
                    <div>
                        <img src={userJourney.image} alt={`${userJourney.title}`} style={{width: '300px', height: 'auto'}}/>
                        <br/>
                        <label for='update-journey-image'>
                            <button onClick={handleImageUpload}>Update Image</button>
                            <input id= 'update-journey-image' type='file' ref={hiddenFileInput} onChange={(event) => handleImageChange(event)} style={{display: 'none'}}/>
                        </label>
                    </div>

                    {fieldToEdit === 'user-journey-description' ? 
                        <div>
                            <input type="text" defaultValue={userJourney.description} name="description" autoFocus onFocus={(event) => event.currentTarget.select()} onBlur={(event) => {if(!editTags){handleEditValue(event)}}}/>    
                            <br/>
                        </div> 
                    : <h2 id='user-journey-description' onClick={() => setFieldToEdit('user-journey-description')}>{userJourney.description}</h2>}
                   
                   
                    {fieldToEdit === 'user-journey-tags' ?
                      <div>
                        <EditTags tag={tag} setTag={setTag} allTags={userJourney.tags} setTagArray={setTagArray} tagArray={tagArray} setEditTags={setEditTags}/>
                            <input type="text" name="tags" autoFocus onChange={(event) => setTag(event.target.value)} onFocus={(event) => event.currentTarget.select()} onBlur={(event) => handleEditValue(event)}/> 
                        <button type="button" onClick={handleTagButton}>Add tag</button>
                      </div>
                    : <div>
                        <h2 id='user-journey-tags' onClick={() => setFieldToEdit('user-journey-tags')}>Tags:</h2> 
                            
                                {userJourney.tags && userJourney.tags.map(tag => {
                                    return <h3 key={Math.random()*10}>{tag}</h3>
                            })}
                    </div>}
                    {userJourney.isPublic && <h2>Upvotes: {userJourney.upvoteUsers.length}</h2>}
                    {userJourney.isPublic && <h2>Copied {userJourney.usersCopying.length} times</h2>}
                    <div>
                        {userJourney.blocks && userJourney.blocks.map(block => {
                                if(blockToDisplay === block._id){
                                 return (
                                    <div key={block._id} style={{display:'flex', flexDirection: 'column'}}>
                                        <button onClick={() => setBlockToDisplay("")}><h2>{block.title}</h2></button>
                                        <p>{block.description}</p>
                                        <p>{block.category}</p>
                                        <p>{block.importance}</p>
                                        {block.steps && block.steps.map(step => {
                                            return <Link to={`/${block._id}/${step._id}`}><button>{step.title}</button></Link>
                                        })}
                                        {addStep && <CreateStep journeyId = {userJourney._id} blockId = {block._id} setAddStep={setAddStep}/>}
                                        {!addStep && <button onClick={() => setAddStep(true)}>Add a Step to {block.title}</button>}
                                    </div>)
                                } else return (
                                    <div key={block._id} style={{display:'flex', flexDirection: 'column', justifyItems: 'center'}}>
                                        <button onClick={() => setBlockToDisplay(block._id)}><h2>{block.title}</h2></button>
                                    </div>
                                    )}
                                )}
                    </div>
                </div>
                <div>  
                    {showForm ? <CreateBlock journeyId={journeyId} setUpdatedJourney={setUpdatedJourney} setShowForm={setShowForm}/>
                            : <button type="button" onClick={() => setShowForm(true)}>New Block</button>}
                </div>           
            </>} 
       </div> 
    )

};

export default UserJourneyPage;