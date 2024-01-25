import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify';

export default function SignUp() {
    const navigate = useNavigate()
    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
        }
    }, [formErrors, formValues, isSubmit]);

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.username) {
            errors.username = "Username is required!";
        }
        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
        } else if (values.password.length > 10) {
            errors.password = "Password cannot exceed more than 10 characters";
        }
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Those passwords didn't match. Try again.";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        let errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!formValues.username) {
            errors.username = "Username is required!";
            toast.error("Username is required!")
        }
        if (!formValues.email) {
            errors.email = "Email is required!";
            toast.error("Email is required!")
        } else if (!regex.test(formValues.email)) {
            errors.email = "This is not a valid email format!";
            toast.error("This is not a valid email format!")
        }
        if (!formValues.password) {
            errors.password = "Password is required";
            toast.error("Password is required")
        } else if (formValues.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
            toast.error("Password must be more than 4 characters")
        }
        if (formValues.password !== formValues.confirmPassword) {
            errors.confirmPassword = "Those passwords didn't match. Try again.";
            toast.error("Those passwords didn't match. Try again.")
        }
        e.preventDefault()
        if (errors.confirmPassword || errors.email || errors.password || errors.username) {
        } else {
            axios.post('http://127.0.0.1:5000/register', {
                'username': formValues.username,
                'email': formValues.email,
                'password': formValues.password
            }).then(res => {
                console.log(res)
                localStorage.setItem("userId", res.data.id)
                navigate('/home')
                window.location.reload()

            }).catch(err => {
                console.log(err)
                toast.error(err.response.data.message)
            })
        }
    }

    return (
        <main className='main'>
            <div className="bgImg"></div>
            <div className="container">
                {Object.keys(formErrors).length === 0 && isSubmit ? (
                    <div className="ui message success">
                        Signed in successfully
                    </div>
                ) : (
                    console.log("Entered Details", formValues)
                )}

                <form onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    <div className="ui divider"></div>
                    <div className="ui form">
                        <div className="field">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={formValues.username}
                                onChange={handleChange}
                                className='input'
                            />
                        </div>
                        <p className='error'>{formErrors.username}</p>
                        <div className="field">
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={formValues.email}
                                onChange={handleChange}
                                className='input'
                            />
                        </div>
                        <p className='error'>{formErrors.email}</p>
                        <div className="field">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formValues.password}
                                onChange={handleChange}
                                className='input'
                            />
                        </div>
                        <p className='error'>{formErrors.password}</p>
                        <div className="field">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formValues.confirmPassword}
                                onChange={handleChange}
                                className='input'
                            />
                        </div>
                        <p className='error'>{formErrors.confirmPassword}</p>
                        <button className="fluid ui button blue submit">Submit</button>
                    </div>
                </form>
                <div className="text" onClick={() => navigate('/login')}>
                    Already have an account? <span className='login__text'>Login</span>
                </div>
            </div>
        </main>
    )
}
