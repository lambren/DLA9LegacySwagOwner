import React, {useState} from 'react';
import { useAlert } from 'react-alert';
import {HOSTNAME} from './../Constants'

const Login = (props) => {
    const alert = useAlert();

    const [loading, setLoading] = useState(false);
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password !== confirmPassword)
            alert.error('PASSWORD CONFIRMATION DOES NOT MATCH PLEASE CHECK');
        else if (!id || !password || !confirmPassword)
            alert.error('YOU MUST FILL ALL FIELDS TO REGISTER')
        else {
            try {
            const res = await fetch(HOSTNAME + 'manager-registration/', {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    user_name: id.toLowerCase(),
                    password,
                })
            })
        
            const data = await res.json();

            if (data.status === 'SUCCESS')
                alert.success('YOUR REQUEST HAS BEEN SUBMITTED, THE SWAG STORE MANAGER WILL CONFIRM THAT YOU ARE A MANAGER AND ACTIVATE YOUR ACCOUNT WITHIN 24HR')

            else if (data.reason === 'NOT_ACTIVATED')
                alert.error('YOUR ACCOUNT IS NOT YET ACTIVATED BY THE SWAG STORE MANAGER');

            else if (data.reason === 'DUPLICATE')
                alert.error('THIS LOGIN HAS BEEN REGISTERED AS A MANAGER ALREADY')

            else alert.error('SERVER ERROR');

            } catch (e) {
                alert.error('NETWORK ERROR PLEASE CHECK YOUR CONNECTION')
            }
            setID('');
            setPassword('');
            setConfirmPassword('');
        }
        setLoading(false);
    }
    
    const chooseRoute = () => {
        switch(loading){
            case true: return <div className='loader'></div>
            default: return (
                <div className='display'>
                  <h3>Manager Registration</h3>
                  <p style={{color: 'gray'}}>Welcome to our new security login! Please register with your Amazon Login!<br/>
                    After you have successfully registered with your Amazon Login, the SWAG store manager will confirm <br/>
                    your information through Amazon Phonetool and activate your account within 24 hours. <br/>
                    This tool is available to Managers/Process Assistants/Shift Assistants (L3+)<br/>
                    Thank you for your support!
                    </p>
                  <form style={{color: 'gray'}} onSubmit={onLogin}>
                    <label>ID</label>
                    <input onChange={e => setID(e.target.value)}></input>
                    <label>Password</label>
                    <input onChange={e=> setPassword(e.target.value)} type='password'></input>
                    <label>Confirm Password</label>
                    <input onChange={e=> setConfirmPassword(e.target.value)} type='password'></input>
                    <button onClick={onLogin}>Register</button>
                  </form> 
                </div>
            )
        }
    }

    return (
        <div>
            {chooseRoute()}
        </div>
    )
}

export default Login;