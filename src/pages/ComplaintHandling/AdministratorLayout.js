import { Outlet, Link } from 'react-router-dom';

import '../Styles.css';

export default function AdministratorLayout() {
    function logout() {
        localStorage.clear();
        window.location.replace('http://localhost:3000/administrator');
    }

    return (
        <>
            <div className="TopBar">
                <h1>City Complaint System</h1>
                <nav>
                    <ul>
                        <li><Link className="Navigation" to="/">Manage Complaints</Link></li>
                        <li><Link className="Navigation" to="/managesystem">Manage System</Link></li>
                        <li><Link className="Navigation" to="/statisticsreporting">Statistics Reporting</Link></li>
                        <li><Link className="Navigation" to="/manageaccount">ManageAccount</Link></li>
                        <li className='SwitchPage'><button onClick={logout}>Logout</button></li>
                    </ul>
                </nav>
                
            </div>
            <Outlet/>
        </>
    );
}
