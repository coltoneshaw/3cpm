
/**
 * 
 * @param number Accepts a number or string, parses and returns
 * @param digits number of trailing divits to return.
 * @returns returns a number to 0 decimals and comma seperated
 */
const parseNumber = (number: number | string, digits:number = 0) => {
    if (typeof number === "string") {
        number = parseInt(number)
    }
    return number.toLocaleString(undefined, { 'minimumFractionDigits': digits, 'maximumFractionDigits': digits })
}

/**
 * 
 * @param num1 top number of fraction
 * @param num2 divisor - bottom number of the fraction
 * @returns a parsed string to fixed 0 with %
 */
const formatPercent = (num1:number , num2:number) => {
    return ((num1 / num2) * 100).toFixed(0) + "%"
}

export {
    parseNumber,
    formatPercent
}
