import { useEffect, useState } from "react";
import axios from "axios";

import env from "react-dotenv";

import ComplaintDetails from "./ComplaintDetails";
import './Styles.css';

export default function CheckComplaint() {
    const [complaints, setComplaints] = useState([]);
    const [selected, setSelected] = useState('');

    useEffect(
        ()=>{
            if (localStorage.getItem('token') === null) {
                window.location.reload();
                return;
            }
    
            axios.get(`${env.SERVER_URL}/allcomplaints`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            ).then(results => {
                const complaints = results.data.complaints;
                console.log('get complaints', complaints);
                setComplaints(complaints);
            }).catch(error => {
                console.log('get complaints error', error);
                if (error.response.status != null && error.response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.reload();
                }
            });
        },
        []
    );

    function getDetails(id) {
        setSelected(id);
    }

    if (selected !== '') {
        return (
            <ComplaintDetails selectedComplaint={complaints.find(complaint => complaint.id === selected)} setSelected={setSelected}/>
        );
    }
    
    return (
        <div className="Content">
            <h1>Check Complaint</h1>

            <section className="Box">
                <h2>All Complaints</h2>

                <div className='Table'>
                    <table>
                        <thead>
                            <tr>
                                <th>Case Id</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Area</th>
                                <th>Status</th>
                                {
                                    localStorage.getItem('role') === 'administrator' &&
                                    <th>Complaint Handler</th>
                                }
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(complaint=>{
                                return(
                                    <tr key={complaint.id}>
                                        <td>{complaint.caseId}</td>
                                        <td>{complaint.title}</td>
                                        <td>{new Date(complaint.created).toLocaleDateString()}</td>
                                        <td>{complaint.category}</td>
                                        <td>{complaint.area}</td>
                                        <td>{complaint.status}</td>
                                        {
                                            localStorage.getItem('role') === 'administrator' &&
                                            <td>{complaint.complaintHandlerName}</td>
                                        }
                                        <td>
                                            <button
                                                className='DetailsButton'
                                                onClick={()=>{getDetails(complaint.id)}}
                                            >Details</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <p/>
            </section>

        </div>
    );
}
