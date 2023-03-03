import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupPage.css"
 
const API_ROUTE = process.env.REACT_APP_SERVER_URL;
 
 
function SignupPage() {
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
    <div className="login-form">
        <h1>Welcome!</h1>
        <form onSubmit={handleSignupSubmit}>
          <div className='form-floating mb-3'>
            <input 
              className='form-control'
              type="email"
              name="email"
              value={email}
              placeholder="email"
              onChange={handleEmail}
            />
            <label>Email:</label>
          </div>


        <div className='form-floating mb-3'>
            <input 
              className='form-control'
              type="text"
              name="username"
              value={username}
              placeholder="username"
              onChange={handleuserName}
            />
            <label>Username:</label>
          </div>
  
          <div className='form-floating mb-3'>
            <input 
              className='form-control'
              type="password"
              name="password"
              value={password}
              placeholder="password"
              onChange={handlePassword}
            />
            <label>Password:</label>
          </div>
  
          <button className='btn btn-success create-journey' type="submit">Sign Up</button>
          <br/>
        </form>
  
        { errorMessage && <p className="error-message">{errorMessage}</p> }
      
        <div className="signup-link">
          <p>Already have account?</p>
          <Link to={"/log-in"}> Login</Link>
        </div>
    </div>
  )
}
 
export default SignupPage;