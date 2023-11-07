import { 
    Chart as ChartJS, 
    CategoryScale, 
    Title, 
    Legend,
    LinearScale,
    Tooltip,
    ArcElement,
    BarElement
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

import { useEffect, useState } from 'react';
import axios from 'axios';

import env from 'react-dotenv';

import '../Styles.css';

ChartJS.register(
    CategoryScale, 
    Title, 
    Legend,
    BarElement,
    LinearScale,
    Tooltip,
    ArcElement
);

export default function StatisticsReporting() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // General
    const [total, setTotal] = useState('');
    const [statusCounts, setStatusCounts] = useState([]);
    const [backgroundColors] = useState(['rgb(70, 50, 30)', 'rgb(70, 50, 60)', 'rgb(70, 50, 90)', 'rgb(70, 50, 120)', 'rgb(70, 50, 150)', 'rgb(70, 50, 180)']);

    // Area
    const [areaCounts, setAreaCounts] = useState([]);
    const [areaCountsByStatus, setAreaCountsByStatus] = useState({});

    // Category
    const [categoryCounts, setCategoryCounts] = useState([]);
    const [categoryCountsByStatus, setCategoryCountsByStatus] = useState({});

    // Table
    const [areaCategoryStatusCounts, setAreaCategoryStatusCounts] = useState([]);

    useEffect(
        ()=>{
            if (localStorage.getItem('token') === null) {
                window.location.reload();
                return;
            }

            const start = startDate === '' ? '' : '&startdate=' + startDate;
            const end = endDate === '' ? '' : '&enddate=' + endDate;

            const promises = [];

            // Total
            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `${env.SERVER_URL}/complaintcount?${start}${end}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(result=>{
                    console.log('get total', result);
                    setTotal(result.data.counts[0] == null ? '0' : result.data.counts[0].count);
                    resolve();
                }).catch(error=>{
                    console.log('get total', error);
                    if (error.response != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            // By area
            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `${env.SERVER_URL}/complaintcount?byarea=1&${start}${end}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(result=>{
                    console.log('get count by area', result);

                    const counts = result.data.counts;
                    const areaCounts = [];

                    for (var i = 0; i < counts.length; i++) {
                        areaCounts.push({
                            id: crypto.randomUUID(),
                            area: counts[i]._id.area,
                            count: counts[i].count
                        });
                    }

                    setAreaCounts(areaCounts.sort((a, b)=>{     // Sort count in descending order
                        if (a.count < b.count) 
                            return 1;
                        else if (a.count > b.count) 
                            return -1;
                        return 0;
                    })
                    .slice(0, 6));

                    axios.get(
                        `${env.SERVER_URL}/complaintcount?byarea=1&bystatus=1&${start}${end}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    ).then(response=>{
                        console.log('get count by area by status', result);
    
                        const counts = response.data.counts;
                        const topAreas = areaCounts.map(areaCount => areaCount.area);
                        const areaCountsByStatus = {
                            received: [],
                            progressing: [],
                            solved: []
                        };
                        
                        for (var j = 0; j < topAreas.length; j++) {
                            for (var k = 0; k < counts.length; k++) {
                                if (counts[k]._id.area === topAreas[j]) {
                                    if (counts[k]._id.status === 'Received') {
                                        areaCountsByStatus.received[j] = counts[k].count;
                                    }
                                    else if (counts[k]._id.status === 'Progressing') {
                                        areaCountsByStatus.progressing[j] = counts[k].count;
                                    }
                                    else if (counts[k]._id.status === 'Solved') {
                                        areaCountsByStatus.solved[j] = counts[k].count;
                                    }
                                }
                            }
                        }

                        setAreaCountsByStatus(areaCountsByStatus);
                        resolve();
    
                    }).catch(error=>{
                        console.log('get count by area by status', error);
                        if (error.response != null && error.response.status === 401) {
                            localStorage.removeItem('token');
                            window.location.reload();
                        }
                        resolve();
                    });

                }).catch(error=>{
                    console.log('get count by area', error);
                    if (error.response != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            // By category
            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `   ${env.SERVER_URL}/complaintcount?bycategory=1&${start}${end}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(result=>{
                    console.log('get count by category', result);
    
                    const counts = result.data.counts;
                    const categoryCounts = [];

                    for (var i = 0; i < counts.length; i++) {
                        categoryCounts.push({
                            id: crypto.randomUUID(),
                            category: counts[i]._id.category,
                            count: counts[i].count
                        });
                    }

                    setCategoryCounts(categoryCounts.sort((a, b)=>{
                        if (a.count < b.count) 
                            return 1;
                        else if (a.count > b.count) 
                            return -1;
                        return 0;
                    })
                    .slice(0, 6));

                    axios.get(
                        `${env.SERVER_URL}/complaintcount?bycategory=1&bystatus=1&${start}${end}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    ).then(response=>{
                        console.log('get count by category by status', result);
    
                        const counts = response.data.counts;
                        const topCategories = categoryCounts.map(categoryCount => categoryCount.category);
                        const categoryCountsByStatus = {
                            received: [],
                            progressing: [],
                            solved: []
                        };
                        
                        for (var j = 0; j < topCategories.length; j++) {
                            for (var k = 0; k < counts.length; k++) {
                                if (counts[k]._id.category === topCategories[j]) {
                                    if (counts[k]._id.status === 'Received') {
                                        categoryCountsByStatus.received[j] = counts[k].count;
                                    }
                                    else if (counts[k]._id.status === 'Progressing') {
                                        categoryCountsByStatus.progressing[j] = counts[k].count;
                                    }
                                    else if (counts[k]._id.status === 'Solved') {
                                        categoryCountsByStatus.solved[j] = counts[k].count;
                                    }
                                }
                            }
                        }

                        console.log(categoryCountsByStatus);
                        setCategoryCountsByStatus(categoryCountsByStatus);
                        resolve();
    
                    }).catch(error=>{
                        console.log('get count by category by status', error);
                        if (error.response != null && error.response.status === 401) {
                            localStorage.removeItem('token');
                            window.location.reload();
                        }
                        resolve();
                    });

                }).catch(error=>{
                    console.log('get count by category', error);
                    if (error.response != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            // By status
            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `${env.SERVER_URL}/complaintcount?bystatus=1&${start}${end}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(result=>{
                    console.log('get count by status', result);

                    const counts = result.data.counts;
                    const statusCounts = [];

                    for (var i = 0; i < counts.length; i++) {
                        statusCounts.push({
                            id: crypto.randomUUID(),
                            status: counts[i]._id.status,
                            count: counts[i].count
                        });
                    }

                    setStatusCounts(statusCounts.sort((a, b)=>{
                        if (a.count < b.count) 
                            return 1;
                        else if (a.count > b.count) 
                            return -1;
                        return 0;
                    }));

                    resolve();

                }).catch(error=>{
                    console.log('get count by status', error);
                    if (error.response != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            // By area, category, status
            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `${env.SERVER_URL}/complaintcount?byarea=1&bycategory=1&bystatus=1&${start}${end}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(result=>{
                    console.log('get count by area, category, status', result);

                    const counts = result.data.counts;
                    const areaCategoryStatusCounts = [];

                    for (var i = 0; i < counts.length; i++) {
                        const area = counts[i]._id.area;
                        const category = counts[i]._id.category;

                        if (areaCategoryStatusCounts.find(count => count.area === area && count.category === category) == null) {
                            areaCategoryStatusCounts.push({
                                id: crypto.randomUUID(),
                                area: area,
                                category: category,
                            });
                        }
                    }

                    for (var j = 0; j < areaCategoryStatusCounts.length; j++) {

                        for (var k = 0; k < counts.length; k++) {

                            if (counts[k]._id.area === areaCategoryStatusCounts[j].area && counts[k]._id.category === areaCategoryStatusCounts[j].category) {
                                
                                if (counts[k]._id.status === 'Received') {
                                    areaCategoryStatusCounts[j].received = counts[k].count;
                                }
                                else if (counts[k]._id.status === 'Progressing') {
                                    areaCategoryStatusCounts[j].progressing = counts[k].count;
                                }
                                else if (counts[k]._id.status === 'Solved') {
                                    areaCategoryStatusCounts[j].solved = counts[k].count;
                                }

                            }

                        }

                        const receivedCount = areaCategoryStatusCounts[j].received == null ? 0 : areaCategoryStatusCounts[j].received;
                        const progressingCount = areaCategoryStatusCounts[j].progressing == null ? 0 : areaCategoryStatusCounts[j].progressing;
                        const solvedCount = areaCategoryStatusCounts[j].solved == null ? 0 : areaCategoryStatusCounts[j].solved;

                        const totalCount = receivedCount + progressingCount + solvedCount;
                        areaCategoryStatusCounts[j].total = totalCount;
                    }

                    console.log(areaCategoryStatusCounts);
                    setAreaCategoryStatusCounts(areaCategoryStatusCounts);
                    resolve();

                }).catch(error=>{
                    console.log('get count by area, category, status', error);
                    if (error.response != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            Promise.all(promises).then(result=>{
                console.log('All data has been loaded', result);
            }).catch(error=>{
                console.log('Error when lolading data', error);
            });
        },
        [startDate, endDate]
    );

    function handleChange(event) {
        if (event.target.name === 'startDate')
            setStartDate(event.target.value);
        else
            setEndDate(event.target.value);
    }

    function sortCounts(column, order, isNumber) {
        const table = document.getElementById('allCounts');
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
                    if (isNumber === true) {
                        if (parseInt(aText) > parseInt(bText)) {
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
                    if (isNumber === true) {
                        if (parseInt(aText) < parseInt(bText)) {
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

    return (
        <div className='Content'>
            <h1>Statistics Reporting</h1>
            
            <section className="Box">
                <h1>Specify period of time: </h1>
                <label className='ChartTop'>
                    Start Date: 
                    &nbsp;
                    <input
                        type='date'
                        name='startDate'
                        value={startDate}
                        onChange={handleChange}
                        max={endDate !== '' ? endDate : (new Date(Date.now()).toISOString()).slice(0,10)}
                    ></input>
                </label>
                <label className='ChartTop'>
                    End Date: 
                    &nbsp;
                    <input
                        type='date'
                        name='endDate'
                        value={endDate}
                        onChange={handleChange}
                        min={startDate !== '' ? startDate : (new Date(Date.now()).toISOString()).slice(0,10)}
                    ></input>
                </label>

                <h3>Total number of cases: {total}</h3>
                <h3>Received: {statusCounts.find(count => count.status === 'Received') == null ? '0' : statusCounts.find(count => count.status === 'Received').count.toString()}</h3>
                <h3>Progressing: {statusCounts.find(count => count.status === 'Progressing') == null ? '0' : statusCounts.find(count => count.status === 'Progressing').count.toString()}</h3>
                <h3>Solved: {statusCounts.find(count => count.status === 'Solved') == null ? '0' : statusCounts.find(count => count.status === 'Solved').count.toString()}</h3>
            </section>
            
            <section className="InlineChart">
                <section className='PieChartContent'>
                    <Pie
                        data={
                            {
                                labels: categoryCounts.map(categoryCount => categoryCount.category),
                                datasets: [
                                    {
                                        backgroundColor: backgroundColors.slice(0, categoryCounts.length),
                                        data: categoryCounts.map(categoryCount => categoryCount.count)
                                    }
                                ]
                            }
                        }
                        options={
                            {
                                responsive: true,
                                plugins: {
                                    title: {
                                        text: `Fraction of cases based on category${startDate===''?'':' from '+startDate}${endDate===''?'':' until '+endDate}`,
                                        display: true,
                                        padding: {
                                            top: 10,
                                            bottom: 10
                                        },
                                        font: {
                                            size: 30,
                                            weight: 'bold'
                                        },
                                        color: 'black'
                                    },
                                    legend: {
                                        display: true
                                    }
                                }
                            }
                        }
                    ></Pie>
                </section>

                <section className='PieChartContent'>
                    <Pie
                        data={
                            {
                                labels: areaCounts.map(areaCount => areaCount.area),
                                datasets: [
                                    {
                                        backgroundColor: backgroundColors.slice(0, areaCounts.length),
                                        data: areaCounts.map(areaCount => areaCount.count)
                                    }
                                ]
                            }
                        }
                        options={
                            {
                                responsive: true,
                                plugins: {
                                    title: {
                                        text: `Fraction of cases based on area${startDate===''?'':' from '+startDate}${endDate===''?'':' until '+endDate}`,
                                        display: true,
                                        padding: {
                                            top: 10,
                                            bottom: 10
                                        },
                                        font: {
                                            size: 30,
                                            weight: 'bold'
                                        },
                                        color: 'black'
                                    },
                                    legend: {
                                        display: true
                                    }
                                }
                            }
                        }
                    ></Pie>
                </section>

                <section className='PieChartContent'>
                    <Pie
                        data={
                            {
                                labels: statusCounts.map(statusCount => statusCount.status),
                                datasets: [
                                    {
                                        backgroundColor: backgroundColors.slice(0, statusCounts.length),
                                        data: statusCounts.map(statusCount => statusCount.count)
                                    }
                                ]
                            }
                        }
                        options={
                            {
                                responsive: true,
                                plugins: {
                                    title: {
                                        text: `Fraction of cases based on status${startDate===''?'':' from '+startDate}${endDate===''?'':' until '+endDate}`,
                                        display: true,
                                        padding: {
                                            top: 10,
                                            bottom: 10
                                        },
                                        font: {
                                            size: 30,
                                            weight: 'bold'
                                        },
                                        color: 'black'
                                    },
                                    legend: {
                                        display: true
                                    }
                                }
                            }
                        }
                    ></Pie>
                </section>
            </section>

            <br/>
            <section className="InlineChart">
                <section className='BarChartContent'>
                    <Bar
                        data={
                            {
                                labels: areaCounts.map(areaCount => areaCount.area),
                                datasets: [
                                    {
                                        label: 'Received',
                                        backgroundColor: backgroundColors[0],
                                        data: areaCountsByStatus.received,
                                        stack: 'Stack 0'
                                    },
                                    {
                                        label: 'Progressing',
                                        backgroundColor: backgroundColors[1],
                                        data: areaCountsByStatus.progressing,
                                        stack: 'Stack 0'
                                    },
                                    {
                                        label: 'Solved',
                                        backgroundColor: backgroundColors[2],
                                        data: areaCountsByStatus.solved,
                                        stack: 'Stack 0'
                                    }
                                ]
                            }
                        }
                        options={
                            {
                                indexAxis: 'y',
                                responsive: true,
                                plugins: {
                                    title: {
                                        text: `Number of cases by area${startDate===''?'':' from '+startDate}${endDate===''?'':' until '+endDate}`,
                                        display: true,
                                        padding: {
                                            top: 10,
                                            bottom: 10
                                        },
                                        font: {
                                            size: 30,
                                            weight: 'bold'
                                        },
                                        color: 'black'
                                    },
                                    legend: {
                                        display: true
                                    }
                                },
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Number of cases',
                                            color: 'black',
                                            font: {
                                                size: 15
                                            }
                                        },
                                        stacked: true
                                    },
                                    y: {
                                        title: {
                                            display: true,                                            
                                            text: 'Area',
                                            color: 'black',
                                            font: {
                                                size: 15
                                            }
                                        },
                                        stacked: true
                                    }
                                }
                            }
                        }
                    ></Bar>
                </section>

                <section className='BarChartContent'>
                    <Bar
                        data={
                            {
                                labels: categoryCounts.map(categoryCount => categoryCount.category),
                                datasets: [
                                    {
                                        label: 'Received',
                                        backgroundColor: backgroundColors[0],
                                        data: categoryCountsByStatus.received,
                                        stack: 'Stack 0'
                                    },
                                    {
                                        label: 'Progressing',
                                        backgroundColor: backgroundColors[1],
                                        data: categoryCountsByStatus.progressing,
                                        stack: 'Stack 0'
                                    },
                                    {
                                        label: 'Solved',
                                        backgroundColor: backgroundColors[2],
                                        data: categoryCountsByStatus.solved,
                                        stack: 'Stack 0'
                                    }
                                ]
                            }
                        }
                        options={
                            {
                                indexAxis: 'y',
                                responsive: true,
                                plugins: {
                                    title: {
                                        text: `Number of cases by category${startDate===''?'':' from '+startDate}${endDate===''?'':' until '+endDate}`,
                                        display: true,
                                        padding: {
                                            top: 10,
                                            bottom: 10
                                        },
                                        font: {
                                            size: 30,
                                            weight: 'bold'
                                        },
                                        color: 'black'
                                    },
                                    legend: {
                                        display: true
                                    }
                                },
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Number of cases',
                                            color: 'black',
                                            font: {
                                                size: 15
                                            }
                                        },
                                        stacked: true
                                    },
                                    y: {
                                        title: {
                                            display: true,                                            
                                            text: 'Category',
                                            color: 'black',
                                            font: {
                                                size: 15
                                            }
                                        },
                                        stacked: true
                                    }
                                }
                            }
                        }
                    ></Bar>
                </section>
            </section>

            <br/>
            <section className="Box">
                <h2>Case counts</h2>

                <button className="SortButton" onClick={()=>{sortCounts(0, 'ascending')}}>Area (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(1, 'ascending')}}>Category (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(2, 'ascending', true)}}>Received (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(3, 'ascending', true)}}>Progressing (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(4, 'ascending', true)}}>Solved (Ascending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(5, 'ascending', true)}}>Total (Ascending)</button>
                
                <p/>
                <button className="SortButton" onClick={()=>{sortCounts(0, 'descending')}}>Area (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(1, 'descending')}}>Category (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(2, 'descending', true)}}>Received (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(3, 'descending', true)}}>Progressing (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(4, 'descending', true)}}>Solved (Descending)</button>
                &nbsp;
                <button className="SortButton" onClick={()=>{sortCounts(5, 'descending', true)}}>Total (Descending)</button>

                <br/>
                <p/>
                <div className='Table'>
                    <table id="allCounts">
                        <thead>
                            <tr>
                                <th>Area</th>
                                <th>Category</th>
                                <th>Received</th>
                                <th>Progressing</th>
                                <th>Solved</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areaCategoryStatusCounts.map(count=>{
                                return(
                                    <tr key={count.id}>
                                        <td>{count.area}</td>
                                        <td>{count.category}</td>
                                        <td>{count.received == null ? '0' : count.received.toString()}</td>
                                        <td>{count.progressing == null ? '0' : count.progressing.toString()}</td>
                                        <td>{count.solved == null ? '0' : count.solved.toString()}</td>
                                        <td>{count.total.toString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <br/>
                </div>
            </section>
            
            <br/>
        </div>
    );
}
