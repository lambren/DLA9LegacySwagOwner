import React , {useEffect, useState} from 'react'
import {useAlert} from 'react-alert'
import {HOSTNAME} from './../Constants'

const ManagerApproval = (props) => {
    const alert = useAlert();
    const [approvalList, setApprovalList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = () => {
        setLoading(true);
        fetch(HOSTNAME + 'manager-list/')
        .then(res => res.json()).then(data => {
            if (data.status === 'SUCCESS')
            setApprovalList(data.data);
        }).catch(e => {
            console.log(e);
            alert.error('NETWORK ERROR, PLEASE CHECK YOUR CONNECTION');
        }).finally( () => {
        setLoading(false);
        });
    }

    useEffect(getData, [])
    
    const activate = (user_name) => {
        setLoading(true);
        fetch(HOSTNAME + 'manager-activation/', {
            method: 'POST', 
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                user_name
            })
        }).then(res => res.json())
        .then (data => {
            if (data.status === 'SUCCESS')
                alert.success('SUCCESSFULLY ACTIVATED MANAGER');
            else alert.error('SERVER ERROR')
        }).catch(e => {
            console.log(e);
            alert.error('CONNECTION ERROR, PLEASE CHECK YOUR INTERNET');
        }).finally(() => {
            getData();
        })
    }

    const chooseLoading = () => {
        switch(loading){
            case true:
                return (<div className='loader'></div>)
            default:
                return (approvalList.map(item => 
                    <div key={item.user_name} style={{display:'flex',
                         flexDirection: 'row',
                         justifyContent:'space-between', 
                         alignItems: 'center',
                         backgroundColor: 'white',
                         paddingRight: '50px'}}>

                        <p>{item.user_name}</p>
                        {(item.active)? <p style={{ borderRadius: '5px',
                            backgroundColor: 'rgb(0, 209, 108)', 
                            padding: '10px',
                            fontWeight: 'bold',
                            color: 'white'}}>Activated</p> :
                        <button onClick={() => activate(item.user_name)}  style={{display: 'inline'}}>Activate</button>}

                    </div>))
        }
    }

    return (<div className='display'>
        <h3  style={{display: 'inline'}}>Manager Approval</h3>
        <button onClick={getData}  style={{display: 'inline'}}>Refresh</button>
        <div style ={{backgroundColor: 'white',
                         borderRadius: '10px',
                         maxHeight: '400px',
                         overflowY: 'scroll',
                         padding: '5px',
                         display: 'grid',
                         gridTemplateColumns: '1fr 1fr 1fr 1fr',}}>
            {chooseLoading()}
        </div>
    </div>)
}

export default ManagerApproval;