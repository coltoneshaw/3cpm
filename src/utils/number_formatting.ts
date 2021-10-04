
/**
 * 
 * @param number Accepts a number or string, parses and returns
 * @param digits number of trailing digits to return.
 * @returns returns a number to 0 decimals and comma seperated
 */
const parseNumber = (number: number | string, digits:number = 0, activeDeals?: boolean) => {
    switch (typeof number) {
        case "number": // do nothing
            break
        case "string":
            number = parseInt(number)
            break
        default:
            number = 0
    }

    let numberFormatter:any = {'minimumFractionDigits': (digits > 4) ? 4 : digits,  'maximumFractionDigits': digits}

    if(activeDeals){
        if(number >= 10) numberFormatter = { 'minimumFractionDigits': digits, 'maximumFractionDigits': digits, "useGrouping": false}
        if(number < 10) numberFormatter = { 'minimumFractionDigits': (digits > 4) ? digits : 4, 'maximumFractionDigits' : 8}
    }
    // console.log(digits)
    // if(maxSize && number >= 1) numberFormatter = { 'minimumSignificantDigits': digits , 'maximumSignificantDigits': digits, "useGrouping": false}
    // if(number < 1) numberFormatter = { 'minimumFractionDigits': (digits > 6) ? digits : 6  , 'maximumFractionDigits': (digits > 6) ? digits : 6 , "useGrouping": false}
    // if(maxSize && number < 1) numberFormatter = { 'minimumSignificantDigits': maxSize , 'maximumSignificantDigits': maxSize}

    return number.toLocaleString(undefined, numberFormatter)
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
