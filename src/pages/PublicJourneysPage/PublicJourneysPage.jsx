import { useContext, useEffect, useState } from 'react'
import './PublicJourneysPage.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';

const API_ROUTE = process.env.REACT_APP_SERVER_URL;

function PublicJourneysPage(){
    
    const [isLoading, setIsLoading] = useState(true)
    const [allPublicJourneys, setAllPublicJourneys] = useState([])
    const {user} = useContext(AuthContext)
    const todayMilliseconds = new Date().getTime()  
    const twoDaysMilliseconds = 86400000*2
    const [usersArrayDisplay, setUsersArrayDisplay] = useState([])
    const [categories, setCategories] = useState([])

    const likeJourney = async (e) => {
        e.preventDefault();
        const journeyId = e.target.dataset.journeyid;
        const isLiked = e.target.value;
        try {
          let response;
          if (isLiked) {
            response = await axios.delete(`${API_ROUTE}/api/journeys/${journeyId}/like/${user._id}`);
          } else {
            response = await axios.post(`${API_ROUTE}/api/journeys/${journeyId}/like`, { userId: user._id });
          }
          const updatedJourney = response.data.journey;
          let copyOfJourneys = await [...allPublicJourneys]
          copyOfJourneys.map(journey=>{
            if (journey._id === updatedJourney._id) {
                journey.upvoteUsers = updatedJourney.upvoteUsers;
                return journey
              } else {
                return journey;
              }
          })

          setAllPublicJourneys(copyOfJourneys);
        } catch (error) {
          console.log(error);
        }
      };

      const toggleBlocks = (index) => {
        setAllPublicJourneys((prevJourneys) =>
          prevJourneys.map((journey, i) =>
            i === index ? { ...journey, showBlocks: !journey.showBlocks } : journey
          )
        );
      };  


      const handleFilterByName = (e)=>{

        let authorFilterName = e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1) //All - Paul - Humberto
        let journeyTitleFilter  = document.getElementsByClassName('select-filter-title')[0].value.toLowerCase()
        let checkedState = document.getElementsByClassName('checkbox-filter')[0].checked
        let categoryFilter = document.getElementsByClassName('select-filter-category')[0].value

        
        
        
          // Declare variables
          let authorName, authorTxtValue, card,i, journeyTitle, journeyTxtValue, emptyJourney, emptyJourneyTxtValue, journeyCategory, journeyCategoryTxtValue
          card = document.getElementsByClassName('card');
          // Loop through all list items, and hide those who don't match the search query
          for (i = 0; i < card.length; i++) {
            authorName = card[i].getElementsByClassName("author-name")[0]
            journeyTitle = card[i].getElementsByClassName("card-title")[0]
            emptyJourney = card[i].getElementsByClassName("bg-danger")[0]
            journeyCategory = card[i].getElementsByClassName("category-name")[0]

            if (emptyJourney){
             emptyJourneyTxtValue =  emptyJourney.innerHTML.toLowerCase()
            }
            if (journeyCategory){
              journeyCategoryTxtValue = journeyCategory.innerHTML
            }
            authorTxtValue = authorName.innerHTML
            journeyTxtValue = journeyTitle.innerHTML
            
              if ((authorTxtValue.indexOf(authorFilterName) >-1 || authorFilterName==="All") && (journeyTxtValue.toLowerCase().indexOf(journeyTitleFilter) > -1 || journeyTitleFilter === '') && (!emptyJourney && checkedState === true) && ((journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilter)>-1) || categoryFilter === 'all')){
              
                card[i].parentElement.style.position = 'static'
                card[i].parentElement.style.display = "block"
                card[i].parentElement.style.visibility = 'visible'
              }
              else if ((authorTxtValue.indexOf(authorFilterName) >-1 || authorFilterName==="All") && (journeyTxtValue.toLowerCase().indexOf(journeyTitleFilter) > -1 || journeyTitleFilter === '') && checkedState === false && ((journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilter)>-1) || categoryFilter === 'all')){
                card[i].parentElement.style.position = 'static'
                card[i].parentElement.style.display = "block"
                card[i].parentElement.style.visibility = 'visible'
              }
              else if(emptyJourney && (emptyJourneyTxtValue.indexOf('empty')>-1 && checkedState === true) && (journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilter)<=-1)){
                card[i].parentElement.style.position="absolute"
                card[i].parentElement.style.visibility = 'hidden'
                card[i].parentElement.style.left = '-999em'
              }
              else{
                card[i].parentElement.style.position="absolute"
                card[i].parentElement.style.visibility = 'hidden'
                card[i].parentElement.style.left = '-999em'
              }
          }
      }

      const handleFilterByTitle = (e)=>{
      let journeyTitleFilter = e.target.value.toLowerCase()
      let authorFilterName = document.getElementsByClassName('select-filter-author')[0].value
      let checkedState = document.getElementsByClassName('checkbox-filter')[0].checked
      let categoryFilter = document.getElementsByClassName('select-filter-category')[0].value


        
          // Declare variables
          let journeyTitle, card,i, journeyAuthor, authorTxtValue, emptyJourney, journeyTitleTxtValue, emptyJourneyTxtValue, journeyCategory, journeyCategoryTxtValue

          card = document.getElementsByClassName('card');
          // Loop through all list items, and hide those who don't match the search query
          for (i = 0; i < card.length; i++) {
            journeyTitle = card[i].getElementsByClassName("card-title")[0]
            journeyAuthor = card[i].getElementsByClassName('author-name')[0]
            emptyJourney = card[i].getElementsByClassName("bg-danger")[0]
            journeyCategory = card[i].getElementsByClassName("category-name")[0]

            if (journeyCategory){
              journeyCategoryTxtValue = journeyCategory.innerHTML
            }
            if (emptyJourney){
             emptyJourneyTxtValue =  emptyJourney.innerHTML.toLowerCase()
            }
            journeyTitleTxtValue = journeyTitle.innerHTML.toLowerCase()
            authorTxtValue = journeyAuthor.innerHTML

            if ((authorTxtValue.indexOf(authorFilterName) >-1 || authorFilterName==="all") && (journeyTitleTxtValue.toLowerCase().indexOf(journeyTitleFilter) > -1 || journeyTitleFilter === '') && (!emptyJourney && checkedState === true) && ((journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilter)>-1) || categoryFilter === 'all')){
              
              card[i].parentElement.style.position = 'static'
              card[i].parentElement.style.display = "block"
              card[i].parentElement.style.visibility = 'visible'
            }
            else if ((authorTxtValue.indexOf(authorFilterName) >-1 || authorFilterName==="all") && (journeyTitleTxtValue.toLowerCase().indexOf(journeyTitleFilter) > -1 || journeyTitleFilter === '') && checkedState === false && ((journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilter)>-1) || categoryFilter === 'all')){
              card[i].parentElement.style.position = 'static'
              card[i].parentElement.style.display = "block"
              card[i].parentElement.style.visibility = 'visible'
            }
            else if(emptyJourney && (emptyJourneyTxtValue.indexOf('empty')>-1 && checkedState === true) && (journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilter)<=-1)){
                card[i].parentElement.style.position="absolute"
                card[i].parentElement.style.visibility = 'hidden'
                card[i].parentElement.style.left = '-999em'
            }
            else{
              card[i].parentElement.style.position="absolute"
              card[i].parentElement.style.visibility = 'hidden'
              card[i].parentElement.style.left = '-999em'
            }
          }
        

      }
      const handleFilterByEmptyness =(e)=>{
        let journeyEmpty, card,i, authorTxtValue, journeyEmptyTxtValue, journeyTitleTxtValue, categoryTxtValue, categoryValue

        let hideEmptyJourneys = e.target.checked
        let authorFilter = document.getElementsByClassName('select-filter-author')[0].value
        let journeyTitleFilter  = document.getElementsByClassName('select-filter-title')[0].value.toLowerCase()
        let categoryFilter = document.getElementsByClassName('select-filter-category')[0].value

        card = document.getElementsByClassName('card');
        if (hideEmptyJourneys  === true){
          for (i = 0; i < card.length; i++) {
            journeyEmpty = card[i].getElementsByClassName("bg-danger")[0]
            authorTxtValue = card[i].getElementsByClassName("author-name")[0].innerHTML
            journeyTitleTxtValue = card[i].getElementsByClassName("card-title")[0].innerHTML
            categoryValue = card[i].getElementsByClassName("category-name")[0]

            if (categoryValue){
              categoryTxtValue = categoryValue.innerHTML
            }



            if (journeyEmpty){
              journeyEmptyTxtValue = journeyEmpty.innerHTML.toLowerCase()
            

            if (journeyEmptyTxtValue.indexOf("empty")>-1){
              card[i].parentElement.style.position="absolute"
              card[i].parentElement.style.visibility = 'hidden'
              card[i].parentElement.style.left = '-999em'
              }
          }
          }
        }
        else if (hideEmptyJourneys  === false){

          for (i = 0; i < card.length; i++) {
            journeyEmpty = card[i].getElementsByClassName("bg-danger")[0]
            authorTxtValue = card[i].getElementsByClassName("author-name")[0].innerHTML
            journeyTitleTxtValue = card[i].getElementsByClassName("card-title")[0].innerHTML.toLowerCase()
            categoryValue = card[i].getElementsByClassName("category-name")[0]
            if (categoryValue){
              categoryTxtValue = categoryValue.innerHTML
            }
            if(journeyEmpty){
              journeyEmptyTxtValue = journeyEmpty.innerHTML.toLowerCase()
            }

            
              if ((authorTxtValue.indexOf(authorFilter) > -1 || authorFilter === 'all' ) && (journeyTitleTxtValue.indexOf(journeyTitleFilter)>-1 || journeyTitleFilter==='' ) && ((categoryValue && categoryTxtValue.indexOf(categoryFilter)>-1) || categoryFilter === 'all')){ 
                card[i].parentElement.style.position = 'static'
                card[i].parentElement.style.display = "block"
                card[i].parentElement.style.visibility = 'visible'
              }
              else if ((authorTxtValue.indexOf(authorFilter) >-1 || authorFilter==="all") && (journeyTitleTxtValue.toLowerCase().indexOf(journeyTitleFilter) > -1 || journeyTitleFilter === '') && hideEmptyJourneys === false && ((categoryValue && categoryTxtValue.indexOf(categoryFilter)>-1) || categoryFilter === 'all')){
              card[i].parentElement.style.position = 'static'
              card[i].parentElement.style.display = "block"
              card[i].parentElement.style.visibility = 'visible'
            }
            else if(journeyEmpty && (journeyEmptyTxtValue.indexOf('empty')>-1 && hideEmptyJourneys === true) && (categoryTxtValue.indexOf(categoryFilter)<=-1)){
                card[i].parentElement.style.position="absolute"
                card[i].parentElement.style.visibility = 'hidden'
                card[i].parentElement.style.left = '-999em'
            }
            else{
              card[i].parentElement.style.position="absolute"
              card[i].parentElement.style.visibility = 'hidden'
              card[i].parentElement.style.left = '-999em'
            }
          }
        }
      }





      const handleFilterByCategory = (e)=>{
        let categoryFilterName = e.target.value
        let authorFilterName = document.getElementsByClassName('select-filter-author')[0].value
        let checkedState = document.getElementsByClassName('checkbox-filter')[0].checked
        let journeyTitleFilter  = document.getElementsByClassName('select-filter-title')[0].value.toLowerCase()



        
          // Declare variables
          let categoryName, txtValue, card,i, journeyCategory, journeyCategoryTxtValue, journeyTitle, journeyAuthor, emptyJourney, emptyJourneyTxtValue, journeyTitleTxtValue, authorTxtValue;

          card = document.getElementsByClassName('card');
          // Loop through all list items, and hide those who don't match the search query
          for (i = 0; i < card.length; i++) {
            journeyTitle = card[i].getElementsByClassName("card-title")[0]
            journeyAuthor = card[i].getElementsByClassName('author-name')[0]
            emptyJourney = card[i].getElementsByClassName("bg-danger")[0]
            journeyCategory = card[i].getElementsByClassName("category-name")[0]
            
            if (journeyCategory){
              journeyCategoryTxtValue = journeyCategory.innerHTML
            }
            if (emptyJourney){
             emptyJourneyTxtValue =  emptyJourney.innerHTML.toLowerCase()
            }
            journeyTitleTxtValue = journeyTitle.innerHTML.toLowerCase()
            authorTxtValue = journeyAuthor.innerHTML
            if ((authorTxtValue.indexOf(authorFilterName) >-1 || authorFilterName==="all") && (journeyTitleTxtValue.toLowerCase().indexOf(journeyTitleFilter) > -1 || journeyTitleFilter === '') && (!emptyJourney && checkedState === true) && ((journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilterName)>-1) || categoryFilterName === 'all')){
              
              card[i].parentElement.style.position = 'static'
              card[i].parentElement.style.display = "block"
              card[i].parentElement.style.visibility = 'visible'
            }
            else if ((authorTxtValue.indexOf(authorFilterName) >-1 || authorFilterName==="all") && (journeyTitleTxtValue.toLowerCase().indexOf(journeyTitleFilter) > -1 || journeyTitleFilter === '') && checkedState === false && ((journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilterName)>-1) || categoryFilterName === 'all')){
              card[i].parentElement.style.position = 'static'
              card[i].parentElement.style.display = "block"
              card[i].parentElement.style.visibility = 'visible'
            }
            else if(emptyJourney && (emptyJourneyTxtValue.indexOf('empty')>-1 && checkedState === true) && (journeyCategory && journeyCategoryTxtValue.indexOf(categoryFilterName)<=-1)){
                card[i].parentElement.style.position="absolute"
                card[i].parentElement.style.visibility = 'hidden'
                card[i].parentElement.style.left = '-999em'
            }
            else{
              card[i].parentElement.style.position="absolute"
              card[i].parentElement.style.visibility = 'hidden'
              card[i].parentElement.style.left = '-999em'
            }
        
      }
      }

    

      

    useEffect(()=>{
        async function fetchData(){
          
          await  axios.get(`${API_ROUTE}/api/journeys`)
            .then(async (journeysArray)=>{
              let users = await axios.get(`${API_ROUTE}/api/users`)
              setUsersArrayDisplay(users.data.users)
                let journeysArrayReceived = journeysArray.data.publicJourneys
                let pushedCategories = []
               let newArray = journeysArrayReceived.map((journey,index)=>{
                  let counter=0
                  let creationDate = journey.createdAt
                  let creationDateMillisecondsLength = new Date(creationDate).getTime()
                  let updatedDate = journey.updatedAt
                  let updatedDateMillisecondsLength = new Date(updatedDate).getTime()
                  journey.dateCreated = creationDateMillisecondsLength
                  journey.dateUpdated = updatedDateMillisecondsLength

                 
                
                  if(journey.category){
                  if (pushedCategories.indexOf(journey.category) < 0){
                    pushedCategories.push(journey.category)
                  }
                }
                setCategories(pushedCategories)
                  journey.blocks.map(block=>{
                    if (block.steps){
                    counter += block.steps.length
                    return counter }
                    else {counter +=0 
                    return counter}
                  })
                  journey.stepsLength = counter
                  return journey
                })
                await setAllPublicJourneys(newArray)
                setTimeout(()=>{
                  setIsLoading(false)
                },1000)  
            })
            .catch(err=>console.log(err))
        }
        fetchData()
         
    }, [])

    
    let showBlocks;
    return(
        <div className='centered-journeys'>
        
      {isLoading && 
        <div className="d-flex justify-content-center">  
          <div style={{marginTop: '150px'}} className='text-center'>
            <div className="spinner-border spinner-border-lg">
                <span className="sr-only"></span>
            </div>
          </div>
        </div>}

        {!isLoading && <div>
          <h1>Filter by:</h1>
          <div>
              <label>Author <select className='select-filter-author' onChange={(e)=>handleFilterByName(e)}>
              <option value="all">Show All</option>
                {usersArrayDisplay && usersArrayDisplay.map(user=>{
                  return <option value={user.username.charAt(0).toUpperCase()+user.username.slice(1)}>{user.username.charAt(0).toUpperCase()+user.username.slice(1)}</option>
                })}
              </select> </label>
              </div>
              <div>
              <label>Category <select id='selector-category' className='select-filter-category' onChange={(e)=>handleFilterByCategory(e)}>
              <option value="all">Show All</option>
                {categories && categories.map(category=>{
                  return <option value={category}>{category}</option>
                })}
              </select> </label>
              </div>
              <div>
               <label> Journey Title:<input className='select-filter-title' type="text" onChange={(e)=>handleFilterByTitle(e)} placeholder="Search for journey name.."/></label>
              </div>
              <div>
              <label>Filter Empty Journeys ? <input className='checkbox-filter' onChange={(e)=>handleFilterByEmptyness(e)} type="checkbox"/></label>
              </div>
        </div>}
        {!isLoading && allPublicJourneys.map((journey,index)=>{
            return ( <div key={journey._id}>
            <div>
              
              </div>
            <div className="card" key={journey._id}> 
                    <img className="min-height card-img-top" src={journey.image} alt={journey.title}/>
                <div className="card-body">
                
                    <h5 className="card-title">{journey.title}{(todayMilliseconds - journey.dateCreated<twoDaysMilliseconds) && <span class="badge bg-warning new-badge">New</span>}{(todayMilliseconds - journey.dateUpdated<twoDaysMilliseconds) && <span class="badge bg-success new-badge">Recently Updated</span>}{journey.stepsLength === 0 && <span class="badge bg-danger new-badge">Empty Journey</span>}</h5> 
                    <div className='flex-col'>
                    <p className='btn btn-outline-primary like'><span className='bold'>{journey.upvoteUsers ? journey.upvoteUsers.length : "0"}</span> Upvotes</p> 
                    {user && <button  onClick={(e)=>likeJourney(e)} value={journey.upvoteUsers && journey.upvoteUsers.includes(user._id)}  type="button" className="btn btn-primary btn-sm"><i data-journeyid={journey._id}  className={journey.upvoteUsers && journey.upvoteUsers.includes(user._id) ? "bi bi-balloon-heart-fill": "bi bi-balloon-heart fa-beat"}> {journey.upvoteUsers && journey.upvoteUsers.includes(user._id)? "Upvoted" : "Upvote Here"} </i></button>}
                    </div>
                    <p className="card-text">{journey.description}</p>
                    {!user && <p>Created by: <Link className='author-name' to={`/profile/${journey.author._id}`}> {journey.author.username.charAt(0).toUpperCase() + journey.author.username.slice(1)}</Link> </p>}
                    {user && <p>Created by: {user._id !== journey.author._id ? <Link className='author-name' to={`/profile/${journey.author._id}`}> {journey.author.username.charAt(0).toUpperCase() + journey.author.username.slice(1)}</Link> : <Link className='author-name' to={`/profile/`}> {journey.author.username.charAt(0).toUpperCase()+journey.author.username.slice(1)}</Link> }</p>}
                    <p>Learning Blocks: {journey.blocks.length}</p>
                    <p>Total Steps: {journey.stepsLength}</p>
                  {journey.category && <div><p className='no-m'>Category:</p><h6 className="btn-outline-dark category sized journey-category smaller category-name ">{journey.category}</h6></div>}
                    {journey.tags.length !==0 && <div>
                      {journey.tags && <p>Tags:</p>}
                      <div className='tags-flex'>
                      {journey.tags.length!==0 && journey.tags.map(tag=>{
                        if (tag){
                          if (tag.length>2){
                        return <p className='btn btn-outline-primary tagged'>{tag}</p>
                      }} return
                      })}
                      </div>
                    </div>}
                    
                </div>
                
                {journey.blocks.length !==0  && <button className='show-blocks btn btn-info' value={showBlocks} onClick={() => toggleBlocks(index)} > Show/Hide Blocks </button>}
             {journey.showBlocks  && <ul className="list-group list-group-flush">
             {allPublicJourneys[index].blocks.map(block=>{
                return (
                    <li className="list-group-item">
                    <p className='bold underline'>{block.title}</p>
                    <p className='italic'>Number of Steps : {block.steps.length}</p>
                    {!user && <div>{block.steps.length!==0 && <button className='btn btn-outline-warning'> <Link to={`/journeys/${journey._id}/${block._id}`}> Check Block</Link> </button>}</div>}
                    {user && <div>{block.steps.length!==0 && <button className='btn btn-outline-warning'>{user._id === journey.author._id ? <Link to={`/profile/journeys/${journey._id}`}> Edit Block</Link> : <Link to={`/journeys/${journey._id}/${block._id}`}> Check Block</Link> }</button>}</div>}
                    </li>
                )
             })}
             </ul>}
             
             <div className="card-body">
             <br/>
             {!user && <div>
               <Link to={`/journeys/${journey._id}`}>
               <button href="#" className="btn btn-warning card-link">Check Journey</button>
               </Link>
               </div>}

             {user && <div>
             {user._id === journey.author._id ? 
             <Link to={`/profile/journeys/${journey._id}`}>
               <button href="#" className="btn btn-warning card-link">Edit My Journey</button>
               </Link>
               : 
               <Link to={`/journeys/${journey._id}`}>
               <button href="#" className="btn btn-warning card-link">Check Journey</button>
               </Link>
               }
               </div>}
             </div>
            </div>
            </div>)
        })}
            
    
        </div> 
    )
}

export default PublicJourneysPage