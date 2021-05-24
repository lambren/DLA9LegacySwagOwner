import React, {useState, useEffect} from 'react';

import {HOSTNAME} from './../Constants'
import SwagItem from './SwagItem'

import {useAlert} from 'react-alert';

const SwagList = (props) => {

    const[swag_item_id, setItemID] = useState('');
    const[swag_name, setItemName] = useState('');
    const[price, setItemPrice] = useState('DEFAULT');
    const[stock, setItemStock] = useState('DEFAULT');
    const[swag_image, setItemImage] = useState('');
    const[display, setDisplay] = useState('');

    const alert = useAlert();
    const [loading, setLoading] = useState(false);
    const [swagList, setSwagList] = useState([]);

    const [search, setSearch] = useState('');

    const onEditItem = (e) => {

        e.preventDefault();
        setLoading(true);
        fetch(HOSTNAME + 'edit-swag-item/', {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                swag_item_id,
                swag_name,
                swag_image,
                price,
                stock,
                display
            })
        }).then(res => res.json())
        .then(data => {
            if (data.status === 'SUCCESS')
                alert.success('SUCCESSFULLY UPDATED DATA');
            else if(data.reason === 'INFO')
                alert.error('YOU MUST FILL ALL FIELDS BEFORE ADDING NEW ITEM');
            else alert.error('SERVER ERROR, PLEASE CONTACT IT');
        }).catch(err => {
            console.log(err);
            alert.error('FAILED: CONNECTION ERROR, PLEASE CHECK YOUR INTERNET CONNECTION!');
        }).finally(() => {
            setItemID('');
            setItemName('');
            setItemPrice('DEFAULT');
            setItemStock('DEFAULT');
            setSearch('');
            setItemImage('');
            setLoading(false);
            getSwagList();
        });
    }
    
    const getSwagList = () => {

        setLoading(true);
        fetch(HOSTNAME + 'get-list-of-swag-mgmt/')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'SUCCESS')
                {
                    setSwagList(data.swag_items);
                }
                else 
                {
                    alert.err('FAILED TO GET SWAG ITEMS, PLEASE TRY AGAIN LATER!');
                }
            }).catch(err => {
                console.log(err);
                alert.error('CONNECTION ERROR! PLEASE CHECK YOUR INTERNET CONNECTION!');
            }).finally(() => {
                setLoading(false)

            });

    }

    useEffect(() => {
    
            setLoading(true);
            fetch(HOSTNAME + 'get-list-of-swag-mgmt/')
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'SUCCESS')
                    {
                        setSwagList(data.swag_items);
                    }
                    else 
                    {
                        alert.err('FAILED TO GET SWAG ITEMS, PLEASE TRY AGAIN LATER!');
                    }
                }).catch(err => {
                    console.log(err);
                    alert.error('CONNECTION ERROR! PLEASE CHECK YOUR INTERNET CONNECTION!');
                }).finally(() => setLoading(false));

    }, [alert])

    return (
        <div className='display'>
            <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                <h2>Swag Items List</h2>
                <input onChange={(e) => setSearch(e.target.value)} placeholder='Search item by name'></input>
                <div>
                    <a href={HOSTNAME + 'get-items-list/'}>Get CSV</a>
                    <button onClick={getSwagList} style={{marginLeft: '20px'}}>Refresh</button>
                </div>
            </div>
            <div id='list-wrapper'>
                <div className='swag-item' id='swag-header'>
                    <p>ID</p>
                    <p>Name</p>
                    <p>Price</p>
                    <p>Stock</p>
                    <p>Display</p>
                </div>
                {
                    (loading)? <div className='loader'></div> 
                    :
                    <div id='swag-list'>
                        {swagList.filter(item=>item.swag_name.toLowerCase().includes(search.toLowerCase())).filter(item=>item.swag_item_id.includes(swag_item_id)).map(item => <SwagItem key={item.swag_item_id} item={item}></SwagItem>)}
                    </div>
                }
            </div>

            <h2>Edit Item</h2>
            <div>
                {
                    (loading)? <div className='loader'></div> :
                    <form className='flex-wrap' onSubmit={onEditItem} style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}> 
                        <input placeholder='Enter item ID to edit' onChange = {e => setItemID(e.target.value)}></input>
                        <input placeholder='Enter correct name' onChange = {e => setItemName(e.target.value)}></input>
                        <input placeholder='Enter correct price' onChange = {e => setItemPrice(e.target.value)} ></input>
                        <input placeholder='Enter correct stock' onChange = {e => setItemStock(e.target.value)}></input>
                        <input placeholder='Enter correct image link' onChange = {e => setItemImage(e.target.value)}></input>
                        <label>Display</label>
                        <select onChange={(e) => setDisplay(e.target.value)}>
                            <option value=''>SELECT</option>
                            <option value='true'>Yes</option>
                            <option value='false'>No</option>
                        </select>
                        <button onClick={onEditItem}>Submit</button>
                    </form>
                }
            </div>


            
        </div>
    )
}

export default SwagList;
