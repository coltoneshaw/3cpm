import React from "react";
import { Select, InputLabel, FormControl, MenuItem, Checkbox, ListItemText, Input, SelectChangeEvent } from '@mui/material';


type PairSelector = {
    pairs: { pair: string, opacity: number }[]
    pairFilters: string[]
    handleChange: any
}

const PairSelector = ({pairFilters, handleChange, pairs}:PairSelector) => {

    const grid = (pairs.length <= 5) ? '1fr' : '1fr 1fr 1fr 1fr 1fr'

    return (
        <div style={{ position: "absolute", left: 0, top: 0, height: "50px", zIndex: 5 }}>
                    <FormControl>
                        <InputLabel>Show</InputLabel>

                        <Select
                            variant="standard"
                            multiple
                            value={pairFilters}
                            onChange={handleChange}
                            input={<Input />}
                            // @ts-ignore
                            renderValue={() => (pairFilters.length > 0) ? pairFilters.join() : ""}
                            style={{ width: "150px" }}

                            MenuProps={{
                                MenuListProps: {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: grid,
                                    }
                                }
                            }}


                        >
                            {pairs.map(pair => (
                                <MenuItem value={pair.pair} key={pair.pair}>
                                    <Checkbox checked={pairFilters.indexOf(pair.pair) > - 1} />
                                    <ListItemText primary={pair.pair} />
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>

                </div>
    )
}

export default PairSelector