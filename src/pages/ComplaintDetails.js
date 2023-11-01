import { useState } from "react";
import axios from "axios";

import env from "react-dotenv";

import './Styles.css';

export default function ComplaintDetails({selectedComplaint, setSelected}) {
    const [complaint, setComplaint] = useState(selectedComplaint);
    const [newStatus, setNewStatus] = useState('Choose status');

    function handleChange(event) {
        if (event.target.name === 'newStatus')
            setNewStatus(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log('change status', newStatus);

        if (newStatus === 'Choose status')
            return;

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.post(
            `${env.SERVER_URL}/changestatus`,
            {
                caseId: complaint.caseId,
                newStatus: newStatus
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(result=>{
            console.log('change status', result);
            
        }).catch(error=>{
            console.log('change status error', error);
            if (error.response != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            } else if (error.response != null && error.response.data.message != null) 
                alert(error.response.data.message);
            else
                alert('Not changed');
        });
    }

    function done() {
        setSelected('');
    }

    return (
        <div className="Content">
            <h1>Complaint Details</h1>

            <section className="Box">
                <div className="DetailsContent">
                    <h2>{complaint.title} (Status: {complaint.status})</h2>

                    <p>Case ID: {complaint.caseId}</p>
                    <p>Date: {new Date(complaint.created).toLocaleDateString()}</p>

                    <br/>
                    <h3>Complaint Details:</h3>
                    <p>Category: {complaint.category}</p>
                    <p>Description: {complaint.description}</p>
                    <p>Expected Result: {complaint.expectedResult}</p>
                    <p>Area: {complaint.area}</p>
                    <p>Incident Address: {complaint.incidentAddress}</p>

                    {
                        (localStorage.getItem('role') === 'complaint handler' || localStorage.getItem('role') === 'administrator') &&
                        <>
                            <br/>
                            <h3>Complainant Details:</h3>
                            <p>Email Address: {complaint.emailAddress}</p>
                            <p>Name: {complaint.name}</p>
                            <p>IC Number: {complaint.IC_Number}</p>
                            <p>Mobile Phone Number: {complaint.mobilePhoneNumber}</p>
                            <p>Home Address: {complaint.homeAddress}</p>
                            <p>Fax Number: {complaint.faxNumber}</p>
                        </>
                    }

                    {
                        complaint.history.length !== 0 && 
                        <>
                            <br/>
                            <h3>History</h3>
                            {
                                complaint.history.map(history => {
                                    return (
                                        <>
                                            <p>Status: {history.status}</p>
                                            <p>Date: {new Date(history.changed).toLocaleDateString()}</p>
                                        </>
                                    );
                                })
                            }
                        </>
                    }

                    {
                        (localStorage.getItem('role') === 'complaint handler' || localStorage.getItem('role') === 'administrator') &&
                        <>
                            <br/>
                            <form onSubmit={handleSubmit}>
                                <label className="FormContent">
                                    Change status: {complaint.status} to 
                                    &nbsp;  {/* blank space */}
                                    <select
                                        required
                                        name="newStatus"
                                        value={newStatus}
                                        onChange={handleChange}
                                    >
                                        <option value='Choose status'>Choose status</option>
                                        <option value='Still in progress'>Still in progress</option>
                                        <option value='Solved'>Solved</option>
                                        <option value='Cancelled'>Cancelled</option>
                                    </select>
                                </label>
                            </form>
                        </>
                    }
                    
                    <br/>
                    <button className='SubmitButton' onClick={done}>Done</button>
                </div>
            </section>

            <p/>
        </div>
    );
}
