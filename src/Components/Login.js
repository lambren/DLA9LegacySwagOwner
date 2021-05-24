import React, {useState} from 'react';
import { useAlert } from 'react-alert';
import {HOSTNAME} from './../Constants'

const Login = (props) => {
    const setRoute = props.setRoute;
    const alert = useAlert();
    const [password, setPassword] = useState('');

    const onLogin = async (e) => {
        e.preventDefault();
        if (!props.manager_user_name || !password) alert.error('PLEASE INPUT BOTH ID AND PASSWORD TO LOGIN');
        else{
            setRoute('LOADING');
        try {
          const res = await fetch(HOSTNAME + 'manager-login', {
            method: 'POST', 
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
              user_name: props.manager_user_name.toLowerCase(),
              password,
            })
          })
    
          const data = await res.json();
          if (data.status === 'SUCCESS')  
          {
            setRoute('MAIN_SCREEN');
          }
          else if (data.reason === 'NOT_FOUND')
          {
            setRoute('INITIATE');
            alert.error('NO MATCHING COMBINATION FOUND');
          }
          else if (data.reason === 'NOT_ACTIVATED')
          {
            setRoute('INITIATE');
            alert.error('YOUR ACCOUNT IS NOT YET ACTIVATED BY THE SWAG STORE MANAGER');
          }
          else {
            setRoute('INITIATE');
            alert.error('SERVER ERROR');
          }
        } catch (e) {
          console.log(e);
            setRoute('INITIATE');
            alert.error('NETWORK ERROR PLEASE CHECK YOUR CONNECTION')
        }
    }
    }

    return (
        <div className='display'>
          <h3>Manager Login</h3>
          <form style={{color: 'gray'}} onSubmit={onLogin}>
            <label>ID</label>
            <input onChange={e => props.setManager(e.target.value)}></input>
            <label>Password</label>
            <input onChange={e=> setPassword(e.target.value)} type='password'></input>
            <button onClick={onLogin}>Login</button>
          </form> 
        </div>
    )
}

export default Login;