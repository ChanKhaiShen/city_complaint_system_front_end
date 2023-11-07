import { Outlet, Link } from 'react-router-dom';

import '../Styles.css';

export default function AdministratorLayout() {
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('emailAddress');
        window.location.replace('/');
    }

    return (
        <>
            <div className="TopBar">
                <h1>City Complaint System</h1>
                <h2>Administrator</h2>
                <nav>
                    <ul>
                        <li><Link className="Navigation" to="/">Manage Account</Link></li>
                        <li><Link className="Navigation" to="/statisticsreporting">Statistics Reporting</Link></li>
                        <li><Link className="Navigation" to="/managesystem">Manage System</Link></li>
                        <li><Link className="Navigation" to="/checkcomplaint">Check Complaint</Link></li>
                        <li className='SwitchPage'><button onClick={logout}>Logout</button></li>
                    </ul>
                </nav>
                
            </div>
            <Outlet/>
        </>
    );
}
