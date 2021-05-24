import React, {useState} from 'react';
import {useAlert} from 'react-alert';

import {HOSTNAME} from './../Constants'

const CheckAssociate = (props) => {
    const alert = useAlert()
    const [user_id, setUserID] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        if (!user_id)
        {
            alert.error('YOU MUST ENTER ASSOCIATE LOGIN BEFORE CLICKING SUBMIT!');
            return;
        }
        window.open(HOSTNAME + "associate-status/" + user_id)
    }

    return (
        <div className='display'>
            <h2>Check Associate's Swag</h2>
                <form onSubmit={onSubmit} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <input placeholder='Scan Badge or enter Login' onChange={(e) => setUserID(e.target.value)}></input>
                    <button onClick={onSubmit}>Submit</button>
                </form>
        </div>
    )
}

export default CheckAssociate;