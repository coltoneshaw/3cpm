

const parseNumber = (number) => {
    if (number) {
        return number.toLocaleString(undefined, { 'minimumFractionDigits': 0, 'maximumFractionDigits': 0 })
    }
    return number
}

export {
    parseNumber
}
