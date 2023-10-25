import Chart from 'chart.js/auto';
import { CategoryScale, Title, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from 'react';
import axios from 'axios';

import env from 'react-dotenv';

import '../Styles.css';

Chart.register(CategoryScale, Title, Legend);

export default function StatisticsReporting() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [total, setTotal] = useState('');

    const [areaData, setAreaData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(
        ()=>{
            if (localStorage.getItem('token') === null) {
                window.location.reload();
                return;
            }

            const start = startDate === '' ? '' : '&startdate=' + startDate;
            const end = endDate === '' ? '' : '&enddate=' + endDate;

            const promises = [];

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
                    setTotal(result.data.counts[0].count);
                    resolve();
                }).catch(error=>{
                    console.log('get total', error);
                    if (error.response.status != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `${env.SERVER_URL}/complaintcount?groupby=area${start}${end}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(result=>{
                    console.log('get count by area', result);

                    const counts = result.data.counts;
                    const areaInfo = [];
                    for (var i = 0; i < counts.length; i++) {
                        const id = crypto.randomUUID();
                        const name = counts[i]._id;
                        const count = counts[i].count;
                        const colors = [];
                        for (var j = 0; j < 3; j++) {
                            const randomNumber = Math.floor(Math.random() * 256);
                            colors.push(randomNumber);
                        }
                        const backgroundColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
                        areaInfo.push({
                            id: id,
                            name: name,
                            count: count,
                            backgroundColor: backgroundColor
                        });
                    }
                    console.log(areaInfo);
                    setAreaData(areaInfo);
                    resolve();
                }).catch(error=>{
                    console.log('get count by area', error);
                    if (error.response.status != null && error.response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                    resolve();
                });
            }));

            promises.push(new Promise((resolve, reject)=>{
                axios.get(
                    `   ${env.SERVER_URL}/complaintcount?groupby=category${start}${end}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(result=>{
                    console.log('get count by category', result);
    
                    const counts = result.data.counts;
                    const categoryInfo = [];
                    for (var i = 0; i < counts.length; i++) {
                        const id = crypto.randomUUID();
                        const name = counts[i]._id;
                        const count = counts[i].count;
                        const colors = [];
                        for (var j = 0; j < 3; j++) {
                            const randomNumber = Math.floor(Math.random() * 256);
                            colors.push(randomNumber);
                        }
                        const backgroundColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
                        categoryInfo.push({
                            id: id,
                            name: name,
                            count: count,
                            backgroundColor: backgroundColor
                        });
                    }
                    console.log(categoryInfo);
                    setCategoryData(categoryInfo);
                    resolve();
                }).catch(error=>{
                    console.log('get count by area', error);
                    if (error.response.status != null && error.response.status === 401) {
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

    return (
        <div className='Content'>
            <h1>Statistics Reporting</h1>
            
            <section className='ChartTop'>
                <label className='ChartTop'>Start Date: <input
                        type='date'
                        name='startDate'
                        value={startDate}
                        onChange={handleChange}
                        max={new Date(endDate) < new Date(Date.now()) ? endDate : new Date(Date.now()).toISOString().slice(0,10)}
                    ></input>
                </label>
                <label className='ChartTop'>End Date: <input
                        type='date'
                        name='endDate'
                        value={endDate}
                        onChange={handleChange}
                        min=''
                    ></input>
                </label>
                <h1>Total Complaints: {total}</h1>
            </section>
            
            <section className='ChartContent'>
                <Bar
                    data={
                        {
                            labels: areaData.map(area=>area.name),
                            datasets: [
                                {
                                    backgroundColor: areaData.map(area=>area.backgroundColor),
                                    data: areaData.map(area=>area.count)
                                }
                            ]
                        }
                    }
                    options={
                        {
                            plugins: {
                                title: {
                                    text: 'Number of cases by area',
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
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    min: 0,
                                    title: {
                                        display: true,
                                        text: 'Number of cases',
                                        color: 'black',
                                        font: {
                                            size: 15
                                        }
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Area',
                                        color: 'black',
                                        font: {
                                            size: 15
                                        }
                                    }
                                }
                            }
                        }
                    }
                ></Bar>
            </section>

            <section className='ChartContent'>
                <Bar
                    data={
                        {
                            labels: categoryData.map(category=>category.name),
                            datasets: [
                                {
                                    backgroundColor: categoryData.map(category=>category.backgroundColor),
                                    data: categoryData.map(category=>category.count)
                                }
                            ]
                        }
                    }
                    options={
                        {
                            plugins: {
                                title: {
                                    text: 'Number of cases by category',
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
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    min: 0,
                                    title: {
                                        display: true,
                                        text: 'Number of cases',
                                        color: 'black',
                                        font: {
                                            size: 15
                                        }
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Category',
                                        color: 'black',
                                        font: {
                                            size: 15
                                        }
                                    }
                                }
                            }
                        }
                    }
                ></Bar>
            </section>
            
        </div>
    );
}
