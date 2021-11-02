import { parseISO, differenceInMilliseconds } from 'date-fns'


const isElectron = () => window.mainPreload
/**
 * 
 * @param jsonString the json string to be validated
 * @param options 
 * @returns a parsed json string or false.
 */
function tryParseJSON_(jsonString: string, options?: object) {
  try {
    const o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return o;
    }
  }
  catch (e) { }
  // console.error('error parsing the json file')
  return false;
};


/**
 * 
 * @param data The total data array
 * @param idAttribute the ID attribute used to remove duplicate matches
 * @returns cleaned array with only one item per ID attribute
 */
const removeDuplicatesInArray = (data: any[], idAttribute: any) => {
  return Array.from(new Set(data.map(a => a[idAttribute]))).map(id => data.find(a => a[idAttribute] === id))
}


/**
 * 
 * @param property property to sort the array based on
 * @returns function to be used in `.sort()`
 */
function dynamicSort(property: string) {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    /* next line works with strings and numbers, 
     * and you may want to customize it to your needs
     */
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

/**
 * 
 * @param miliseconds total number of miliseconds to convert into an object
 * @returns object to filter the date string on.
 */
function convertMiliseconds(miliseconds: number) {
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

const padZero = (number: number) => {
  if (number >= 10) return number;

  return '0' + number
}

/**
 * 
 * @param created_at ISO formatted string for the start of the deal
 * @returns object of d, h, m, s
 */
const getDateString = (created_at: string) => {
  const now = new Date()
  const timeObject = convertMiliseconds(differenceInMilliseconds(now, parseISO(created_at)))

  const { d, h, m, s } = timeObject

  const day = (d > 0) ? padZero(d) + 'd ' : ''
  const hour = (h > 0) ? padZero(h) + 'h ' : ''
  const minute = (m > 0) ? padZero(m) + 'm ' : ''
  const seconds = (s > 0) ? padZero(s) + 's' : ''

  if (d > 0) return day + (padZero(h) + 'h ') + minute

  return day + hour + minute + seconds
}

function getLang() {
  if (navigator.languages != undefined)
    return navigator.languages[0];
  return navigator.language;
}

/**
 * 
 * @param startDate string date formatted like `YYYY-mm-dd`
 * @param endDate string date formatted like `YYYY-mm-dd`
 * @returns array of months, years, and dates between the start / finish day.
 * 
 * https://stackoverflow.com/a/64057471/13836826
 */
function getDatesBetweenTwoDates(startDate: string, endDate: string) {
  const days = [],
    months = new Set(),
    years = new Set()

  const dateMove = new Date(startDate)
  let date = startDate

  while (date < endDate) {
    date = dateMove.toISOString().slice(0, 10)
    months.add(date.slice(0, 7))
    years.add(date.slice(0, 4))
    days.push(date)
    dateMove.setDate(dateMove.getDate() + 1) // increment day
  }
  return { years: [...Array.from(years)], months: [...Array.from(months)], days } // return arrays
}

const openLink = (url: string) => {
  if (isElectron()) return window.ThreeCPM.Repository.General.openLink(url);
  return window.open(url)
}


export {
  removeDuplicatesInArray,
  tryParseJSON_,
  dynamicSort,
  getDateString,
  getLang,
  convertMiliseconds,
  getDatesBetweenTwoDates,
  openLink
}