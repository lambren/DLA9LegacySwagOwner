import React, {useState} from 'react';
import {useAlert} from 'react-alert';
import { HOSTNAME } from '../Constants';

const EachComment = (props) => {
    const item = props.item;

    const alert = useAlert();

    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        console.log(item.user_id);
        e.preventDefault();
        setLoading(true);
        fetch(HOSTNAME + 'response-to-comment', {
            method: 'POST', 
            headers : {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                user_id: item.user_id, 
                response, 
            })
        }).then(res => res.json())
        .then(data => {
            if (data.status ==='SUCCESS')
                alert.success('SUCCESSFULLY POSTED RESPONSE');
            else alert.error('FAILED TO POST RESPONSE');
        }).catch(e => {
            console.log(e);
            alert.error('FAILED TO POST RESPONSE');
        }).finally(() => {
            setResponse('');
            setLoading(false);
            props.getComments();
        })
    }

return (                    
    <div className='each-comment'>
        <p
            style={{maxWidth: '80vw'}}>
            {item.user_name} 
            ({item.user_first_name}): {item.content}
        </p>

        <form onSubmit={onSubmit}>
            <div className='center'>
                    <textarea style={{width: '80%'}} 
                        placeholder={((item.response)?
                            item.response :
                            'Enter Response Here')}
                        onChange={e => setResponse(e.target.value)}
                        value={response}/>
                    <button onClick={onSubmit}>{
                        (loading) ? 'POSTING RESPONSE, PLEASE WAIT...' : 
                        'Post'}
                    </button>
                    <p style = {{color: (item.response)? 
            '#3dd980' : '#db8239',
            fontWeight:'bold'}}>
            {(item.response)? 'RESPONDED' : 'NOT YET RESPONDED' }
        </p>
            </div>
        </form>

    </div>)
}

export default EachComment;