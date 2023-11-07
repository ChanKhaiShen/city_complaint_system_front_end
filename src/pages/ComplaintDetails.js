import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import env from "react-dotenv";

import './Styles.css';

export default function ComplaintDetails({selectedComplaint}) {
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(searchParams);

    // Complaint details fields
    const [complaint, setComplaint] = useState(selectedComplaint);
    const [status, setStatus] = useState(selectedComplaint.status);

    // Not for complainant
    const [complaintHandlerEmail, setComplaintHandlerEmail] = useState(selectedComplaint.complaintHandlerEmail);
    const [complaintHandlerName, setComplaintHandlerName] = useState(selectedComplaint.complaintHandlerName);
    const [complaintHandlers, setComplaintHandlers] = useState([]);

    // Input fields
    const [newMessage, setNewMessage] = useState('');
    const [newComplaintHandlerEmail, setNewComplaintHandlerEmail] = useState('Choose Complaint Handler');

    useEffect(
        ()=>{
            if (localStorage.getItem('token') === null) {
                window.location.reload();
                return;
            }

            if (localStorage.getItem('role') !== 'administrator') 
                return;
    
            axios.get(
                `${env.SERVER_URL}/allcomplainthandlers`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            ).then(result=>{
                console.log('get complaint handlers', result);
        
                const complaintHandlers = result.data.complaintHandlers.filter((complaintHandler => complaintHandler.emailAddress !== complaintHandlerEmail));
                
                if (complaintHandlerEmail !== localStorage.getItem('emailAddress')) {
                    complaintHandlers.push({
                        id: crypto.randomUUID(),
                        emailAddress: localStorage.getItem('emailAddress'),
                        name: localStorage.getItem('name')
                    });
                }

                setComplaintHandlers(complaintHandlers.sort((a,b)=>{
                    if (a.name.toLowerCase() > b.name.toLowerCase())
                        return 1;
                    else if (a.name.toLowerCase() < b.name.toLowerCase())
                        return -1;
                    return 0;
                }));
                
            }).catch(error=>{
                console.log('get complaint handlers error', error);
                if (error.response != null && error.response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.reload();
                }
            });
        },
        [complaintHandlerEmail]
    );

    function changeStatus(newStatus) {
        console.log('change status', newStatus);

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.put(
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

            const complaint_temp = complaint;
            complaint_temp.status = newStatus;
            
            if (complaintHandlerEmail === 'Not Available') {
                complaint_temp.complaintHandlerEmail = localStorage.getItem('emailAddress');
                complaint_temp.complaintHandlerName = localStorage.getItem('name');

                complaint_temp.histories.push({
                    id: crypto.randomUUID(),
                    message: `${localStorage.getItem('name')} (${localStorage.getItem('emailAddress')}) is the complaint handler of this case.`,
                    from: 'System',
                    created: Date.now()
                });
            }

            complaint_temp.histories.push({
                id: crypto.randomUUID(),
                message: `Status is changed to "${newStatus}".`,
                from: 'System',
                created: Date.now()
            });
            
            console.log(complaint_temp);
            setComplaint(complaint_temp);
            console.log(complaint);
            
            setStatus(newStatus);
            
            if (complaintHandlerEmail === 'Not Available') {
                setComplaintHandlerEmail(localStorage.getItem('emailAddress'));
                setComplaintHandlerName(localStorage.getItem('name'));
            }
            
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

    function handleChange(event) {
        if (event.target.name === 'newMessage') {
            setNewMessage(event.target.value);
        }
        else if (event.target.name === 'newComplaintHandlerEmail') {
            setNewComplaintHandlerEmail(event.target.value);
        }
    }

    function addMessage() {
        console.log('add message', newMessage);

        if (newMessage === '') 
            return;

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.post(
            `${env.SERVER_URL}/addmessage`,
            {
                caseId: complaint.caseId,
                message: newMessage
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(result=>{
            console.log('add message', result);

            const complaint_temp = complaint;
            complaint_temp.histories.push({
                id: crypto.randomUUID(),
                message: newMessage,
                from: (localStorage.getItem('role') === 'complainant' ? 'Complainant Side' : 'Complaint Handler Side'),
                created: Date.now()
            });

            if (complaintHandlerEmail === 'Not Available') {
                complaint_temp.complaintHandlerEmail = localStorage.getItem('emailAddress');
                complaint_temp.complaintHandlerName = localStorage.getItem('name');
                setComplaintHandlerEmail(localStorage.getItem('emailAddress'));
                setComplaintHandlerName(localStorage.getItem('name'));
            }
            
            console.log(complaint_temp);
            setComplaint(complaint_temp);
            setNewMessage('');

        }).catch(error=>{
            console.log('add message error', error);
            if (error.response != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            } else if (error.response != null && error.response.data.message != null) 
                alert(error.response.data.message);
            else
                alert('Not added');
        });
    }

    function assignComplaintHandler() {
        console.log('assign complaint handler', newComplaintHandlerEmail);

        if (newComplaintHandlerEmail === 'Choose Complaint Handler') 
            return;

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.put(
            `${env.SERVER_URL}/assigncomplainthandler`,
            {
                caseId: complaint.caseId,
                complaintHandlerEmail: newComplaintHandlerEmail
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(result=>{
            console.log('assign complaint handler', result);

            const complaint_temp = complaint;
            complaint_temp.histories.push({
                id: crypto.randomUUID(),
                message: `${complaintHandlers.find(complaintHandler => complaintHandler.emailAddress === newComplaintHandlerEmail).name} (${complaintHandlerEmail}) is assigned as the complaint handler of this case.`,
                from: 'System',
                created: Date.now()
            });

            complaint_temp.complaintHandlerEmail = newComplaintHandlerEmail;
            complaint_temp.complaintHandlerName = complaintHandlers.find(complaintHandler => complaintHandler.emailAddress === newComplaintHandlerEmail).name;
            
            console.log(complaint_temp);
            setComplaint(complaint_temp);
            
            setComplaintHandlerEmail(newComplaintHandlerEmail);
            setComplaintHandlerName(complaintHandlers.find(complaintHandler => complaintHandler.emailAddress === newComplaintHandlerEmail).name);

            setNewComplaintHandlerEmail('Choose Complaint Handler');

        }).catch(error=>{
            console.log('assign complaint handler error', error);
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
        setSearchParams({});
    }

    return (
        <div className="Content">
            <h1>Complaint Details</h1>

            <section className="Box">
                <div className="DetailsContent">
                    <h2>{complaint.title} (Status: {status})</h2>

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

                    <br/>
                    <h3>Histories</h3>

                    <div className="History">
                        {
                            complaint.histories.map(history => {
                                return (
                                    <section className='HistoryContainer' key={history.id}>
                                        <strong>{history.from}</strong>
                                        <p>{history.message}</p>
                                        <span>{(new Date(history.created)).toLocaleString()}</span>
                                    </section>
                                );
                            })
                        }

                        {
                            complaint.status !== 'Solved' &&
                            <div className="HistoryDownBar">
                                <p/>
                                <label className="FormContent">
                                    Add Message:
                                    &nbsp;
                                    <input
                                        type="text"
                                        name="newMessage"
                                        value={newMessage}
                                        size={50}
                                        maxLength={200}
                                        placeholder="New Message"
                                        onChange={handleChange}
                                    ></input>
                                    &nbsp;
                                    <button className='MessageButton' onClick={addMessage}>Add</button>
                                </label>
                            </div>
                        }
                    
                    </div>

                    {
                        (localStorage.getItem('role') === 'complaint handler' || localStorage.getItem('role') === 'administrator') &&
                        <div>
                            <br/>
                            <p/>
                            <h3>Complaint Handler:</h3>
                            <p>Name: {complaintHandlerName}</p>
                            <p>Email Address: {complaintHandlerEmail}</p>

                            {
                                localStorage.getItem('role') === 'administrator' &&
                                <>
                                    <p/>
                                    <label className="FormContent">
                                        Assign:
                                        &nbsp;
                                        <select
                                            name="newComplaintHandlerEmail"
                                            value={newComplaintHandlerEmail}
                                            onChange={handleChange}
                                        >
                                            <option value='Choose Complaint Handler'>Choose Complaint Handler</option>
                                            {
                                                complaintHandlers.map(complaintHandler => {
                                                    return (
                                                        <option key={complaintHandler.id} value={complaintHandler.emailAddress}>{complaintHandler.name} ({complaintHandler.emailAddress})</option>
                                                    );
                                                })
                                            }
                                        </select>
                                        &nbsp;
                                        <button className="SubmitButton" onClick={assignComplaintHandler}>Assign</button>
                                    </label>
                                </>
                            }

                            {
                                complaint.status === 'Received' &&
                                <>
                                    <p/>
                                    <button 
                                        className="SubmitButton"
                                        onClick={()=>{changeStatus('Progressing')}}
                                    >Change Status to Progressing</button>
                                </>
                            }

                            {
                                complaint.status === 'Progressing' &&
                                <>
                                    <p/>
                                    <button
                                        className="SubmitButton"
                                        onClick={()=>{changeStatus('Solved')}}
                                    >Change Status to Solved</button>
                                </>
                            }
                        </div>
                    }
                    
                    <>
                        <br/>
                        <p/>
                        <button className='SubmitButton' onClick={done}>Done</button>
                    </>
                </div>
            </section>

            <p/>
        </div>
    );
}
