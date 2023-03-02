import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/auth.context"
import './Header.css'
import { useNavigate } from "react-router-dom"


function Header(){
    const navigate = useNavigate()
    
    const {user, isLoggedIn, logoutUser} = useContext(AuthContext)

    
    return (
        <div className="header-div">
          <nav className="navbar navbar-expand-lg navbar-light">
            <a className="navbar-brand" href="/"><span className="emphasized">S</span>kill  Road </a>
            <button className="navbar-toggler border-black" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse " id="navbarNav" style={{marginTop: '10px'}}>
              <ul className="navbar-nav">
                <i class="bi bi-mortarboard"></i>
                <li className="nav-item active nav-link">
                  <Link to={"/"}>
                    <p className="nav-link">Home</p> 
                  </Link>
                </li>

                {isLoggedIn && <li className="nav-item ">
                  <Link to={"/profile"}>
                    <p className="nav-link">My Profile</p>
                  </Link>
                </li>} 
                
                <li className="nav-item nav-link">
                  <Link to={"/journeys"}>
                    <p className="nav-link">Check Public Journeys</p> 
                  </Link>
                </li>

                <li className="nav-item nav-link">
                  <Link to={"/leaderboard"}>
                    <p className="nav-link">Global Leaderboard</p> 
                  </Link>
                </li> 

                {!isLoggedIn && <li className="nav-item ">
                
                  <p className="nav-link"><Link to={"/sign-up"}>Sign Up</Link> /  <Link to={"/log-in"}>Log In </Link></p>
                  <p className="nav-link"> </p>
                  
                </li>}

                {isLoggedIn && 
                  <li>
                    <p className="nav-link"><Link onClick={() => logoutUser()}>Log Out</Link></p>
                  </li>
                }
              </ul>
            </div>
          </nav>
        </div>
  )
}

export default Header