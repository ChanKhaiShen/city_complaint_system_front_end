import { Outlet, Link } from 'react-router-dom';

import '../Styles.css';

export default function ComplainantLayout() {
    function logout() {
        localStorage.clear();
        window.location.replace('http://localhost:3000/complainant');
    }

    return (
        <>
            <div className="TopBar">
                <h1>City Complaint System</h1>
                <nav>
                    <ul>
                        <li><Link className="Navigation" to="/checkcomplaint">Check Complaint Status</Link></li>
                        <li><Link className="Navigation" to="/">Lodge Complaint</Link></li>
                        <li><Link className="Navigation" to="/manageaccount">ManageAccount</Link></li>
                        <li className='SwitchPage'><button onClick={logout}>Logout</button></li>
                    </ul>
                </nav>
                
            </div>
            <Outlet/>
        </>
    );
}
