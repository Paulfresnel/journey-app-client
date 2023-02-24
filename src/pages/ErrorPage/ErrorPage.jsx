import { useContext } from "react"
import { AuthContext } from "../../context/auth.context"
import { Link } from "react-router-dom"
import './ErrorPage.css'


function ErrorPage(){

    const {user} = useContext(AuthContext)

    return(
        <div className="error-div">
        <img className="adjusted" src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"/>
    
    <p className="error">You have reached an unacesible page<i style={{fontSize:'2rem', color:"red"}} class="bi bi-cone-striped"></i></p>
    <p className="error"> Click <Link to={"/"}> Here </Link>to return to the HomePage</p>
    <p className="error"> Or you can go to your <Link to={"/profile"}>profile page</Link></p>
    <p className="error">You can also <Link to={-1}> go back </Link>to your previous  Page   </p>
        </div>
        
    )
}

export default ErrorPage