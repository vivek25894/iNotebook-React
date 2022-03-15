import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            navigate("/");
            props.showAlert("Account created successfully", "success");
        } else {
            props.showAlert("Invalid Details", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className='container mt-3'>
            <h1 className='mb-4'>Create an Account to use iNotebook</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" onChange={onChange} value={credentials.name} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name="email" onChange={onChange} value={credentials.email} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} value={credentials.password} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} value={credentials.cpassword} minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    )
}

export default Signup
