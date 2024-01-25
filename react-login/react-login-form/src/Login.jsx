import { useState, useEffect } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";

function Login() {
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

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://127.0.0.1:5000/login', {
            'email': formValues.email,
            'password': formValues.password
        }).then(res => {
            localStorage.setItem("userId", res.data.id)
            navigate('/home')
            window.location.reload()
        }).catch(err => {
            console.log(err)
            toast.error(err.response.data.message)
        })
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
        }
    }, [formErrors, formValues, isSubmit]);

    return (
        <main className="main">
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
                    <h1>Login</h1>
                    <div className="ui divider"></div>
                    <div className="ui form">
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
                        <button className="fluid ui button blue submit">Submit</button>
                    </div>
                </form>
                <div className="text" onClick={() => navigate('/signup')}>
                    Don't have an account? <span className='login__text'>Sign Up</span>
                </div>
            </div>{" "}
        </main>
    );
}

export default Login;
