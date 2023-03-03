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
  const { storeToken, authenticateUser } = useContext(AuthContext);
 
  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);
  
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const loggedUser = {email, password};
    axios.post(`${API_ROUTE}/auth/login`, loggedUser)
        .then(response => {
            storeToken(response.data.authToken);
            authenticateUser();
            navigate('/profile');
        })
        .catch(err => setErrorMessage(err.response.data.message));
  };
  
  return (
    <div className="login-form">
      <h1>Welcome!</h1>
 
      <form onSubmit={handleLoginSubmit}>
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
            type="password"
            name="password"
            value={password}
            placeholder="password"
            onChange={handlePassword}
          />
          <label>Password:</label>
        </div>
 
        <button className='btn btn-success create-journey' type="submit">Login</button>
      </form>
      { errorMessage && <p className="error-message">{errorMessage}</p> }
    
      <div className="signup-link">
        <p>Don't have an account yet?</p>
        <Link to={"/sign-up"}> Sign Up</Link>
      </div>
    </div>
  )
}

export default LoginPage;