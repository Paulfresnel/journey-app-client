import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
 
const API_ROUTE = process.env.REACT_APP_SERVER_URL;
 
 
function SignupPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
 
  const navigate = useNavigate();
  
  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);
  const handleuserName = (event) => setUsername(event.target.value);
  const handleSignupSubmit = (event) => {
    event.preventDefault();
    const newUser = {email, username, password};

    axios.post(`${API_ROUTE}/auth/signup`, newUser)
      .then(() => navigate('/log-in'))
      .catch(err => setErrorMessage(err.response.data.message));
  };
 
  
  return (
    <div>
      <h1>Sign Up</h1>
 
      <form onSubmit={handleSignupSubmit}>
        <label>Email:</label>
        <input 
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
        />
        <br/>

        <label>Userame:</label>
        <input 
          type="text"
          name="username"
          value={username}
          onChange={handleuserName}
        />
        <br/>
 
        <label>Password:</label>
        <input 
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
        <br/>
 
        <button type="submit">Sign Up</button>
        <br/>
      </form>
 
      { errorMessage && <p className="error-message">{errorMessage}</p> }
 
      <p>Already have account?</p>
      <Link to={"/log-in"}> Login</Link>
    </div>
  )
}
 
export default SignupPage;