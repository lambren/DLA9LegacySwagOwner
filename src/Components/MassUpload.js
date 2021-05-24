import React, {useState} from 'react';
import { useAlert} from 'react-alert'
import {HOSTNAME} from './../Constants'
import AddSwagBadge from './AddSwagBadge'

const MassUpload = (props) => {
    const [hideResults, setHideResults] = useState(true);
    const [path, setPath] = useState('');
    const [successList, setSuccessList] = useState([]);
    const [failedList, setFailedList] = useState([]);

    const alert = useAlert();

    const submitAddition = async (user_data, swag_amt, reason) => {

        const now = new Date();
        const today = now.toLocaleDateString();

        const associateData = {
            user_data, 
            swag_amt, 
            reason, 
            manager_user_name: props.manager_user_name,
            date: today
        }
        const res = await fetch(HOSTNAME + 'add-balance/', {
            method: 'POST', 
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(associateData),
        })

        const data = await res.json();
        
        if (data.status === 'SUCCESS')
            setSuccessList(successList => [...successList, associateData]);
        else 
            setFailedList(failedList => [...failedList, associateData]);
    }

    const parseFileAndSubmit = (uploadedFile) => {
        let currentIndex = 23;

        const getNextToken = () => {
            var token = '';
    
            if (uploadedFile[currentIndex] === `"`)
            {
                ++currentIndex;
                while (uploadedFile[currentIndex] !== `"`
                    && currentIndex < uploadedFile.length)
                {
                    token += uploadedFile[currentIndex];
                    ++currentIndex;
                }
                currentIndex += 2;
                return token;
            }
            else {
                while (currentIndex < uploadedFile.length 
                    && uploadedFile[currentIndex] !== ','
                    && uploadedFile[currentIndex] !== '\n')
                {
                    if (uploadedFile[currentIndex] !== '\r')
                        token += uploadedFile[currentIndex];
                    ++currentIndex;
                }
                ++currentIndex;
                return token;
            }
        }

        var user_data = '',  
            swag_amt = '',
            reason = '';

        while (currentIndex < uploadedFile.length)
        {
            user_data = getNextToken();
            swag_amt = getNextToken();
            reason = getNextToken();

            submitAddition(user_data, swag_amt, reason);
        }
    }

    const columnsAreValid = (uploadedFile) => 
    {
        if (uploadedFile.length < 23) return false;
        if (uploadedFile.slice(0,23) !== 'associate,swag,reason\r\n') return false;

        return true;
    }

    const handleSubmit = () => {
        setHideResults(false);

        setSuccessList([]);
        setFailedList([]);

        const fr = new FileReader();

        fr.readAsText(path)

        fr.onloadend = () => {
            if (!columnsAreValid(fr.result)) alert.error('INVALID DATA FORMAT');
            else parseFileAndSubmit(fr.result);
        }
    }
    



    return(
        <div className='display'>
            <AddSwagBadge manager_user_name={props.manager_user_name} />
            <h2 style={{paddingTop: '30px'}}>Mass Swag Distribution</h2>
            <label>Select .csv file to upload</label>
            <input 
                onChange={(event) => setPath(event.target.files[0])} 
                type='file' accept='.csv'></input>
            <button onClick={handleSubmit}>Submit</button>

            <div style={{display: (hideResults)? "none": "block"}}>
                <h3>SUCCESS</h3>
                <div style={{ backgroundColor: 'white', maxHeight: '100px', overflowY: 'scroll'}}>
                    {successList.map(item=><p style={{margin: '10px', borderBottom: 'solid black 1px'}}>
                        {item.user_data},{item.swag_amt},"{item.reason}"</p>)}
                </div>
                
                <h3>FAILED</h3>
                <div style={{backgroundColor: 'white', maxHeight: '100px', overflowY: 'scroll'}}>
                    {failedList.map(item =><p style={{margin: '10px', borderBottom: 'solid black 1px'}}>
                        {item.user_data},{item.swag_amt},"{item.reason}"</p>)}
                </div>
            </div>

        </div>
    )
}

export default MassUpload;