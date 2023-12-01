import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import env from "react-dotenv";

import ComplaintDetails from "./ComplaintDetails";
import './Styles.css';


export default function CheckComplaint() {
    // Details
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(searchParams, searchParams.get('case_id'));
    const caseId = searchParams.get('case_id');

    // List
    const [complaints, setComplaints] = useState([]);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [statuses, setStatuses] = useState([]);

    // Search
    const [searchWord, setSearchWord] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Filter
    const [filterTitle, setFilterTitle] = useState('');
    const [filterCategory, setFilterCategory] = useState('Choose Category');
    const [filterArea, setFilterArea] = useState('Choose Area');
    const [filterStatus, setFilterStatus] = useState('Choose Status');

    // Search
    useEffect(
        ()=>{
            if (localStorage.getItem('token') === null) {
                window.location.reload();
                return;
            }
            
            const start = startDate === '' ? '' : '&startdate=' + startDate;
            const end = endDate === '' ? '' : '&enddate=' + endDate;

            axios.get(
                `${env.SERVER_URL}/allcomplaints?searchword=${searchWord}${start}${end}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            ).then(results=>{
                const complaints = results.data.complaints;
                console.log('search complaints', complaints);
    
                const categories = [];
                const areas = [];
                const statuses = [];
    
                for (var i = 0; i < complaints.length; i++) {
                    const category = complaints[i].category;
                    const area = complaints[i].area;
                    const status = complaints[i].status;
    
                    if (categories.includes(category) === false) {
                        categories.push(category);
                    }
        
                    if (areas.includes(area) === false) {
                        areas.push(area);
                    }
        
                    if (statuses.includes(status) === false) {
                        statuses.push(status);
                    }
                }
    
                setComplaints(complaints);
                setCategories(categories.sort());
                setAreas(areas.sort());
                setStatuses(statuses.sort());
    
            }).catch(error=>{
                console.log('search complaints', error);
                if (error.response != null && error.response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.reload();
                }
            });
        },
        [searchWord, startDate, endDate]
    );

    // Filter
    useEffect(
        ()=>{
            if (caseId != null)
                return;

            const table = document.getElementById('allComplaints');
            const rows = table.getElementsByTagName('tr');

            for (var i = 0; i < rows.length; i++) {
                const title = rows[i].getElementsByTagName('td')[1];
                const category = rows[i].getElementsByTagName('td')[3];
                const area = rows[i].getElementsByTagName('td')[4];
                const status = rows[i].getElementsByTagName('td')[5];
    
                if (title) {
                    const titleText = title.textContent || title.innerText;
                    console.log(titleText, titleText.toLowerCase());
    
                    if (titleText.toLowerCase().indexOf(filterTitle.trim().toLowerCase()) === -1) {
                        rows[i].style.display = 'none';
                        continue;
                    }
                    
                    if (filterCategory !== 'Choose Category') {
                        const categoryText = category.textContent || category.innerText;
                        console.log(categoryText);
        
                        if (categoryText !== filterCategory) {
                            rows[i].style.display = 'none';
                            continue;
                        }
                    }
    
                    if (filterArea !== 'Choose Area') {
                        const areaText = area.textContent || area.innerText;
                        console.log(areaText);
        
                        if (areaText !== filterArea) {
                            rows[i].style.display = 'none';
                            continue;
                        }
                    }
    
                    if (filterStatus !== 'Choose Status') {
                        const statusText = status.textContent || status.innerText;
                        console.log(statusText);
        
                        if (statusText !== filterStatus) {
                            rows[i].style.display = 'none'
                            continue;
                        }
                    }
    
                    rows[i].style.display = '';
                }
            }
        },
        [filterTitle, filterCategory, filterArea, filterStatus, caseId]
    );

    function handleChange(event) {
        switch (event.target.name) {
            case 'searchWord': 
                setSearchWord(event.target.value);
                break;

            case 'startDate':
                if (new Date(event.target.value) > new Date(endDate) ) {
                    alert ('Start date after end date');
                }
                else {
                    setStartDate(event.target.value);
                }
                break;

            case 'endDate':
                if (new Date(event.target.value) < new Date(startDate) ) {
                    alert ('End date after start date');
                }
                else {
                    setEndDate(event.target.value);
                }
                break;

            case 'filterTitle':
                setFilterTitle(event.target.value);
                break;

            case 'filterCategory':
                setFilterCategory(event.target.value);
                break;

            case 'filterArea':
                setFilterArea(event.target.value);
                break;

            case 'filterStatus':
                setFilterStatus(event.target.value);
                break;

            default:
                // No default
        }
    }

    function sortComplaints(column, order, isDate=false) {
        const table = document.getElementById('allComplaints');
        const rows = table.getElementsByTagName('tr');
        console.log(column, order);

        var switching = true;

        while (switching === true) {
            switching = false;
            var shouldSwitch = false;

            for (var i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;

                const a = rows[i].getElementsByTagName('td')[column];
                const b = rows[i + 1].getElementsByTagName('td')[column];

                const aText = a.textContent || a.innerText;
                const bText = b.textContent || b.innerText;
                console.log(aText, bText);

                if (order === 'ascending') {
                    if (isDate === true) {
                        if ((new Date(aText)) > (new Date(bText))) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else {
                        if (aText.toUpperCase() > bText.toUpperCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
                else {
                    if (isDate === true) {
                        if ((new Date(aText)) < (new Date(bText))) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else {
                        if (aText.toUpperCase() < bText.toUpperCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }

            if (shouldSwitch === true) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

    function getDetails(id) {
        setSearchParams({
            case_id: id
        });
    }

    if (complaints.length > 0 && searchParams.get('case_id') != null) {
        if (complaints.find(complaint => complaint.id === searchParams.get('case_id')) != null) {
            return (
                <ComplaintDetails selectedComplaint={complaints.find(complaint => complaint.id === searchParams.get('case_id'))}></ComplaintDetails>
            );
        }
        else {
            alert('Complaint case not available');
            setSearchParams({});
        }
    }
    
    return (
        <div className="Content">
            <h1>Check Complaint</h1>

            <section className="Box">
                <h2>Search Options</h2>

                <label className="FormContent">
                    Search:
                    &nbsp;
                    <input
                        type="text"
                        name="searchWord"
                        value={searchWord}
                        placeholder={localStorage.getItem('role') === 'administrator' ? 'Title or Complaint Handler' : 'Title'}
                        size={50}
                        maxLength={100}
                        onChange={handleChange}
                    ></input>
                </label>

                <p/>
                <label className='FormContent'>
                    Start Date: 
                    &nbsp;
                    <input
                        type='date'
                        name='startDate'
                        value={startDate}
                        onChange={handleChange}
                    ></input>
                </label>

                &nbsp;
                <label className='FormContent'>
                    End Date: 
                    &nbsp;
                    <input
                        type='date'
                        name='endDate'
                        value={endDate}
                        onChange={handleChange}
                    ></input>
                </label>
            </section>

            <br/>
            <section className="Box">
                <h2>Filter Options</h2>

                <label className="FormContent">
                    Title:
                    &nbsp;
                    <input
                        type="text"
                        name="filterTitle"
                        value={filterTitle}
                        placeholder="Title"
                        size={50}
                        maxLength={100}
                        onChange={handleChange}
                    ></input>
                </label>

                <p/>
                <label className="FormContent">
                    Category:
                    &nbsp;
                    <select
                        name="filterCategory"
                        value={filterCategory}
                        onChange={handleChange}
                    >
                        <option value='Choose Category'>Choose Category</option>
                        {
                            categories.map(category => {
                                return (
                                    <option key={category} value={category}>{category}</option>
                                );
                            })
                        }
                    </select>
                </label>

                &nbsp;
                <label className="FormContent">
                    Area:
                    &nbsp;
                    <select
                        name="filterArea"
                        value={filterArea}
                        onChange={handleChange}
                    >
                        <option value='Choose Area'>Choose Area</option>
                        {
                            areas.map(area => {
                                return (
                                    <option key={area} value={area}>{area}</option>
                                );
                            })
                        }
                    </select>
                </label>

                &nbsp;
                <label className="FormContent">
                    Status:
                    &nbsp;
                    <select
                        name="filterStatus"
                        value={filterStatus}
                        onChange={handleChange}
                    >
                        <option value='Choose Status'>Choose Status</option>
                        {
                            statuses.map(status => {
                                return (
                                    <option key={status} value={status}>{status}</option>
                                );
                            })
                        }
                    </select>
                </label>
            </section>

            <br/>
            <section className="Box">
                <h2>Sort Options</h2>

                <button className="SortButton" onClick={()=>{sortComplaints(1, 'ascending')}}>Title (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortComplaints(2, 'ascending', true)}}>Date (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortComplaints(3, 'ascending')}}>Category (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortComplaints(4, 'ascending')}}>Area (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortComplaints(5, 'ascending')}}>Status (Ascending)</button>
                
                <p/>
                <button className="SortButton" onClick={()=>{sortComplaints(1, 'descending')}}>Title (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortComplaints(2, 'descending', true)}}>Date (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortComplaints(3, 'descending')}}>Category (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortComplaints(4, 'descending')}}>Area (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortComplaints(5, 'descending')}}>Status (Descending)</button>

            </section>

            <br/>
            <section className="Box">
                <h2>All Complaints {startDate===''?'':' from '+startDate}{endDate===''?'':' until '+endDate}</h2>

                <div className='Table'>
                    <table id="allComplaints">
                        <thead>
                            <tr>
                                <th>Case Id</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Area</th>
                                <th>Status</th>
                                {
                                    (localStorage.getItem('role') === 'complaint handler' || localStorage.getItem('role') === 'administrator') &&
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
                                            (localStorage.getItem('role') === 'complaint handler' || localStorage.getItem('role') === 'administrator') &&
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

                <br/>
            </section>

            <br/>
        </div>
    );
}
