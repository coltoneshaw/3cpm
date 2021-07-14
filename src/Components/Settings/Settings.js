import React, { useEffect } from 'react';



import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@material-ui/core';


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




const Settings = () => {


    //This will need to 
    const [currency, setCurrency] = React.useState(currencyArray[0].name);

    const handleChange = (event) => {
        setCurrency(event.target.value);
    };



    return (
        <div className="mainWindow" >
            <h1>Settings</h1>
            <div className="settings-div boxData flex-column">
                <div className=" flex-column">
                    {/* Can most likely turn this DIV into another component.*/}
                    <h2>API Settings</h2>
                    <TextField id="standard-basic" label="Key" />
                    <TextField id="standard-basic" label="Secret" />
                </div>
                <div className=" flex-column">
                    <h2>General Settings</h2>

                    <FormControl >
                        <InputLabel>Currency</InputLabel>
                        <Select
                            value={currency}
                            onChange={handleChange}
                        >
                            {currencyArray.map(currency => <MenuItem value={currency.value} key={currency.key}>{currency.name}</MenuItem>)}

                        </Select>
                    </FormControl>


                </div>


            </div>
        </div>

    )
}

export default Settings;