import React, {useEffect, useState} from 'react';
import {useAlert} from 'react-alert'

import {HOSTNAME} from './Constants'

import List from './Components/List'
import SwagList from './Components/SwagList'
import ResetPassword from './Components/ResetPassword'
import CheckAssociate from './Components/CheckAssociate'
import MassUpload from './Components/MassUpload'
import AddUser from './Components/AddUser'
import ManagerApproval from './Components/ManagerApproval'
import Login from './Components/Login'
import Register from './Components/Register'
import CommentSection from './Components/CommentSection'

import './App.scss';


function App() {
  const alert = useAlert();

  const [route, setRoute] = useState('INITIATE');
  const [manager_user_name, setManager] = useState('');

  const [loading, setLoading] = useState(false);
  const [listOfOrders, setListOfOrder] = useState([]);
  const [beingFulfilled, setBeingFulfilled] = useState([])

  const getStore = () => {
    setLoading(true);
    fetch(HOSTNAME + 'get-order-list-mgmt/')
    .then(res => res.json())
    .then(data=>{
      if(data.status === 'SUCCESS')
      {
        setListOfOrder(data.order);
        setBeingFulfilled(data.beingFulfilled);
      }
      else 
      {
        alert.error('FAILED TO GET LIST OF ORDERS')
      }
    }).catch(err => 
    {
      console.log(err);
      alert.error('FAILED TO CONNECT TO SERVER, PLEASE CHECK YOU CONNECTION!')
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    fetch(HOSTNAME + 'get-order-list-mgmt/')
    .then(res => res.json())
    .then(data=>{
      if(data.status === 'SUCCESS')
      {
        setListOfOrder(data.order);
        setBeingFulfilled(data.beingFulfilled);
      }
      else 
      {
        alert.error('FAILED TO GET LIST OF ORDERS')
      }
    }).catch(err => 
    {
      console.log(err);
      alert.error('FAILED TO CONNECT TO SERVER, PLEASE CHECK YOU CONNECTION!')
    }).finally(() => setLoading(false));
  },[alert]);


  switch(route)
  {
    case 'INITIATE': 
    return (
      <div className='App'>
        <div className='display' style={{maxWidth: '700px'}}>
          <h3>ATTENTION</h3>
          <p style={{color: '#696969'}}>Please use the Manual Delivery or Badge Scan Delivery Function to mark an order as 'DELIVERED' when handing out items to associates!</p>
          <p style={{color: '#696969'}}>This also adds a timestamp on the delivery for future reference!</p>
          <p style={{color: '#696969'}}>We are having problems with associates claiming they did not receive their orders!</p> 
          <p style={{fontWeight: 'bold'}}>Thank you for your support!</p>
        </div>

        <Login setRoute={setRoute} manager_user_name={manager_user_name} setManager={setManager}></Login>
        <Register setRoute={setRoute}></Register>

      </div>
    )

    default:
  return (
    <div className="App">
      <h1>Swag Store Order Management Application</h1>
      <button onClick={() => {
          window.open(HOSTNAME + 'all-swag-add-logs');
      }}>VIEW SWAG DISTRIBUTION LOGS</button>
      <div>
        {(loading)? <div className='loader'></div> :
        <div id='list-container'>
          <List getStore={getStore} title='Received orders' listOfOrders={listOfOrders.filter(item => item.status ==='RECEIVED')} setLoading={setLoading}></List>
          <List getStore={getStore} title='Back Ordered' listOfOrders={listOfOrders.filter(item => item.status === 'BACKORDERED')} setLoading={setLoading}></List>
          <List getStore={getStore} title='Fulfilled orders' listOfOrders={listOfOrders.filter(item => item.status ==='FULFILLED')} setLoading={setLoading}></List>
          <List getStore={getStore} title='Being Fulfilled orders' listOfOrders={beingFulfilled} setLoading={setLoading}></List>
        </div>}
      </div>

      <div style={{display:'flex', flexWrap: 'wrap'}}>
      <MassUpload manager_user_name={manager_user_name}/>

        <div style={{display:'flex', flexDirection: 'column'}}>
          <CheckAssociate></CheckAssociate>
          <ResetPassword/>
        </div>

      </div>

      <AddUser/>
      <ManagerApproval/>
      <div>
          <SwagList/>
      </div>
      <CommentSection/>

    </div>
  );
    }
}

export default App;
