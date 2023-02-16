import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function HomePage(){


  const { isLoggedIn, logoutUser } = useContext(AuthContext)


    return(
        <div>
            

    <Link to={"blocks/63e779d2a9978c010d5502dc/edit"}>
      <button>Create a New Step</button>
    </Link>

    <Link to={"/blocks"}>
      <button>Create a Block</button>
    </Link>
    
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