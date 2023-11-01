import { Outlet, Link } from 'react-router-dom';

import '../Styles.css';

export default function ComplaintHandlerLayout() {
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
                <nav>
                    <ul>
                        <li><Link className="Navigation" to="/">Check Complaint</Link></li>
                        <li><Link className="Navigation" to="/manageaccount">ManageAccount</Link></li>
                        <li className='SwitchPage'><button onClick={logout}>Logout</button></li>
                    </ul>
                </nav>
                
            </div>
            <Outlet/>
        </>
    );
}
