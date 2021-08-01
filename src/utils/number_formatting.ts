
/**
 * 
 * @param number Accepts a number or string, parses and returns
 * @returns returns a number to 0 decimals and comma seperated
 */
const parseNumber = (number: number | string) => {

    if (typeof number === "string") {
        number = parseInt(number)
    }

    return number.toLocaleString(undefined, { 'minimumFractionDigits': 0, 'maximumFractionDigits': 0 })

}

export {
    parseNumber
}
