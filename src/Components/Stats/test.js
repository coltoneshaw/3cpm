
const date = require('date-fns')

let time = date.parseISO( new Date("2021-07-21").toISOString()  ) 

if(time.getDate() % 10 === 0 ){
    console.log( date.format(time, "MMM d") )
}