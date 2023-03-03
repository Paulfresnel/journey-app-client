import { useState/* , useEffect */ } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditTags from "../EditTags/EditTags";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import ReactDOM  from "react-dom"
import './CreateJourney.css'

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function CreateJourney(props){

    const { user, setUser } = useContext(AuthContext);
    const { setAddJourney, setJourneys } = props;
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

        axios.post(`${API_ROUTE}/api/${user._id}/journeys`, userJourney)
            .then(response => { 
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

    return ReactDOM.createPortal(
        <> 
            <div className='overlay-style'/> 
            <div className='modal-style'>
                <h1>Create a Journey</h1>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className='form-floating mb-3' >
                        <input className='form-control' type='text' name='title' placeholder='title' onChange={(event) => setTitle(event.target.value)}/>
                        <label>Title:</label>
                    </div>
                    <div className='form-floating mb-3'>
                        <textarea className='form-control' type='text' name='description' placeholder='description' style={{height: '100px'}} onChange={(event) => setDescription(event.target.value)}/>
                        <label>Description:</label>
                    </div>
                    <div className='form-floating mb-3'>
                        <select className='form-control' placeholder='category' required onChange={(e)=>setCategory(e.target.value)} name="category">
                            <option disabled selected>-- Choose a category --</option>
                            <option value="Finance">Finance</option>
                            <option value="Programming">Programming</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="Culture">Culture</option>
                            <option value="Languages">Languages</option>
                        </select> 
                        <label>Category: </label>
                    </div>
                    <div className='mb-3'>
                        <input type='file' className='form-control' name='imageUrl' onChange={(event) => handleUpload(event)}/>
                        <label>Image:</label>
                    </div>

                    <EditTags setTagArray={setTagArray} setJourneyTags={setJourneyTags} journeyTags={journeyTags}/>

                    <div className='form-check' style={{paddingTop: '10px'}}>
                        <label className='form-check-label'> Make Journey Public
                            <input className='form-check-input' type='checkbox' name='isPublic' onChange={(event) => setIsPublic(event.target.checked)}/>
                        </label>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button className='btn btn-success create-journey'>Create Journey</button>
                    <br/>
                    <button className='btn btn-link' onClick={()=>setAddJourney(false)}>Close</button>
                </form>
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default CreateJourney