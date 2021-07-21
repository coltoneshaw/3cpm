import React, { Component } from 'react';
import { Consumer } from '../../Context';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@material-ui/core';

import Button from '@material-ui/core/Button';

import './Settings.scss';



const currencyArray = [
    {
        name: "USD",
        value: "USD",
        key: 1
    },
    {
        name: "BTC",
        value: "BTC",
        key: 2
    },
    {
        name: "ETH",
        value: "ETH",
        key: 3

    }
]

class Settings extends Component {

    apiKey = React.createRef();
    apiSecret = React.createRef();

    state = {
        currency: '',
        key: '',
        secret: '',
        config: ''
    }


    handleChange = (event) => {
        let currency = event.target.value
        this.setState({ currency })

    };

    modifyConfig = async (type, key, value) => {
        let config = electron.config
        let configData;

        if (type === 'read') {
            configData = await config.get();
            return configData
        } else if (type === 'reset') {
            configData = await config.reset();
        } else if (type === 'write') {
            configData = await config.set(key, value);
        }
    }

    saveConfig = async () => {
        console.log('Saving config')

        let changes = [{
            key: 'general.defaultCurrency',
            value: this.state.currency
        },
        {
            key: 'apis.threeC',
            value: { key: this.apiKey.current.value, secret: this.apiSecret.current.value }
        }
        ]

        await electron.config.bulk(changes)
    }

    setCurrency = (config) => {

        let currency = (config.general.defaultCurrency == "") ? currencyArray[0].name : config.general.defaultCurrency
        this.setState({ currency })
    }

    setApiKeys = (config) => {
        this.apiKey.current.value = (config) ? config.apis.threeC.key : "",
        this.apiSecret.current.value = (config) ? config.apis.threeC.secret : ""
    }

    async componentDidMount() {
        await this.modifyConfig('read')
            .then((config) => {
                this.setCurrency(config)
                this.setApiKeys(config)
                this.setState({ config })

            })
    }




    render() {


        return (
                <div className="mainWindow" >
                    <h1>Settings</h1>
                    <div className="settings-div boxData flex-column">
                        <div className=" flex-column">
                            <h2>API Settings</h2>
                            <TextField
                                id="key"
                                label="Key"
                                inputRef={this.apiKey}
                            />
                            <TextField
                                id="secret"
                                label="Secret"
                                inputRef={this.apiSecret}
                            />
                        </div>
                        <div className=" flex-column">
                            <h2>General Settings</h2>

                            <FormControl >
                                <InputLabel>Currency</InputLabel>
                                <Select
                                    value={this.state.currency}
                                    onChange={this.handleChange}
                                >
                                    {currencyArray.map(currency => <MenuItem value={currency.value} key={currency.key}>{currency.name}</MenuItem>)}

                                </Select>
                            </FormControl>


                        </div>

                        <div className="flex-row padding">
                            <Button
                                variant="contained"
                                onClick={() => {
                                    this.modifyConfig('reset');
                                }}
                                disableElevation
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    this.saveConfig();
                                }}
                                disableElevation
                            >
                                Save
                            </Button>


                        </div>


                    </div>
                </div>


        )

    }

}

export default Settings;