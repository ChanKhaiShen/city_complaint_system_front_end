import { useState } from 'react';
import axios from 'axios';
import md5 from 'md5';

import env from 'react-dotenv';

import Register from './Register';
import './Styles.css';

export default function Login({setHasToken}) {
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [emailAddressError, setEmailAddressError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [isRegistered, setRegistered] = useState(true);   // If true, then will render login page; else if false, then will render register page

    function handleChange(event) {
        if (event.target.name === 'emailAddress') {
            const emailAddress = event.target.value;
            setEmailAddress(emailAddress);
            if (emailAddress.trim().length === 0)
                setEmailAddressError('Please enter email address');
            else
                setEmailAddressError('');
        } else {
            const password = event.target.value;
            setPassword(password);
            if (password.trim().length === 0)
                setPasswordError('Please enter password');
            else
                setPasswordError('');
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const hashedPassword = md5(password);
        console.log('Login', emailAddress, password, hashedPassword);

        axios.post(`${env.SERVER_URL}/login`, 
            {
                emailAddress: emailAddress,
                password: hashedPassword
            }, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(response => {
            console.log('Login', response.data.user);
            localStorage.setItem('emailAddress', response.data.user.emailAddress);
            localStorage.setItem('name', response.data.user.name);
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem('token', response.data.user.token);
            setHasToken(true);
        }).catch(error => {
            console.log(error);
            if (error.response != null && (error.response.status === 400 || error.response.status === 401))
                alert(error.response.data.message);
            else
                alert('Login fail');
        });
    }

    function goToRegister() {
        setRegistered(false);
    }

    if (isRegistered === false) {
        return (
            <Register setRegistered={setRegistered}/>
        );
    }

    return (
        <>
            <div className='TopBar'>
                <h1>City Complaint System</h1>
            </div>
        
            <div className="Content">
                <h1>Login</h1>
                
                <section className="Box">
                    <form onSubmit={handleSubmit}>
                        <label className="FormContent">Email Address:
                            <p/>
                            <input
                                required
                                maxLength={70}
                                size={70}
                                type="text"
                                placeholder='Email Address'
                                name="emailAddress"
                                value={emailAddress}
                                onChange={handleChange}
                            ></input>
                            <p className='Error'>{emailAddressError}</p>
                        </label>

                        <p/>
                        <label className="FormContent">Password:
                            <p/>
                            <input
                                required
                                maxLength={20}
                                size={20}
                                type="password"
                                placeholder='Password'
                                name="password"
                                value={password}
                                onChange={handleChange}
                            ></input>
                            <p className='Error'>{passwordError}</p>
                        </label>

                        <p/>
                        <input 
                            className="SubmitButton"
                            type="submit" 
                            value="Login" 
                            >
                        </input>
                    </form>
                </section>

                <p/>
                <div className='SwitchPage'>
                    <h5>Not yet registered? </h5>
                    <button onClick={goToRegister}>Register</button>
                </div>

                <p/>
                <a href='/setpassword'>Forgot password?</a>
            </div>
        </>
    );
}
