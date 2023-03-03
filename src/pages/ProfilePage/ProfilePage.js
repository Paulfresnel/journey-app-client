import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/auth.context";
import CreateJourney from "../../components/CreateJourney/CreateJourney";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './ProfilePage.css'

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function ProfilePage() {
    
    const navigate = useNavigate()
    const { user, isLoggedIn } =  useContext(AuthContext);
    const [userLogged, setUserLogged] = useState({user});
    const [journeys, setJourneys] = useState([]);
    const [addJourney, setAddJourney] = useState(false);
    const [journeysCopied, setJourneysCopied] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalUpvotes, setTotalUpvotes] = useState(0);
    const [creationDate, setCreationDate] = useState('');
    const [username, setUsername] =useState('');
    const [userImg, setUserImg] =useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const hiddenFileInput  = useRef(null);



    useEffect(() => {

    if(isLoggedIn){
        let counter =0
        setUserLogged(user);
        axios.get(`${API_ROUTE}/api/users/${user._id}/`)
            .then(foundUser => {
                let user = foundUser.data
                if (user.createdAt){
                    let userCreationDate = user.createdAt
                let userCreationDateObject = new Date(userCreationDate)
                const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            let readableUpdatedDate = userCreationDateObject.toLocaleDateString('en-US', options)
              setCreationDate(readableUpdatedDate)
                }
                user.journeysCreated.map(journey=>{
                    if (journey.upvoteUsers){
                        return counter += journey.upvoteUsers.length
                    }
                })

                setTotalUpvotes(counter)


                let usernameMaj = user.username.charAt(0).toUpperCase() + user.username.slice(1)
                setUserImg(user.profilePicture)
                setUsername(usernameMaj)
                setJourneys(foundUser.data.journeysCreated)
                setJourneysCopied(foundUser.data.journeysCopied)
                setTimeout(()=>{
                    setIsLoading(false)
                }, 1000) 
            })}
            
    }, [user])


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
                console.log(newImageUrl)
            })
            .catch(error => setErrorMessage(error.response.data.message));

        axios.put(`${API_ROUTE}/api/users/${user._id}`, {profilePicture: newImageUrl})
            .then((response) => setUserImg(response.data.profilePicture))
            .catch(error => setErrorMessage(error.response.data.message));
    }

    

    return(
        <div>
            <button onClick={()=>navigate(-1)} className="btn btn-primary space-r margin-top">Go Back</button>
            
            {isLoading && 
            <>
                <div className='text-center'>
                    <div className="spinner-border spinner-border-lg">
                        <span className="sr-only"></span>
                    </div>
                </div>
                <p>Loading...</p>
                </>
            }
        {!isLoading &&
        <> 
            <div className='main-container-carousel no-padding'>
            <div className="div-block"/>
            {creationDate && 
                <div> <i className="bi bi-info-circle-fill log-info"></i>
                    <ul className="hide">
                            <li>Last updated on <span className="bold">{creationDate}</span></li>
                    </ul>
                </div>}
            <h2>Welcome back,<span className="bold username"> {username}</span></h2>
            <br/>
            <div className="flex-row-adjusted">
                <img className="small-pic img-fluid" src={userImg}/>
                <br/>
                <button className='btn btn-link' onClick={handleImageUpload}>Update Profile Picture</button>
                {errorMessage && <p className = 'error-message'>{errorMessage}</p>}
                <input id= 'update-journey-image' type='file' ref={hiddenFileInput} onChange={(event) => handleImageChange(event)} style={{display: 'none'}}/>
                <div className="flex-row-public">
                    <div className="flex-column-public green">
                        <h3 className="btn btn-outline-success upvotes-received">Upvotes</h3>
                        <h5 className="number">{totalUpvotes}</h5>
                    </div>
                    <div className="flex-column-public gray">
                        <h3 className="btn btn-secondary total-journeys">Journeys</h3>
                        <h5 className="number">{journeys.length}</h5>
                    </div>
                </div>
            </div>
                <>
                    <div className="div-block"/>
                    <br/>
                    <h1>{journeys ? 'Journeys Created' : 'Get started and create your first journey'}</h1>
                </>
            {!isLoading && 
            <div id="journeysCreated" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {journeys.map((journey,index)=>{
                        if (index===0){ 
                            return <button style={{color:"black"}} type="button" data-bs-target="#journeysCreated" data-bs-slide-to={index} className="active" aria-current="true" aria-label="Slide 1" ></button>
                        } else {
                            return <button style={{color:"black"}} type="button" data-bs-target="#journeysCreated" data-bs-slide-to={index} className="" aria-label={`Slide ${index+1}`} ></button>
                    }})}
                </div>  
                <div className="carousel-inner">
                    <div> {journeys.map((journey,index)=>{
                        if (index===0){
                            return (
                                <div className="carousel-item active">
                                    <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
                                    <div className="carousel-caption">
                                        <h1 className="carousel-title">{journey.title}</h1>
                                        <p className="upvote">Total Upvotes received: {journey.upvoteUsers.length}</p>
                                        <Link to={`/profile/journeys/${journey._id}`}>
                                        <button className="btn btn-primary carousel-btn">Edit Journey</button>
                                        </Link>
                                    </div>
                                </div>)
                            } else {
                    return (
                            <div className="carousel-item">
                                <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
                                <div className="carousel-caption">
                                    <h1 className="carousel-title">{journey.title}</h1>
                                    {journey.upvoteUsers && <p className="upvote">Total Upvotes received: {journey.upvoteUsers.length}</p>}
                                    {journey.category && <h6 className="category">{journey.category}</h6>}
                                    <Link to={`/profile/journeys/${journey._id}`}>
                                    <button className="btn btn-primary carousel-btn">Edit Journey</button>
                                    </Link>
                                </div>
                            </div>)
                            }
                        })}
                    </div> 
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#journeysCreated" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#journeysCreated" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden black">Next</span>
                </button>   
            </div>}

            {addJourney && <CreateJourney setAddJourney={setAddJourney} setJourneys={setJourneys} journeys={journeys}/>}
            {!addJourney && <button className="btn btn-success create-journey" onClick={() => setAddJourney(true)}>Create New Journey</button>}
            <div className="divider"></div>

            <h1>Journeys Upvoted</h1>
            {!isLoading && 
                <div id="journeysCopied" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {journeysCopied.map((journey,index)=>{
                            if (index===0){
                                return <button style={{color:"black"}} type="button" data-bs-target="#journeysCopied" data-bs-slide-to={index} className="active" aria-current="true" aria-label="Slide 1" ></button>
                            } else {
                                return <button style={{color:"black"}} type="button" data-bs-target="#journeysCopied" data-bs-slide-to={index} className="" aria-label={`Slide ${index+1}`} ></button>
                        }})}
                    </div>  
                    <div className="carousel-inner margin-b">
                        <div> {journeysCopied.map((journey,index)=>{
                            if (index===0){
                                return (
                                    <div className="carousel-item active">
                                        <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
                                            <div className="carousel-caption">
                                                <h1 className="carousel-title">{journey.title}</h1>
                                                {journey.category && <h6 className="category">{journey.category}</h6>}
                                                {journey.author && <p className="upvote">Created by: <Link to={`/profile/${journey.author._id}`}>{journey.author.username}</Link></p>}
                                                <p className="upvote">Total upvotes: {journey.upvoteUsers.length}</p>
                                                <Link to={`/journeys/${journey._id}`}>
                                                <button className="btn btn-primary carousel-btn">Check the Journey</button>
                                                </Link>
                                            </div>
                                    </div>)
                            } else {
                                return (<div className="carousel-item">
                                    <img loading='lazy' src={journey.image} className=" w-100 h-100" alt="..."/>
                                    <div className="carousel-caption">
                                        <h1 className="carousel-title">{journey.title}</h1>
                                        {journey.author && <p className="upvote">Created by: <Link to={`/profile/${journey.author._id}`}>{journey.author.username}</Link></p>}
                                        <p className="upvote">Total upvotes: {journey.upvoteUsers.length}</p>
                                        <Link to={`/journeys/${journey._id}`}>
                                        <button className="btn btn-primary carousel-btn">Check the Journey</button>
                                        </Link>
                                    </div>
                                </div>)
                                }
                            })}
                        </div> 
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#journeysCopied" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#journeysCopied" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden black">Next</span>
                    </button>
              </div>}      
        </div>
        </>} 
    </div>
    )
}

export default ProfilePage;