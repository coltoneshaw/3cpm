
/**
 * 
 * @param number Accepts a number or string, parses and returns
 * @param digits number of trailing digits to return.
 * @returns returns a number to 0 decimals and comma seperated
 */
const parseNumber = (number: number | string, digits:number = 0) => {
    switch (typeof number) {
        case "number": // do nothing
            break
        case "string":
            number = parseInt(number)
            break
        default:
            number = 0
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
    return parseNumber ( ( (num1 / num2) * 100 ) , 0 ) + "%"
}

export {
    parseNumber,
    formatPercent
}
