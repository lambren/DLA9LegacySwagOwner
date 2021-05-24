import React, {useState, createRef, useEffect} from 'react';
import {useAlert} from 'react-alert';
import {HOSTNAME} from '../Constants'

const AddSwagBadge = (props) => {
    const alert = useAlert();

    const [user_id, setUserId] = useState('');
    const [swag_amt, setSwag] = useState(0);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const amountRef = createRef();



    useEffect(()=> {
        if (!loading)
        {
            if (!amountRef.current.value) 
                amountRef.current.placeholder = swag_amt;
        }
    });


    const onSubmit = (e) => {
        e.preventDefault();


        
        if (!user_id || !reason || !swag_amt)
        {
            alert.error('YOU MUST FILL OUT ALL FIELDS BEFORE SUBMITTING');
            return;
        }

        const now = new Date();
        const today = now.toLocaleDateString();

        setLoading(true);
        fetch(HOSTNAME + 'add-balance/', {
            method:'POST',
            headers : {
                "Content-Type" : 'application/json'
            },
            body: JSON.stringify({
                user_data: user_id, 
                swag_amt,
                reason,
                manager_user_name: props.manager_user_name,
                date: today                
            })
        }).then(res => res.json())
        .then(data => {
            if (data.status === 'SUCCESS') alert.success(`SUCCESSFULLY ADDED ${swag_amt} SWAG TO ${data.user.user_name}`);
            else if (data.reason === 'NO_MATCH') alert.error(`ERROR: ${user_id} IS NOT FOUND IN RECORDS`);
            else alert.error('ERROR: SERVER ERROR PLEASE TRY AGAIN LATER');

        }).catch(e => {
            console.log(e);
            alert.error('CONNECTION ERROR, PLEASE CHECK YOUR INTERNET CONNECTION');
        }).finally(
            () => {
                setLoading(false);
                setUserId('');});
    }

    return (
        <div>
            <div> { (loading)? <div className='loader'></div> :
                <div>
                    <h2>Individual Swag Addition</h2>
                    <form onSubmit={onSubmit}>
                        <label>$</label>
                        <input id='amount' ref={amountRef} 
                            onChange={(e) => setSwag(e.target.value)}></input>
                
                        <input 
                            placeholder='Enter reason of distribution'
                            onChange={(e) => setReason(e.target.value)}></input>

                        <input 
                            placeholder='Scan Badge or enter Login' 
                            onChange={(e) => setUserId(e.target.value)}></input>
                        
                        <button onClick={onSubmit}>Submit</button>

                    </form>
                </div>
                }
            </div>
        </div>
    );

}

export default AddSwagBadge;