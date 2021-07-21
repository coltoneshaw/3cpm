const path = require("path");
const dotProp = require('dot-prop');
const fs = require('fs');

class LocalDatabase {
    constructor(fileName) {
        // this is the deb path, needs to be modified when running in production.
        this._path = path.join(__dirname, '../../database', fileName);
        this.fileName = 'deals.json';

    }

    // pushing an entire new config
    set all(value) {

        console.log(value.length)
        try {
            fs.writeFile(this._path, JSON.stringify( value ), function (err) {
                if (err) {
                    console.log(`There has been an error saving to the ${this.fileName} database`);
                    console.log(err.message);
                    return;
                }
                // console.log(`Saved to ${this.fileName} successfully`);
            });
        } catch (error) {

            throw error;
        }
    }

    get all() {
        try {
            //console.log(`Fetching all from ${this.fileName}`);
            return JSON.parse( fs.readFileSync(this._path, { encoding: 'utf8' }))
        } catch (error) {
            console.log(`error fetching the config file or parsing the ${this.fileName} database`);

            throw error;
        }
    }

    get(key) {
        return dotProp.get(this.all, key)
    }

    has(key) {
        return dotProp.has(this.all, key);
    }

    isDefined(key) {
        if (dotProp.has(this.all, key)) {
            return (this.get(key) != '')
        } else {
            return false;
        }

    }

    set(newData) {
        const dataStore = this.all;
        console.log(dataStore.length)

        /* 
            this needs to take an array of objects, see if the id attribute exists in the table, replace it with the new data, append the old to the bottom.
        */

        if (dataStore.length == 0) {
            console.log('nothing is here')
            this.all =  newData

        } else {
            const newdataStore = dataStore.filter(row => {
                return !newData.find(e => e.id === row.id)
            })
            console.log(newdataStore)

            this.all = [
                ...newdataStore,
                ...newData
            ]
        }


    }



    reset() {
        this.all = this._defaultConfig
    }
}
let dealStore;

if (db_type === 'remote') {
    console.log('start remote connection')
} else {
    dealStore = new LocalDatabase('deals.json')
    // console.log(dealStore.set([{test:'test'}]))
}


exports.set = (values) => dealStore.set(values);