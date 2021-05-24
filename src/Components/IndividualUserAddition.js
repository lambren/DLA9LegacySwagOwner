import React , {useState} from 'react'
import {useAlert} from 'react-alert'
import { HOSTNAME } from './../Constants'

const IndividualUserAddition = (props) => {
    const [loading, setLoading] = useState(false);

    const [user_id, setUserId] = useState('');
    const [user_name, setUserName] = useState('');
    const [user_first_name, setUserFirstName] = useState('');
    const [user_manager, setManager] = useState('');

    const alert = useAlert();

    const onSubmit = () => {
        if (!user_id || !user_name || !user_first_name || !user_manager) alert.error('ALL FIELDS ARE REQUIRED BEFORE SUBMITTING!');
        else 
        {
            setLoading(true);
            
            fetch(HOSTNAME + 'add-user/', 
            {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    user_id, 
                    user_name, 
                    user_first_name,
                    user_manager
                })
            }).then(res => {
                return res.json();
            }).then(data => {
                if (data.status === 'SUCCESS') alert.success('SUCCESSFULLY ADDED NEW ASSOCIATE');
                else if (data.reason === 'UNIQUE') alert.error('BADGE ID OR LOGIN ALREADY EXIST!');
                else if (data.reason === 'DATA') alert.error('INVALID INFORMATION FORMAT');
                else alert.error('SERVER ERROR, PLEASE CONTACT IT');
            }).catch(e =>  {
                alert.error('NETWORK ERROR, PLEASE CHECK YOUR CONNECTION');
                console.log(e);
            }).finally(() => {
                setLoading(false);

                setUserId('');
                setUserName('');
                setUserFirstName('');
                setManager('');
            })
        }
        
    }


    return (
        <div>
        {   
            (loading) ?
            <div classname='loader'/> :
            <div>
                <input onChange={(e) => setUserId(e.target.value)} placeholder='Badge Number'></input>
                <input onChange={(e) => setUserName(e.target.value)} placeholder='Login'></input>
                <input onChange={(e) => setUserFirstName(e.target.value)} placeholder='First Name'></input>
                <input onChange={(e) => setManager(e.target.value)} placeholder='Manager'></input>
                <button onClick={onSubmit}>Submit</button>
            </div>
        }
        </div>
    )
}

export default IndividualUserAddition;