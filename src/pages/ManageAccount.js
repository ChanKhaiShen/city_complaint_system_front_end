export default function ManageAccount() {
    return (
        <div className='Content'>
            <p/>

            <section className='Box'>
                <div className='DetailsContent'>
                    <h2>Account Information</h2>

                    <p>Email Address: {localStorage.getItem('emailAddress')}</p>
                    <p>Name: {localStorage.getItem('name')}</p>
                    <p>Role: {localStorage.getItem('role')}</p>
                </div>
            </section>
            <p/>
        </div>
    );
}
