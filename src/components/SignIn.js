import React from 'react';
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

const SignIn = (props) => {
    let history = useNavigate();
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""});

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const {name, email, password} = credentials
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({name, email, password})
          })
          const json = await response.json()

          if (json.success) {
            localStorage.setItem('token', json.authtoken);
            history("/")
            props.showAlert("Account Created Successfully", "success")
          }
          else{
            props.showAlert("Invalid details", "danger")
          }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
      }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">User Name</label>
            <input type="text" className="form-control" onChange={onChange} id="name" name='name' aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" onChange={onChange} id="email" name='email' aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" onChange={onChange} minLength={5} required id="password" name='password' />
        </div>
        <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="cpassword" className="form-control" onChange={onChange} minLength={5} required id="cpassword" name='cpassword' />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
       </form>
    </div>
  );
}

export default SignIn;