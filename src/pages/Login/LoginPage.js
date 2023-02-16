import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
 
const API_ROUTE = process.env.REACT_APP_SERVER_URL;
 
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  
  const navigate = useNavigate();
  const { user, storeToken, authenticateUser } = useContext(AuthContext);
 
  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);
  
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const loggedUser = {email, password};
    axios.post(`${API_ROUTE}/auth/login`, loggedUser)
        .then(response => {
            storeToken(response.data.authToken);
            authenticateUser();
            console.log("login response")
            console.log(response)

            navigate('/profile');
        })
        .catch(err => setErrorMessage(err.response.data.message));
  };
  
  return (
    <div>
      <h1>Login</h1>
 
      <form onSubmit={handleLoginSubmit}>
        <label>Email:</label>
        <input 
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
        />
 
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
 
        <button type="submit">Login</button>
      </form>
      { errorMessage && <p>{errorMessage}</p> }
 
      <p>Don't have an account yet?</p>
      <Link to={"/sign-up"}> Sign Up</Link>
    </div>
  )
}

export default LoginPage;