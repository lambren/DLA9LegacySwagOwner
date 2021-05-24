import React from 'react';

const SwagItem = (props) => {
    return(
    <div className='swag-item'>
        <p>{props.item.swag_item_id}</p>
        <p>{props.item.swag_name}</p>
        <p>{props.item.price}</p>
        <p>{props.item.stock}</p>

        <div>
        {
            (props.item.display)? <p>Yes</p> : <p>No</p>
        }
        </div>
    </div>)
}

export default SwagItem;