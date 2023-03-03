import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import './HomePage.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function HomePage(){
    const {user} = useContext(AuthContext)
    const [featuredJourney,setFeaturedJourney] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        axios.get(`${API_ROUTE}/api/journeys`)
            .then(response=>{
                console.log(response)
                let publicJourneys = response.data.publicJourneys
                publicJourneys.map(journey=>{
                    let counter=0
                    if (journey.blocks){
                        journey.blocks.map(block=>{
                            if (block.steps){
                             counter += block.steps.length
                             return counter
                             }
                        })
                    }
                    journey.totalSteps = counter
                })
              let journeysNotEmpty =  publicJourneys.filter(journey=>{
                    return journey.totalSteps > 0
                })
                console.log(journeysNotEmpty)

                let randomNumber = Math.floor(Math.random()* journeysNotEmpty.length)
                console.log(randomNumber)
                setFeaturedJourney(journeysNotEmpty[randomNumber])
                setIsLoading(false)
            })  
    },[])

    return(
        <div className="main-menu">
            <div className='home-header'>
                <img className='home-img' src='https://res.cloudinary.com/djwmauhbh/image/upload/v1677850123/journey-app-assets/Banner_ntdakc.jpg'/>
            </div>    
            <div className='featured-j-container'>
                <br/>
                <hr/>
                <h1 className='second-title'>Featured Journey</h1>
                <p className="italic colored main-menu-description">Discover the Journeys created by our Users</p>
                {isLoading && <img src="https://media4.giphy.com/media/y1ZBcOGOOtlpC/200w.webp?cid=ecf05e47wd7jjsjcajwwmcw8vx0gefelzn5rqsr3gy1jhymm&rid=200w.webp&ct=g"/>}
                {!isLoading && 
                    <div className='carousel-container'>
                        <div id="journeysCreated" className="carousel slide" data-bs-ride="carousel" >  
                            {featuredJourney && 
                                <div className="carousel-item active bordered" style={{borderWidth: '0'}} >
                                    <div className='carousel-img-container'>
                                        <img loading='lazy' src={featuredJourney.image} style={{width: '80%', objectFit: 'cover', borderRadius:'2%'}} alt="..."/>
                                    </div>
                                    <div className="carousel-caption carousel-items">
                                        <h1 className="carousel-title">{featuredJourney.title}</h1>
                                        {!user && <p className='author-name'>By: <Link to={`/profile/${featuredJourney.author._id}`}> {featuredJourney.author.username.charAt(0).toUpperCase()+featuredJourney.author.username.slice(1)}</Link> </p>}
                                        {user && <p className='author-name'>By: {user._id === featuredJourney.author._id ? <Link to={`/profile`}> {featuredJourney.author.username.charAt(0).toUpperCase()+featuredJourney.author.username.slice(1)}</Link> : <Link to={`/profile/${featuredJourney.author._id}`}> {featuredJourney.author.username.charAt(0).toUpperCase()+featuredJourney.author.username.slice(1)}</Link>}</p>}
                                        <p className="upvote">Total Upvotes received: {featuredJourney.upvoteUsers.length}</p>
                                        <Link to={`/journeys/${featuredJourney._id}`}>
                                            <button className="btn btn-primary carousel-btn">Check Journey</button>
                                        </Link>
                                    </div>
                                </div> }   
                        </div>
                    </div>}
            </div>
        </div>
    
    )

}

export default HomePage