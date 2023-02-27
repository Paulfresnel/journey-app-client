import { useState/* , useEffect */ } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditTags from "../EditTags/EditTags";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function CreateJourney(props){

    const { user, setUser } = useContext(AuthContext);
    const { setAddJourney, journeys, setJourneys } = props;
    const [journeyTags, setJourneyTags] = useState([]);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [tagArray, setTagArray] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [category, setCategory] = useState('')
    const [errorMessage, setErrorMessage] = useState(null);

    const handleUpload = (event) => {
        
        const uploadData = new FormData();
        uploadData.append('imageUrl', event.target.files[0])
        axios.post(`${API_ROUTE}/api/upload`, uploadData)
            .then(response => {
                setImage(response.data.imageUrl)
            })
            .catch(error => setErrorMessage(error.response.data.message));

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(title && description){
        const userJourney = {title, description, image, tags: tagArray, isPublic, category};
        console.log(userJourney)
        axios.post(`${API_ROUTE}/api/${user._id}/journeys`, userJourney)
            .then(response => {
                console.log(response.data)   
                let newJourneysArray = response.data.user.journeysCreated
                setUser(response.data.user);
                navigate(`/profile`);
                setAddJourney(false);
                setJourneys(newJourneysArray)
                })
        } else {
            setErrorMessage('Please Add a Title and a Description to Your Journey')
        }
    }

    return(
        <> 
            <div className='overlay-style'/> 
            <div className='modal-style'>
                <h1>Create a Journey</h1>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <label>Title:
                        <input type='text' name='title' onChange={(event) => setTitle(event.target.value)}/>
                    </label>
                    <br/>
                    <label>Description:
                        <input type='text' name='description' onChange={(event) => setDescription(event.target.value)}/>
                    </label>
                    <br/>
                    <label>Category: 
                    <select required onChange={(e)=>setCategory(e.target.value)} name="category">
                        <option disabled selected>-- Choose a category --</option>
                        <option value="Finance">Finance</option>
                        <option value="Programming">Programming</option>
                        <option value="Blockchain">Blockchain</option>
                        <option value="Culture">Culture</option>
                        <option value="Languages">Languages</option>
                    </select></label>
                    <br/>
                    <label>Image:
                        <input type='file' name='imageUrl' onChange={(event) => handleUpload(event)}/>
                    </label>
                    <br/>

                    <EditTags setTagArray={setTagArray} setJourneyTags={setJourneyTags} journeyTags={journeyTags}/>

                    <label>Make Journey Public:
                        <input type='checkbox' name='isPublic' onChange={(event) => setIsPublic(event.target.checked)}/>
                    </label>
                    <br/>
                    {errorMessage && <h2>{errorMessage}</h2>}
                    <button>Create Journey</button>
                    <button onClick={()=>setAddJourney(false)}>Close</button>
                </form>
            </div>
        </>
    )
}

export default CreateJourney