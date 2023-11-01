import { useState } from 'react';
import axios from 'axios';
import md5 from 'md5';

import env from 'react-dotenv';

import './Styles.css';

export default function Register({setRegistered}) {
    // Field
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [IC_Number, setIC_Number] = useState("");
    const [mobilePhoneNumber, setMobilePhoneNumber] = useState("");
    const [homeAddress, setHomeAddress] = useState("");
    const [faxNumber, setFaxNumber] = useState("");
    const [otp, setOtp] = useState("");

    // Error message
    const [emailAddressError, setEmailAddressError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [IC_NumberError, setIC_NumberError] = useState("");
    const [mobilePhoneNumberError, setMobilePhoneNumberError] = useState("");
    const [homeAddressError, setHomeAddressError] = useState("");
    const [faxNumberError, setFaxNumberError] = useState("");
    const [otpError, setOtpError] = useState("");

    // For control purpose
    const [isOtpSent, setOtpSent] = useState(false);    // if true, then the otp field will appear
    const [isRegistrationDone, setRegistrationDone] = useState(false);  // if true, then the registration done message will appear
 
    function handleChange(event) {
        switch(event.target.name) {
            case "emailAddress":
                const emailAddress = event.target.value;
                setEmailAddress(emailAddress);
                if (emailAddress.trim().length === 0) 
                    setEmailAddressError("Cannot be empty");
                else if (emailAddress.length > 70)
                    setEmailAddressError("Cannot exceed 70 characters");
                else if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)))
                    setEmailAddressError("Please provide proper email address");
                else
                    setEmailAddressError("");
                break;
            
            case "password":
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
                break;
                
            case "name":
                const name = event.target.value;
                setName(name);

                if (name.trim().length === 0) 
                    setNameError("Cannot be empty");
                else if (name.trim().length > 50)
                    setNameError("Cannot exceed 50 characters");
                else
                    setNameError("");
                break;
            
            case "IC_Number":
                const IC_Number = event.target.value;
                setIC_Number(IC_Number);

                if (IC_Number.trim().length === 0) 
                    setIC_NumberError("Cannot be empty");
                else if (IC_Number.trim().length > 20)
                    setIC_NumberError("Cannot exceed 20 characters");
                else
                    setIC_NumberError("");
                break;
            
            case "mobilePhoneNumber":
                const mobilePhoneNumber = event.target.value;
                setMobilePhoneNumber(mobilePhoneNumber);

                if (mobilePhoneNumber.trim().length === 0) 
                    setMobilePhoneNumberError("Cannot be empty");
                else if (mobilePhoneNumber.trim().length > 20)
                    setMobilePhoneNumberError("Cannot exceed 20 characters");
                else if (!(/^[+]?[0-9]+[-]?[0-9]+[\s]?[0-9]+$/.test(mobilePhoneNumber)))
                    setMobilePhoneNumberError("Please provide proper mobile phone number");
                else
                    setMobilePhoneNumberError("");
                break;
            
            case "homeAddress":
                const homeAddress = event.target.value;
                setHomeAddress(homeAddress);

                if (homeAddress.trim().length > 100)
                    setHomeAddressError("Cannot exceed 100 characters");
                else
                    setHomeAddressError("");
                break;
            
            case "faxNumber":
                const faxNumber = event.target.value;
                setFaxNumber(faxNumber);

                if (faxNumber.trim().length > 20)
                    setFaxNumberError("Cannot exceed 20 characters");
                else
                    setFaxNumberError("");
                break;
            
            case "otp":
                const otp = event.target.value;
                setOtp(otp);

                if (otp.trim().length === 0)
                    setOtpError('Please enter OTP');
                else
                    setOtpError('');
                break;
            
            default:
                // No default
        }
    }

    function sendOtp(event) {
        event.preventDefault();

        if (emailAddressError !== '' || passwordError !== '' || nameError !== '' || IC_NumberError !== '' || mobilePhoneNumberError !== '' || homeAddressError !== '' || faxNumberError !== '')
            return;

        if (emailAddress.trim() === '' || password.trim() === '' || name.trim() === '' || IC_Number.trim() === '' || mobilePhoneNumber.trim() === '') {
            alert('Please fill in the required fields (email address, password, name, IC number, mobile phone number)');
            return;
        }

        console.log('send otp', emailAddress, name);
        axios.post(`${env.SERVER_URL}/sendotp/register`,
        {
            emailAddress: emailAddress,
            name: name
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

        if (emailAddressError !== '' || passwordError !== '' || nameError !== '' || IC_NumberError !== '' || mobilePhoneNumberError !== '' || homeAddressError !== '' || faxNumberError !== '' || otpError !== '')
            return;

        if (emailAddress.trim() === '' || password.trim() === '' || name.trim() === '' || IC_Number.trim() === '' || mobilePhoneNumber.trim() === '' || otp.trim() === '') {
            alert('Please fill in the required fields (email address, password, name, IC number, mobile phone number, otp)');
            return;
        }

        const hashedPassword = md5(password);
        console.log('Register', emailAddress, password, hashedPassword, name, IC_Number, mobilePhoneNumber, homeAddress, faxNumber, otp);

        axios.post(`${env.SERVER_URL}/register`, 
            {
                emailAddress: emailAddress,
                password: hashedPassword,
                name: name,
                IC_Number: IC_Number,
                mobilePhoneNumber: mobilePhoneNumber,
                homeAddress: homeAddress,
                faxNumber: faxNumber,
                otp: otp
            }, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(response => {
            console.log('Register', response);
            setRegistrationDone(true);
        }).catch(error => {
            console.log(error);
            if (error.response != null && (error.response.status === 400))
                alert(error.response.data.message);
            else
                alert('Registration fail');
        });
    }

    function backToLogin() {
        setRegistered(true);    // This will change the state of isRegistered in login page, so will trigger the re-rendering of login page
    }

    if (isRegistrationDone === true) {
        return (
            <>
                <div className='TopBar'>
                    <h1>City Complaint System</h1>
                </div>

                <div className='Content'>
                    <p/>
                    <section className='Box'>
                        <h1>Registration Done</h1>
                        <h3>Please go back to login page.</h3>
                        <button className='SubmitButton' onClick={backToLogin}>Login</button>
                    </section>
                </div>
            </>
        );
    }

    return (
        <>
            <div className='TopBar'>
                <h1>City Complaint System</h1>
            </div>

            <div className="Content">
                <h1>Complainant Registration</h1>

                <section className="Box">
                    <form onSubmit={handleSubmit}>
                        <label className="FormContent">Email Address:
                            <p/>
                            <input
                                required
                                type="text"
                                maxLength={70}
                                size={70}
                                placeholder='Email Address'
                                name="emailAddress"
                                value={emailAddress}
                                onChange={handleChange}
                            ></input>
                            <p className="Error">{emailAddressError}</p>
                        </label>

                        <p/>
                        <label className="FormContent">Password:
                            <p/>
                            <input
                                required
                                type="password"
                                maxLength={20}
                                size={20}
                                placeholder='Password'
                                name="password"
                                value={password}
                                onChange={handleChange}
                            ></input>
                            <p className="Error">{passwordError}</p>
                        </label>

                        <p/>
                        <label className="FormContent">Name: 
                            <p/>
                            <input
                                required
                                type="text"
                                maxLength={50}
                                size={50}
                                placeholder='Name'
                                name="name"
                                value={name}
                                onChange={handleChange}
                            ></input>
                            <p className="Error">{nameError}</p>
                        </label>

                        <p/>
                        <label className="FormContent">IC Number: 
                            <p/>
                            <input
                                required
                                type="text"
                                maxLength={20}
                                size={20}
                                placeholder='IC Number'
                                name="IC_Number"
                                value={IC_Number}
                                onChange={handleChange}
                            ></input>
                            <p className="Error">{IC_NumberError}</p>
                        </label>

                        <p/>
                        <label className="FormContent">Mobile Phone Number:
                            <p/>
                            <input
                                required
                                type="text"
                                maxLength={20}
                                size={20}
                                placeholder='Mobile Phone Number'
                                name="mobilePhoneNumber"
                                value={mobilePhoneNumber}
                                onChange={handleChange}
                            ></input>
                            <p className="Error">{mobilePhoneNumberError}</p>
                        </label>

                        <p/>
                        <label className="FormContent">Home Address (Optional):
                            <p/>
                            <textarea
                                maxLength={100}
                                rows={2}
                                cols={80}
                                placeholder='Home Address (Optional)'
                                name="homeAddress"
                                value={homeAddress}
                                onChange={handleChange}
                            ></textarea>
                            <p className="Error"> {homeAddressError}</p>
                        </label>

                        <p/>
                        <label className="FormContent">Fax Number (Optional):
                            <p/>
                            <input
                                type="text"
                                maxLength={20}
                                size={20}
                                placeholder='Fax Number (Optional)'
                                name="faxNumber"
                                value={faxNumber}
                                onChange={handleChange}
                            ></input>
                            <p className="Error">{faxNumberError}</p>
                        </label>

                        {isOtpSent === true && 
                            <>
                                <p/>
                                <label className='FormContent'>OTP:
                                    &nbsp;  {/* blank space */}
                                    <input
                                        required
                                        type='text'
                                        size={6}
                                        maxLength={6}
                                        name='otp'
                                        value={otp}
                                        onChange={handleChange}
                                    ></input>
                                    &nbsp;
                                    <button className='SubmitButton' onClick={sendOtp}>Resend OTP</button>
                                    <p className='Error'>{otpError}</p>    
                                </label>
                            </>
                        }

                        {isOtpSent === false &&
                            <>
                                <p/>
                                <button className='SubmitButton' onClick={sendOtp}>Send OTP</button>
                            </>
                        }
                            
                        {isOtpSent === true && 
                            <>
                                <p/>
                                <input
                                    className='SubmitButton'
                                    type='submit'
                                    value='Register'
                                ></input>
                            </>
                        }
                    </form>
                </section>
                <p/>
            </div>
            
        </>
    );
}    
      