import React, {useState} from 'react';
import ListItem from './ListItem'
import BadgeScanDelivery from './BadgeScanDelivery'
import { HOSTNAME } from '../Constants';
import {useAlert} from 'react-alert';

const List = (props) => {
    const alert = useAlert();
    const {setLoading} = props;
    const [search, setSearch] = useState('');
    const [manager, setManager] = useState('');

    const onChangeSearch = (event) => {
        setSearch(event.target.value);
    }

    const onClearList = () => {
        setLoading(true);
        fetch(HOSTNAME + 'clear-being-fulfilled/', { 
            method: 'POST'
        }).then(res => res.json()).then(data => {
            if (data.status === 'SUCCESS') alert.success('CLEARED BEING FULFILLED');
            else alert.error('FAILED TO CLEAR BEING FULFILLED');
        }).catch(e => {
            alert.error('FAILED TO CLEAR BEING FULFILLED. PLEASE CHECK YOUR INTERNET CONNECTION')
        }).finally(() => props.getStore());
    }

    return (
    <div id='list'>
        <div style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>{props.title}</h2>
            <input placeholder='Search for login' onChange={onChangeSearch}></input>
            <input placeholder='Search by Manager' onChange={(e) => setManager(e.target.value)}></input>
            <button style={{marginTop:'0px'}} onClick={props.getStore}>Refresh</button>
        </div>
        <div id='inner-list'>
            {props.listOfOrders.filter(item => {
                if (manager && item.user_manager)
                    return item.user_name.includes(search) 
                        && item.user_manager.includes(manager);
                else return item.user_name.includes(search);
            }).map(item => <ListItem key={item.cart_id} getStore={props.getStore} item={item}/>)}
        </div>
        <div style={{display: (props.title === 'Fulfilled orders') ? 'block' : 'none', paddingTop: '15px'}}>
            <BadgeScanDelivery getStore={props.getStore}/>
        </div>

        <div style={{display: (props.title === 'Being Fulfilled orders') ? 'block' : 'none', paddingTop: '15px'}}>
            <button onClick={onClearList}>CLEAR LIST</button>
            <a href='https://tranquil-meadow-63605.herokuapp.com/print-labels'>Print Labels</a>
        </div>
    </div>)
}
export default List;