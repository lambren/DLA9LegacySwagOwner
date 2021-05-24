import React, {useState, useEffect} from 'react'
import {HOSTNAME} from './../Constants'
import {useAlert} from 'react-alert'
import EachComment from './EachComment';

const CommentSection = (props) => {
    const alert = useAlert();
    const [comments, setComments] = useState([]);

    const getComments = () => {
        fetch(HOSTNAME + 'get-all-comments/')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'SUCCESS')
                setComments(data.data);
            else alert.error('FAILED TO GET COMMENTS')
        }).catch(e => {
            console.log(e);
            alert.error('FAILED TO GET COMMENTS');
        })
    }

    useEffect(getComments, [])

    return (
        <div className='display' id='list'>
            <div style={{display: 'flex', flexDirection: 'row', 
                justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Comments Section</h3>
                <button onClick={getComments}>Refresh</button>
            </div>
            <div id='inner-list'>
                {comments.map(item => 
                    <EachComment key={item.comment_id}
                        item={item} getComments={getComments}/>)}
            </div>
        </div>
        
    )
}

export default CommentSection;