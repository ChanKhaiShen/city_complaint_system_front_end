import { useEffect, useState } from 'react';
import axios from 'axios';

import env from 'react-dotenv';

import '../Styles.css';

export default function ManageSystem() {
    // Lists of category, area, complaint handler
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [complaintHandlers, setComplaintHandlers] = useState([]);

    // New category
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryError, setNewCategoryError] = useState('');
    
    // New area
    const [newArea, setNewArea] = useState('');
    const [newAreaError, setNewAreaError] = useState('');

    // New complaint handler
    const [name, setName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailAddressError, setEmailAddressError] = useState('');

    useEffect(
        ()=>{
            if (localStorage.getItem('token') === null) {
                window.location.reload();
                return;
            }

            const promises = [];

            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `${env.SERVER_URL}/allcategories`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                }).then(result=>{
                    console.log('get categories', result);
                    setCategories(result.data.categories.sort((a, b)=>{  // Sort category in alphabetical order
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                            return 1;
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                            return -1;
                        return 0;
                    }));
                    resolve();
                }).catch(error=>{
                    console.log('get categories error', error);
                    if (error.response.status != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `${env.SERVER_URL}/allareas`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                }).then(result=>{
                    console.log('get areas', result);
                    setAreas(result.data.areas.sort((a, b) => {
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                            return 1;
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                            return -1;
                        return 0;
                    }));
                    resolve();
                }).catch(error=>{
                    console.log('get areas error', error);
                    if (error.response.status != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `${env.SERVER_URL}/allcomplainthandlers`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                }).then(result=>{
                    console.log('get complaint handlers', result);
                    setComplaintHandlers(result.data.complaintHandlers.sort((a, b) => {
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                            return 1;
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                            return -1;
                        return 0;
                    }));
                    resolve();
                }).catch(error=>{
                    console.log('get complaint handlers error', error);
                    if (error.response.status != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            Promise.all(promises).then(result=>{
                console.log('All areas, categories and complaint handlers are loaded', result);
            }).catch(error=>{
                console.log('Error when loading areas, categories or complaint handlers', error);
            })
        },
        []
    );

    function handleChange(event) {
        if (event.target.name === 'newCategory') {
            const newCategory = event.target.value;
            setNewCategory(newCategory);

            if (newCategory.trim().length > 50)
                setNewCategoryError('Cannot exceed 50 characters');
            else {
                for (var i=0; i<categories.length; i++) {
                    if (newCategory.trim() === categories[i].name) {
                        setNewCategoryError('Already exist');
                        return;
                    }
                }
                setNewCategoryError('');
            }
        }
        else if (event.target.name === 'newArea') {
            const newArea = event.target.value;
            setNewArea(newArea);

            if (newArea.trim().length > 50)
                setNewAreaError('Cannot exceed 50 characters');
            else {
                for (var j=0; j<areas.length; j++) {
                    if (newArea.trim() === areas[j].name) {
                        setNewAreaError('Already exist');
                        return;
                    }
                }
                setNewAreaError('');
            }
        }
        else if (event.target.name === 'name') {
            const name = event.target.value;
            setName(name);

            if (name.trim().length > 50)
                setNameError('Cannot exceed 50 characters');
            else
                setNameError('');
        }
        else if (event.target.name === 'emailAddress') {
            const emailAddress = event.target.value;
            setEmailAddress(emailAddress);

            if (emailAddress.trim().length > 70)
                setEmailAddressError('Cannot exceed 70 characters');
            else {
                for (var k=0; k<complaintHandlers.length; k++) {
                    if (emailAddress.trim() === complaintHandlers[k].emailAddress) {
                        setEmailAddressError('Already exist');
                        return;
                    }
                }
                setEmailAddressError('');
            }
        }
    }

    function deleteCategory(categoryName) {
        console.log('delete category', categoryName);

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.delete(
            `${env.SERVER_URL}/deletecategory?name=${categoryName}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
        }).then(result=>{
            console.log('delete category', result);
            setCategories(categories.filter(category => category.name !== categoryName));
        }).catch(error=>{
            console.log('delete category error', error);
            if (error.response.status != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            }
            else if (error.response.status != null && error.response.status === 400)
                alert(error.response.data.message);
            else
                alert('Not deleted');
        });
    }

    function deleteArea(areaName) {
        console.log('delete area', areaName);

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.delete(
            `${env.SERVER_URL}/deletearea?name=${areaName}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
        }).then(result=>{
            console.log('delete area', result);
            setAreas(areas.filter(area => area.name !== areaName));
        }).catch(error=>{
            console.log('delete area error', error);
            if (error.response.status != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            } 
            else if (error.response.status != null && error.response.status === 400)
                alert(error.response.data.message);
            else
                alert('Not deleted');
        });
    }

    function deleteComplaintHandler(emailAddress) {
        console.log('delete complaint handler', emailAddress);

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.delete(
            `${env.SERVER_URL}/deletecomplainthandler?emailAddress=${emailAddress}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
        }).then(result=>{
            console.log('delete complaint handler', result);
            setComplaintHandlers(complaintHandlers.filter(complaintHandler => complaintHandler.emailAddress !== emailAddress));
        }).catch(error=>{
            console.log('delete complaint handler error', error);
            if (error.response.status != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            }
            else if (error.response.status != null && error.response.status === 400)
                alert(error.response.data.message);
            else
                alert('Not deleted');
        });
    }

    function addCategory(event) {
        event.preventDefault();
        console.log('add category', newCategory, newCategoryError);

        if (newCategoryError !== '')
            return;

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.post(
            `${env.SERVER_URL}/addcategory`,
            {
                name: newCategory
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(result=>{
            console.log('add category', result, categories, result.data.category);
            const categories_temp = categories;
            categories_temp.push(result.data.category);
            console.log(categories_temp);
            setCategories(categories_temp.sort((a, b) => {
                if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1;
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1;
                return 0;
            }));
            setNewCategory('');
        }).catch(error=>{
            console.log('add category error', error);
            if (error.response.status != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            } else if (error.response.status != null && error.response.data.message != null) 
                alert(error.response.data.message);
            else
                alert('Not added');
        });
    }

    function addArea(event) {
        event.preventDefault();
        console.log('add area', newArea, newAreaError);

        if (newAreaError !== '')
            return;

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.post(
            `${env.SERVER_URL}/addarea`,
            {
                name: newArea
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(result=>{
            console.log('add area', result);
            const areas_temp = areas;
            areas_temp.push(result.data.area);
            setAreas(areas_temp.sort((a, b) => {
                if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1;
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1;
                return 0;
            }));
            setNewArea('');
        }).catch(error=>{
            console.log('add area error', error);
            if (error.response.status != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            } else if (error.response.status != null && error.response.data.message != null) 
                alert(error.response.data.message);
            else
                alert('Not added');
        });
    }

    function addComplaintHandler(event) {
        event.preventDefault();
        console.log('add complaint handler', name, emailAddress, nameError, emailAddressError);

        if (nameError !== '' || emailAddressError !== '')
            return;

        if (localStorage.getItem('token') === null) {
            window.location.reload();
            return;
        }

        axios.post(
            `${env.SERVER_URL}/addcomplainthandler`,
            {
                emailAddress: emailAddress, 
                name: name
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(result=>{
            console.log('add complaint handler', result);
            const complaintHandlers_temp = complaintHandlers;
            complaintHandlers_temp.push(result.data.complaintHandler);
            setComplaintHandlers(complaintHandlers_temp.sort((a, b) => {
                if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1;
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1;
                return 0;
            }));
            setName('');
            setEmailAddress('');
        }).catch(error=>{
            console.log('add complaint handler error', error);
            if (error.response.status != null && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
            } else if (error.response.status != null && error.response.data.message != null) 
                alert(error.response.data.message);
            else
                alert('Not added');
        });
    }

    return (
        <div className='Content'>
            <h1>Manage System</h1>

            <section className='Box'>
                <h2>All Categories</h2>
                <div className='Table'>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Creator Name</th>
                                <th>Creator Email</th>
                                <th>Created Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category=>{
                                return(
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>{category.creatorName}</td>
                                        <td>{category.creatorEmail}</td>
                                        <td>{new Date(category.created).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className='DeleteButton'
                                                onClick={()=>{deleteCategory(category.name)}}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p/>
                <form onSubmit={addCategory}>
                    <label className='FormContent'>Add: <input
                        required
                        name='newCategory'
                        value={newCategory}
                        onChange={handleChange}
                        placeholder='New Category'
                        maxLength={50}
                        size={50}
                    ></input></label>
                    <input
                        type='submit'
                        className='AddButton'
                        value='Add'
                    ></input>
                    <p className='Error'>{newCategoryError}</p>
                </form>
            </section>

            <p/>
            <section className='Box'>
                <h2>All Areas</h2>
                <div className='Table'>
                    <table>
                        <thead>
                            <tr>
                                <th>Area</th>
                                <th>Creator Name</th>
                                <th>Creator Email</th>
                                <th>Created Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map(area=>{
                                return(
                                    <tr key={area.id}>
                                        <td>{area.name}</td>
                                        <td>{area.creatorName}</td>
                                        <td>{area.creatorEmail}</td>
                                        <td>{new Date(area.created).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className='DeleteButton'
                                                onClick={()=>{deleteArea(area.name)}}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p/>
                <form onSubmit={addArea}>
                    <label className='FormContent'>Add: <input
                        required
                        name='newArea'
                        value={newArea}
                        onChange={handleChange}
                        placeholder='New Area'
                        maxLength={50}
                        size={50}
                    ></input></label>
                    <input
                        type='submit'
                        className='AddButton'
                        value='Add'
                    ></input>
                    <p className='Error'>{newAreaError}</p>
                </form>
            </section>

            <p/>
            <section className='Box'>
                <h2>All Complaint Handlers</h2>
                <div className='Table'>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email Address</th>
                                <th>Created Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaintHandlers.map(complaintHandler=>{
                                return(
                                    <tr key={complaintHandler.id}>
                                        <td>{complaintHandler.name}</td>
                                        <td>{complaintHandler.emailAddress}</td>
                                        <td>{new Date(complaintHandler.created).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className='DeleteButton'
                                                onClick={()=>{deleteComplaintHandler(complaintHandler.emailAddress)}}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p/>
                <form onSubmit={addComplaintHandler}>
                    <h3>New Complaint Handler</h3>

                    <label className='FormContent'>Name: <input
                        required
                        name='name'
                        value={name}
                        onChange={handleChange}
                        placeholder='Name'
                        maxLength={50}
                        size={50}
                    ></input>
                    <p className='Error'>{nameError}</p>
                    </label>

                    <p/>
                    <label className='FormContent'>Email Address: <input
                        required
                        name='emailAddress'
                        value={emailAddress}
                        onChange={handleChange}
                        placeholder='Email Address'
                        maxLength={70}
                        size={70}
                    ></input>
                    <p className='Error'>{emailAddressError}</p>
                    </label>

                    <p/>
                    <input
                        type='submit'
                        className='AddButton'
                        value='Add'
                    ></input>
                </form>
            </section>
        </div>
    );
}
