import React, {useState} from 'react';
import {useAlert} from 'react-alert'
import {HOSTNAME} from './../Constants'

const MassUserAddition = (props) => {

    const [successList, setSuccessList] = useState([]);
    const [failList, setFailList] = useState([]);
    const [hideResults, setHideResults] = useState(true);

    const[path, setPath] = useState('');

    const alert = useAlert();

    const submitAdd = (
        user_id, 
        user_name, 
        user_first_name, 
        user_manager) => 
    {
        const associateData = {
            user_id,
            user_name, 
            user_first_name,
            user_manager,
        }
        console.log(associateData)

        fetch(HOSTNAME + 'add-user/', 
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(associateData),
        }).then(res => res.json())
        .then(data => {
            if (data.status === 'SUCCESS') 
                setSuccessList(successList => [...successList, {...associateData}]);
            else if (data.reason === 'UNIQUE')
                setFailList(failList => [...failList, {...associateData, reason: 'DUPLICATE'}]);
            else if (data.reason === 'DATA')
                setFailList(failList => [...failList, {...associateData, reason: 'DATA FORMAT'}]);
            else 
                setFailList(failList => [...failList, {...associateData, reason: 'CONTACT IT'}]);
        }).catch(e => {
            setFailList(failList => [...failList, {...associateData, reason: 'CONNECTION'}]);
        })
    }

    const parseFileAndSubmit = (uploadedFile) => {
        let currentIndex = 26;

        const getNextToken = () => {
            var token = '';
    
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

        var user_id = '', user_name = '', 
            user_manager = '' , user_first_name = '';

        while (currentIndex < uploadedFile.length)
        {
            user_id = getNextToken();
            user_name = getNextToken();
            user_first_name = getNextToken();
            user_manager = getNextToken();

            submitAdd(user_id, user_name, user_first_name, user_manager);
        }
    }

    const columnsAreValid = uploadedFile => {

        if (uploadedFile.length < 26) return false;
        if (uploadedFile.slice(0,26) !== 'badge,login,name,manager\r\n') return false;

        return true;
    }

    const onSubmit = () => {
        setHideResults(false);

        setSuccessList([]);
        setFailList([]);

        const fr = new FileReader();
        
        fr.readAsText(path);

        fr.onloadend = () => {
            if(!columnsAreValid(fr.result)) alert.error('Invalid File Format! Please check the guide!');
            else parseFileAndSubmit(fr.result);
        }

    }


    return (
        <div>
            <label>Select .csv file to upload</label>
            <input type='file' accept='.csv'
                onChange={e => setPath(e.target.files[0])}></input>
            <button onClick={onSubmit}>Submit</button>
            <div style={{display: (hideResults)? 'none' : 'block'}}>
                <h3>Success</h3>
                <div style={{ backgroundColor: 'white', maxHeight: '100px', overflowY: 'scroll'}}>
                    {successList.map((item) => <p>{item.user_id}</p>)}
                </div>
                <h3>Failed</h3>
                <div style={{ backgroundColor: 'white', maxHeight: '100px', overflowY: 'scroll'}}>
                    {failList.map((item) => <p>ID: {item.user_id}, REASON:  {item.reason}</p>)}
                </div>
            </div>
        </div>
    )
}

export default MassUserAddition;