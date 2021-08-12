import { parseISO, format, differenceInMilliseconds } from 'date-fns'

function tryParseJSON_( jsonString:string , options:object ) {
    try {
      var o = JSON.parse(jsonString);
      console.log(typeof o)
      if (o && typeof o === "object") {
        return o;
      }
    }
    catch (e) { }
    console.log('error parsing the json file')
    return false;
};

const removeDuplicatesInArray = (data: any[], idAttribute:any) => {
  return Array.from(new Set( data.map(a => a[idAttribute] ))).map(id => data.find(a => a[idAttribute] === id))
}

function dynamicSort(property:string ) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a:any ,b:any) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

function convertMiliseconds(miliseconds: number, format?: string | undefined) {
  let days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

  total_seconds = Math.floor(miliseconds / 1000);
  total_minutes = Math.floor(total_seconds / 60);
  total_hours = Math.floor(total_minutes / 60);
  days = Math.floor(total_hours / 24);

  seconds = total_seconds % 60;
  minutes = total_minutes % 60;
  hours = total_hours % 24;

  return { d: days, h: hours, m: minutes, s: seconds };
};

/**
 * 
 * @param created_at ISO formatted string for the start of the deal
 * @returns object of d, h, m, s
 */
const getDateString = (created_at: string) => {
  const now = new Date()
  const timeObject = convertMiliseconds( differenceInMilliseconds(now, parseISO(created_at)) )

  const { d, h, m, s } = timeObject

  const day = (d > 0) ? d + 'd ' : ''
  const hour = (h > 0) ? h + 'h ' : ''
  const minute = (m > 0) ? m + 'm ' : ''
  const seconds = (s > 0) ? s + 's' : ''

  return day + hour + minute + seconds
}

export {
  removeDuplicatesInArray,
  tryParseJSON_,
  dynamicSort,
  getDateString
}