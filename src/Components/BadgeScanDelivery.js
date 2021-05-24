import React, {useState} from 'react'; 

import {useAlert} from 'react-alert';
import {HOSTNAME} from './../Constants';

const BadgeScanDelivery = (props) => {

    const alert = useAlert();

    const [loading, setLoading] = useState(false);
    const [user_id, setUserId] = useState('');


    const onSubmit = (event) => {

        event.preventDefault();

        if (!user_id)
        {
            alert.error('YOU MUST SCAN ASSOCIATE BADGE BEFORE CLICKING SUBMIT');
            return;
        }

        setLoading(true);
        fetch(HOSTNAME + 'delivery-by-badge/', {
            method: 'POST',
            headers : {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user_id
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'SUCCESS')
                    alert.success(`SUCESSFULLY MARKED ${data.count} ORDERS FOR DELIVERY!`);
                else if (data.reason === 'NOT_FOUND')
                    alert.error('ASSSOCIATE DOES NOT HAVE ANY FULFILLED ORDERS!');
                else alert.error('SERVER ERROR, PLEASE TRY AGAIN LATER OR CONTACT IT');
            })
            .catch(err => {
                console.log(err);
                alert.error('CONNECTION ISSUE, PLEASE CHECK YOUR INTERNET CONNECTION!');
            })
            .finally(() => {
                setUserId('');
                setLoading(false);
                props.getStore();
            })
        
    }

    return(
        <div style={{display:'flex', flexDirection: 'row', justifyContent:'left', alignItems: 'center'}}>
            <h2>Delivery by Badge Scan</h2>
            <div>
            {
                (loading)? <div className='loader'></div> :
                <form onSubmit={onSubmit}>
                    <input placeholder='Scan Associate Badge To Deliver Orders'
                        onChange={(e) => setUserId(e.target.value)}></input>
                </form>
            }
            </div>
        </div>
    )
}

export default BadgeScanDelivery;