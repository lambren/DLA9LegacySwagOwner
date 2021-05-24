import React , {useState} from 'react';
import {useAlert} from 'react-alert'

import {HOSTNAME} from './../Constants'
import './../App.scss'

const ListItem = (props) => {
    const alert = useAlert();
    const {item} = props;

    const [loading, setLoading] = useState(false);

    const [confirm, setConfirm] = useState(false);
    const [confirmType, setConfirmType] = useState('');

    /*
    const printLabel = () => {
        window.open(HOSTNAME+'print-label/'+item.cart_id);
    }
    */

    const deliverOrder = () => {
        setLoading(true);
        fetch(HOSTNAME + 'temp-delivery/', 
        {
            method: 'POST',
            headers : 
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                cart_id: item.cart_id,
            })
        }).then(res => res.json())
        .then(data => {
            if (data.status==='SUCCESS')
                alert.success('SUCCESSFULLY MARKED ORDER AS DELIVERED');
            else alert.error('ERROR, PLEASE TRY AGAIN LATER OR WRITE DOWN ORDER PULLED');

        }).catch(err => {
            console.log(err);
            alert.error('CONNECTION ERROR. PLEASE CHECK YOUR CONNECTION!');
        }).finally(() => {
            setLoading(false);
            props.getStore();
        })
    }


    const fulfillOrder = () => {
        setLoading(true);
        fetch(HOSTNAME + 'fulfill-order/', 
        {
            method: 'POST',
            headers : 
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                cart_id: item.cart_id,
            })
        }).then(res => res.json())
        .then(data => {
            if (data.status==='SUCCESS')
                alert.success('SUCCESSFULLY FULFILLED ORDER');
            else alert.error('ERROR IN FULFILLING ORDER, PLEASE TRY AGAIN LATER');

        }).catch(err => {
            console.log(err);
            alert.error('CONNECTION ERROR. PLEASE CHECK YOUR CONNECTION!');
        }).finally(() => {
            setLoading(false);
            props.getStore();
        })
    }

    const cancelOrder = () => {
        setLoading(true);
        fetch(HOSTNAME + 'cancel-order/', 
        {
            method :'POST',
            headers :
            {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(
            {
                cart_id: item.cart_id,
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.status === 'SUCCESS') alert.success('SUCESSFULLY CANCELLED ORDER');
            else alert.error('SOMETHING WENT WRONG, PLEASE TRY AGAIN LATER');
        })
        .catch(err => {
            console.log(err);
            alert.error('CANNOT CONNECT TO SERVER, PLEASE TRY AGAIN LATER');
        })
        .finally(()=>{
            setLoading(false);
            props.getStore();
        })
    }

    const backOrder = () => {
        setLoading(true);
        fetch(HOSTNAME + 'back-order/', 
        {
            method :'POST',
            headers :
            {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(
            {
                cart_id: item.cart_id,
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.status === 'SUCCESS') alert.success('SUCESSFULLY BACK ORDERED');
            else alert.error('SOMETHING WENT WRONG, PLEASE TRY AGAIN LATER');
        })
        .catch(err => {
            console.log(err);
            alert.error('CANNOT CONNECT TO SERVER, PLEASE CHECK YOUR INTERNET CONNECTION');
        })
        .finally(()=>{
            setLoading(false);
            props.getStore();
        })
    }

    const displayButton = () => {
        switch (confirmType) {
            case 'FULFILL':
                return(
                    <div>
                        <button className='cancel-button' onClick={() => setConfirm(false)}>Go Back</button>
                        <button className='confirm-button' onClick={fulfillOrder}>Confirm Fulfillment</button>
                    </div>
                );

            case 'CANCEL':
                return(
                    <div>
                        <button className='cancel-button' onClick={() => setConfirm(false)}>Go Back</button>
                        <button className='cancel-button' onClick={cancelOrder}>Confirm Cancellation</button>
                    </div>
                );
            
            case 'DELIVER':
                return(
                    <div>
                        <button className='cancel-button' onClick={() => setConfirm(false)}>Go Back</button>
                        <button className='confirm-button' onClick={deliverOrder}>Confirm order Delivery</button>
                    </div>
                )
            default: return(<div></div>);
        }
    }

    const selectColor = () => {
        switch(item.status) {
            case 'RECEIVED': return {backgroundColor: '#00b7ff'}
            case 'FULFILLED' : return {backgroundColor: '#6ac482'}
            case 'BACKORDERED' : return {backgroundColor: '#c9cc00' }
            default: return {backgroundColor: '#00b7ff'};
        }
    }

    return (
        
        <div id='list-item' style={selectColor()}>
            <div style={{display: (loading)? 'inline' : 'none'}} className='loader big-load'></div>
            <p className='bold'>{item.user_name}</p>      
            <p>Name: {item.user_first_name}, Manager: {item.user_manager} </p>
            <p>{item.swag_name} quantity: {item.quantity}</p>
            {
                (item.status==='RECEIVED' || item.status==='BACKORDERED')? 
                <div>
                    {(confirm)?
                    <div>
                        {displayButton()}
                    </div>
                    :
                    <div>
                        <button className='cancel-button' onClick={() => {setConfirmType('CANCEL'); setConfirm(true);}}>Cancel Order</button>
                        <button onClick={backOrder}>Back Order</button>
                        <button onClick={() => {setConfirmType('FULFILL'); setConfirm(true)}}>Fullfill Order</button>
                        <button onClick={() => {setConfirmType('DELIVER'); setConfirm(true)}}>Deliver Order</button>
                    </div>
                }
                </div>
                :
                <div>
                    {(confirm)?
                    <div>
                        {displayButton()}
                    </div>
                    :
                    <div>
                        <button className='cancel-button' onClick={() => {setConfirmType('CANCEL'); setConfirm(true);}}>Cancel Order</button>
                        <button onClick={() => {setConfirmType('DELIVER'); setConfirm(true)}}>Deliver Order</button>
                    </div>
                }
                </div>
            }
        </div>
    )
}

export default ListItem;