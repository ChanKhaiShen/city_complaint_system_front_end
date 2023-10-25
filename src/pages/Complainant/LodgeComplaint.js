import {useState, useEffect} from 'react';
import axios from 'axios';

import env from 'react-dotenv';

import '../Styles.css';

export default function LodgeComplaint() {
    const [categories, setCategories] = useState([]); // List of categories and areas will be updated from server
    const [areas, setAreas] = useState([]);   
    
    // Fields
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Choose Category");
    const [description, setDescription] = useState("");
    const [expectedResult, setExpectedResult] = useState("");
    const [area, setArea] = useState("Choose Area");
    const [incidentAddress, setIncidentAddress] = useState("");

    // Error messages
    const [titleError, setTitleError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [expectedResultError, setExpectedResultError] = useState("");
    const [areaError, setAreaError] = useState("");
    const [incidentAddressError, setIncidentAddressError] = useState("");

    // For displaying complaint case summary (after submitted)
    const [complaint, setComplaint] = useState({});     // holds the complaint case details returned by the server upon confirm received
    const [isSubmitDone, setSubmitDone] = useState(false);      // If true, will diaplay complaint summary; else if false. will diaplay complaint form

    useEffect(
        ()=>{
            if (localStorage.getItem('token') === null) {
                window.location.reload();
                return;
            }

            const promises = [];

            promises.push(new Promise((resolve, reject)=>{
                axios.get(`${env.SERVER_URL}/allcategories`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(results => {
                    const categories = results.data.categories;
                    console.log('get categories: ' + categories);
                    setCategories(categories);
                    resolve();
                }).catch(error => {
                    console.log('categories error: ' + error);
                    if (error.response.status != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            promises.push(new Promise((resolve, reject)=>{
                axios.get(`${env.SERVER_URL}/allareas`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(results=>{
                    const areas = results.data.areas;
                    console.log('areas: ' + areas);
                    setAreas(areas);
                    resolve();
                }).catch(error=>{
                    console.log('areas error: ' + error);
                    if (error.response.status != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            Promise.all(promises).then(()=>{
                console.log('All areas and categories are loaded');
            }).catch(error=>{
                console.log('Error loading areas or categories', error);
            });
        },
        []
    );

    function handleChange(event) {
        switch(event.target.name) {
            case "title": 
                var title = event.target.value;
                if (title.trim().length === 0)
                    setTitleError("Cannot be empty");
                else if (title.length > 100)
                    setTitleError("Cannot exceed 100 characters");
                else
                    setTitleError("");
                setTitle(title);
                break;
            
            case "category": 
                setCategory(event.target.value);
                if (event.target.value === "Choose Category")
                    setCategoryError("Please choose one category");
                else
                    setCategoryError("");
                break;
            
            case "description":
                var description = event.target.value;
                if (description.trim().length === 0)
                    setDescriptionError("Cannot be empty");
                else if (description.length > 500)
                    setDescriptionError("Cannot exceed 500 characters");
                else
                    setDescriptionError("");
                setDescription(description);
                break;
            
            case "expectedResult":
                var expectedResult = event.target.value;
                if (expectedResult.length > 200)
                    setExpectedResultError("Cannot exceed 200 characters");
                else
                    setExpectedResultError("");
                setExpectedResult(expectedResult);
                break;

            case "area":
                setArea(event.target.value);
                if (event.target.value === "Choose Area")
                    setAreaError("Please choose one area");
                else
                    setAreaError("");
                break;

            case "incidentAddress":
                var incidentAddress = event.target.value;
                if (incidentAddress.length > 100)
                    setIncidentAddressError("Cannot exceed 100 characters");
                else
                    setIncidentAddressError("");
                setIncidentAddress(incidentAddress);
                break;
            
            default:
                // No default
        }
    }
    
    function handleSubmit(event) {
        event.preventDefault();

        if (titleError !== '' || categoryError !== '' || descriptionError !== '' || expectedResultError !== '' || areaError !== '' || incidentAddressError !== '')
            return;

        if (title === '' || category === 'Choose Category' || description === '' || area === 'Choose Area') {
            alert('Please fill in the required fields (title, category, description, area)');
            return;
        }

        console.log('lodge', title, category, description, expectedResult, area, incidentAddress)

        axios.post(`${env.SERVER_URL}/lodgecomplaint`,
        {
            title: title,
            category: category,
            description: description,
            expectedResult: expectedResult,
            area: area,
            incidentAddress: incidentAddress
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            console.log('lodge complaint', response, response.data.received);
            setComplaint(response.data.received);
            setSubmitDone(true);
        }).catch(error=>{
            console.log('lodge complaint error', error);
            if (error.response != null && (error.response.status === 400 || error.response.status === 403))
                alert(error.response.data.message);
            else if (error.response != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            }
            else
                alert('Lodge complaint fail');
        });
    }

    function done() {
        window.location.reload();
    }

    if (isSubmitDone === true) {
        return (
            <div className='Content'>
                <p/>

                <section className='Box'>
                    <h1>Complaint Summary</h1>
                    <h3>Title: {complaint.title}</h3>
                    <p>Case ID: {complaint.caseId}</p>
                    <p>Status: {complaint.status}</p>
                    <p>Date: {complaint.date}</p>
                    <h3>Details:</h3>
                    <p>Category: {complaint.category}</p>
                    <p>Description: {complaint.description}</p>
                    <p>Expected Result: {complaint.expectedResult}</p>
                    <p>Area: {complaint.area}</p>
                    <p>Incident Address: {complaint.incidentAddress}</p>
                    <p/>
                    <button className='SubmitButton' onClick={done}>Done</button>
                </section>
                <p/>
            </div>
        );
    }

    return (
        <div className="Content">
            <h1>Lodge New Complaint</h1>

            <section className="Box">
                <form onSubmit={handleSubmit}>
                    <label className="FormContent">Title:
                        <p/>
                        <textarea
                            required
                            maxLength={100}
                            type="text"
                            rows={2}
                            cols={80}
                            placeholder='Title'
                            name="title"
                            value={title}
                            onChange={handleChange}
                        ></textarea>
                        <p className="Error">{titleError}</p>
                    </label>

                    <p/>
                    <label className="FormContent">Category:
                        <p/>
                        <select
                            required
                            name="category"
                            value={category}
                            onChange={handleChange}
                        >
                            <option value='Choose Category'>Choose Category</option>
                            {categories.map(category => {
                                return (
                                    <option key={category.id} value={category.name}>{category.name}</option>
                                );
                            })}
                        </select>
                        <p className='Error'>{categoryError}</p>
                    </label>
                    
                    <p/>
                    <label className="FormContent">Description:
                        <p/>
                        <textarea 
                            required
                            maxLength={500}
                            rows={7}
                            cols={80}
                            placeholder='Description'
                            name="description"
                            value={description}
                            onChange={handleChange}
                        ></textarea>
                        <p className="Error">{descriptionError}</p>
                    </label>
                    
                    <p/>
                    <label className="FormContent">Expected Result (Optional):
                        <p/>
                        <textarea
                            maxLength={200}
                            rows={3}
                            cols={80}
                            placeholder='Expected Result (Optional)'
                            name="expectedResult" 
                            value={expectedResult} 
                            onChange={handleChange}
                        ></textarea>
                        <p className="Error">{expectedResultError}</p></label>

                    <p/>
                    <label className="FormContent">Area:
                        <p/>
                        <select
                            required
                            name="area"
                            value={area}
                            onChange={handleChange}
                        >
                            <option value='Choose Area'>Choose Area</option>
                            {areas.map(area => {
                                return (
                                    <option key={area.id} value={area.name}>{area.name}</option>
                                );
                            })}
                        </select>
                        <p className='Error'>{areaError}</p>
                    </label>
                    
                    <p/>
                    <label className="FormContent">Incident Address (If Applicable):
                        <p/>
                        <textarea
                            maxLength={100} 
                            rows={2}
                            cols={80}
                            placeholder='Incident Address (If Applicable)'
                            name="incidentAddress"
                            value={incidentAddress}
                            onChange={handleChange}
                        ></textarea>
                        <p className="Error">{incidentAddressError}</p>
                    </label>

                    <p/>
                    <input
                        className='SubmitButton'
                        type='submit'
                        value='Submit'
                    ></input>
                </form>
            </section>
            <p/>          
        </div>
    );
}
