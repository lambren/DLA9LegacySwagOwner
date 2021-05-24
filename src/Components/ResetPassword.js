import React, {useState} from 'react';
import {HOSTNAME} from './../Constants'
import {useAlert} from 'react-alert';

const ResetPassword = (props) => {

    const alert = useAlert();
    const [user_name, setUserName] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!user_name)
        {
            alert.error('YOU MUST ENTER ASSOCIATE LOGIN BEFORE CLICKING SUBMIT!');
            return;
        }
        
        setLoading(true);
        fetch(HOSTNAME + 'reset-password/' + user_name)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'SUCCESS')
                    alert.success('SUCCESSFULLY RESETED PASSWORD FOR ASSOCIATE!')
                else if (data.reason === 'NO_MATCH')
                    alert.error('ASSOCIATE LOGIN IS NOT ON RECORD');
                else alert.error('SERVER ERROR: PLEASE TRY AGAIN LATER OR CONTACT IT')
            }).catch(err => {
                console.log(err);
                alert.error('CONNECTION ISSUE, PLEASE CHECK YOUR INTERNET CONNECTION');
            }).finally(() => setLoading(false));
    }

    return (
    <div className='display'>
        {
            (loading) ? <div className='loader'></div> :
                <div>
                <h2>Password Reset</h2>
                <form onSubmit={onSubmit} style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <input onChange={(e)=>setUserName(e.target.value)}placeholder="Enter Associate's login to reset"></input>
                    <button onClick={onSubmit}>Submit</button>
                </form>
            </div>
        }
    </div>)
}

export default ResetPassword;