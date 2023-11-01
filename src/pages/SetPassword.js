import { useState } from "react";
import axios from "axios";
import md5 from "md5";

import env from "react-dotenv";

import './Styles.css';

export default function SetPassword() {
    const [emailAddress, setEmailAddress] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');

    const [emailAddressError, setEmailAddressError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [isOtpSent, setOtpSent] = useState(false);

    function handleChange(event) {
        if (event.target.name === 'emailAddress') {
            const emailAddress = event.target.value;
            setEmailAddress(emailAddress);

            if (emailAddress.trim().length === 0)
                setEmailAddressError('Please enter email address');
            else
                setEmailAddressError('');
        }
        else if (event.target.name === 'otp') {
            const otp = event.target.value;
            setOtp(otp);

            if (otp.trim().length === 0)
                setOtpError('Please enter OTP');
            else
                setOtpError('');
        }
        else if (event.target.name === 'password') {
            const password = event.target.value;
            setPassword(password);

            if (password.trim().length === 0)
                setPasswordError("Cannot be empty");
            else if (password.trim().length > 20)
                setPasswordError("Cannot exceed 20 characters");
            else if (/[\s]+/.test(password))
                setPasswordError("Cannot have white space");
            else {
                var errorMessage = "";
                    
                if (!/[0-9]+/.test(password))
                    errorMessage = "Must have digit";
                if (!/[a-z]+/.test(password))
                    errorMessage += errorMessage===""?"Must have lower case alphabet":", lower case alphabet";
                if (!/[A-Z]+/.test(password))
                    errorMessage += errorMessage===""?"Must have upper case alphabet":", upper case alphabet";
                if (!/[!|@|#|$|%|^|&|*|(|)|+|-|?|.|,]+/.test(password))
                    errorMessage += errorMessage===""?"Must have special character":", special character";
                if (!/.{12,20}/.test(password))
                    errorMessage += errorMessage===""?"Must have length 12-20":", length 12-20";
                    
                setPasswordError(errorMessage);
            }
        }
    }

    function sendOtp(event) {
        event.preventDefault();

        if (emailAddressError !== '')
            return;

        if (emailAddress.trim() === '') {
            alert('Please fill in the required fields (email address)');
            return;
        }

        console.log('send otp', emailAddress);
        axios.post(`${env.SERVER_URL}/sendotp/setpassword`,
        {
            emailAddress: emailAddress,
        },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        ).then(response=>{
            console.log('send otp', response);
            setOtpSent(true);
        }).catch(error=>{
            console.log('send otp error', error);

            if (error.response != null && error.response.status === 400)
                alert(error.response.data.message);
            else
                alert('Email verification fail')
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (emailAddressError !== '' || otpError !== '' || passwordError !== '') 
            return;

        if (emailAddress.trim() === '' || otp.trim() === '' || password.trim() === '') {
            alert('Please fill in the required fields (email address, otp, password)');
            return;
        }

        const hashedPassword = md5(password);
        console.log('set password', emailAddress, password, hashedPassword, otp);

        axios.post(
            `${env.SERVER_URL}/setpassword`,
            {
                emailAddress: emailAddress,
                password: hashedPassword,
                otp: otp
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(response=>{
            console.log('set password', response);
            window.location.replace('/');
        }).catch(error=>{
            console.log(error);
            if (error.response != null && (error.response.status === 400))
                alert(error.response.data.message);
            else
                alert('Set password fail');
        });
    }

    function goToLogin() {
        window.location.replace('/');
    }

    return (
        <>
            <div className='TopBar'>
                <h1>City Complaint System</h1>
            </div>

            <div className="Content">
                <h1>Set Password</h1>

                <section className="Box">
                    <form onSubmit={handleSubmit}>
                        <label className="FormContent">Email Address:
                            <p/>
                            <input
                                required
                                type="text"
                                maxLength={70}
                                size={70}
                                placeholder="Email Address"
                                name="emailAddress"
                                value={emailAddress}
                                onChange={handleChange}
                            ></input>
                            <p className="Error">{emailAddressError}</p>
                        </label>

                        {isOtpSent === false &&
                            <>
                                <p/>
                                <button className="SubmitButton" onClick={sendOtp}>Send OTP</button>
                            </>
                        }

                        {isOtpSent === true &&
                            <>
                                <p/>
                                <label className="FormContent">OTP:
                                    &nbsp;  {/* blank space */}
                                    <input
                                        required
                                        type="text"
                                        maxLength={6}
                                        size={6}
                                        name="otp"
                                        value={otp}
                                        onChange={handleChange}
                                    ></input>
                                    &nbsp;
                                    <button className="SubmitButton" onClick={sendOtp}>Resend OTP</button>
                                    <p className="Error">{otpError}</p>
                                </label>

                                <p/>     
                                <label className="FormContent">New Password:
                                    &nbsp;
                                    <input
                                        required
                                        type="password"
                                        maxLength={20}
                                        size={20}
                                        placeholder="New Password"
                                        name="password"
                                        value={password}
                                        onChange={handleChange}
                                    ></input>
                                    &nbsp;
                                    <input
                                        type="submit"
                                        className="SubmitButton"
                                        value='Set Password'
                                    ></input>
                                    <p className="Error">{passwordError}</p>
                                </label>
                            </>
                        }

                        <p/>
                        <button className='SubmitButton' onClick={goToLogin}>Go To Login Page</button>
                    </form>
                </section>
            </div>
        </>
    );
}
