import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function HomePage(){


  const { isLoggedIn, logoutUser } = useContext(AuthContext)


    return(
        <div>
            

           
    
    <Link to={"/journeys"}>
      <button>Create a Journey</button>
    </Link>

    {!isLoggedIn && 
      <>
        <Link to={"/sign-up"}>
          <button>Sign Up</button>
        </Link>

        <Link to={"/log-in"}>
          <button>Log In</button>
        </Link> 
      </>
    }
   
    {isLoggedIn && <button onClick={logoutUser}>Log Out</button>} 
        </div>
    
    )

}

export default HomePage