import React from 'react';
import IndividualUserAddition from './IndividualUserAddition';
import MassUserAddition from './MassUserAddition';
const AddUser = (props) => {



    return (
        <div className='display'>
            <h2>Add new Users</h2>
            <h3>Individual User Addition</h3>
            <IndividualUserAddition/>
            <h3>Mass Users Addition</h3>
            <MassUserAddition/>
        </div>
    )
}

export default AddUser;