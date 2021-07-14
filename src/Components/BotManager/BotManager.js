import React, { Component } from 'react';

import DataTable from './DataTable';
import './BotManager.scss';

import Risk from "./Risk";

import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import SaveIcon from '@material-ui/icons/Save';




class BotManager extends Component {


    state = {
        error: null,
        isLoaded: false,
        rows: []
    }

    handleOnOff = (e) => {
        console.log(e)
        let newRows = this.state.rows.map(row => {
            if (e.target.name == row.id) {
                row.enabled = !row.enabled

            }
            return row
        })

        this.setState({ rows: newRows })


    }

    handleEditCellChangeCommitted = (e) => {

        let newRows = this.state.rows.map(row => {
            if (e.id == row.id) {
                row[e.field] = e.props.value
                console.log(`changed ${e.field} to ${e.props.value}`)

            }
            return row
        })
        this.setState({ rows: newRows })


    }

    getData = async () => {
        console.log('test')
        
    }


    async fetchData() {
   
        await electron.data.fetch()
        .then(data => {
            console.log('ran a new call')
            return data.map(row => {
                return { id: row.id, name: row.name, pairs: row.pairs, tp: row.take_profit, bo: row.base_order_volume, so: row.safety_order_volume, maxSO: row.max_safety_orders, sos: row.safety_order_step_percentage, ss: row.martingale_step_coefficient, os: row.martingale_volume_coefficient, enabled: row.is_enabled }
            })

        })
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    rows: result
                });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )

    }

    async componentDidMount(){
        this.fetchData()
    }





    render() {

        return (
            <div className="mainWindow" >
                <h1>Bot Manager</h1>
                <div className="flex-row padding">
                    <Button
                        variant="outlined"
                        endIcon={<SyncIcon />}
                        onClick={() => {
                            this.fetchData();
                        }}
                    >
                        {/* Need to make this pull the data, but the data control needs to be a bit higher up. */}
                        Pull New Data
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        endIcon={<SaveIcon />}
                        onClick={() => { alert('set me to POST the data') }}
                    >
                        Save and Sync
                    </Button>


                </div>

                <Risk />
                <DataTable
                    classes={this.props.classes}
                    data={this.state.rows}
                    handleOnOff={this.handleOnOff}
                    handleEditCellChangeCommitted={this.handleEditCellChangeCommitted} />


            </div>
        )

    }



}

export default BotManager;