import axios from 'axios';
import { useEffect, useState } from 'react'
import './HomePage.css'
import { Link } from 'react-router-dom';

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function HomePage(){

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
        <div className="main-menu margined">
            
        <h1 className='main-title'><span className='emphasized quest-font'>P</span>eer-To-Peer Shared <span className='emphasized quest-font'>K</span>nowledge Base</h1>
        <p>use the <span className='bold'> Menu links</span> to navigate your way through our site</p>
           <img src='https://media3.giphy.com/media/19dm2McJ6qsxCNgZwT/200w.webp?cid=ecf05e4721qj7vvciriwodpt1tvt2xqi56ib1sty08i7gi3z&rid=200w.webp&ct=g'/>
    <div>
    <br/>
    <div className='div-block'/>
        <h1 className='second-title'><span className='emphasized quest-font'>F</span>eatured Journey</h1>
        <p className="italic colored main-menu-description">Discover the Journeys created by our Users</p>
        {isLoading && <img src="https://media4.giphy.com/media/y1ZBcOGOOtlpC/200w.webp?cid=ecf05e47wd7jjsjcajwwmcw8vx0gefelzn5rqsr3gy1jhymm&rid=200w.webp&ct=g"/>}
        {!isLoading && <div id="journeysCreated" className="carousel slide" data-bs-ride="carousel">  
  <div className="carousel-inner">
     
    {featuredJourney && <div className="carousel-item active bordered">
        <img loading='lazy' src={featuredJourney.image} className=" w-100 h-100" alt="..."/>
        <div className="carousel-caption">
             <h1 className="carousel-title">{featuredJourney.title}</h1>
             <p className='author-name'>By: <Link to={`/profile/${featuredJourney.author._id}`}> {featuredJourney.author.username}</Link></p>
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