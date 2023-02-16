import { useState/* , useEffect */ } from "react";
import axios from "axios";
import EditTags from "../EditTags/EditTags";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

const API_ROUTE = process.env.REACT_APP_SERVER_URL;
const allTags = [];


function CreateJourney(){

    const {user, setUser} = useContext(AuthContext)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [tag, setTag] = useState('');
    const [tagArray, setTagArray] = useState([]);
    const [isPublic, setIsPublic] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);


    const handleClick = () => {
        if(tag){
            allTags.push(tag);
            setTagArray(allTags);
            setTag('')
        };
    }

    const handleUpload = (event) => {
        
        const uploadData = new FormData();
        uploadData.append('imageUrl', event.target.files[0])
        axios.post(`${API_ROUTE}/api/upload`, uploadData)
            .then(response => setImage(response.data.imageUrl))
            .catch(error => setErrorMessage(error.response.data.message));

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(title && description){
        const userJourney = {title, description, image, tags: tagArray, isPublic};
        console.log(userJourney)
        axios.post(`${API_ROUTE}/api/${user._id}/journeys`, userJourney)
            .then(response => {
                console.log(response.data.user)
                })
        } else {
            setErrorMessage('Please Add a Title and a Description to Your Journey')
        }
    }

    return(
        <div>
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
                <label>Image:
                    <input type='file' name='imageUrl' onChange={(event) => handleUpload(event)}/>
                </label>
                <br/>

                {tagArray && <EditTags tagArray={tagArray} allTags={allTags} setTagArray={setTagArray}/>}

                <label>Tags:
                    <input type='text' name='tags' onChange={(event) => setTag(event.target.value)}/>
                </label>
                <button type="button" onClick={handleClick}>Add tag</button>
                <br/>
                <label>Make Journey Public:
                    <input type='checkbox' name='isPublic' onChange={(event) => setIsPublic(event.target.checked)}/>
                </label>
                <br/>
                {errorMessage && <h2>{errorMessage}</h2>}
                <button>Create Journey</button>
            </form>
        </div>
    )
}

export default CreateJourney