import React from 'react';

import DataTable from './DataTable';
import './BotManager.scss';

import Risk from "./Risk";

import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import SaveIcon from '@material-ui/icons/Save';

import { useGlobalData } from '../../../Context/DataContext';



const BotManagerPage = (props) => {

    const state = useGlobalData();
    const { actions: { fetchBotData} } = state;


    /**
     * TODO
     * - make this function store in the database and read from the database.
     * - Need to make the metrics here dynamic
     * - Add max deal funds here.
     */




    return (
        <>
            <h1>Bot Manager</h1>
            <div className="flex-row padding">
                <Button
                    variant="outlined"
                    endIcon={<SyncIcon />}
                    onClick={fetchBotData}
                >
                    Pull New Data
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<SaveIcon />}
                    onClick={() => { console.log(value) }}
                >
                    Save and Sync
                </Button>


            </div>

            <Risk />
            <DataTable
                classes={props.classes}/>
        </>
    )
}



export default BotManagerPage;