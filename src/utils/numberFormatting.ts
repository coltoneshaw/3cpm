/**
 *
 * @param number Accepts a number or string, parses and returns
 * @param digits number of trailing digits to return.
 * @returns returns a number to 0 decimals and comma seperated
 */
const parseNumber = (
  number: number | string,
  digits: number = 0,
  activeDeals?: boolean,
) => {
  const isNumber = Number(number);

  let numberFormatter: any = {
    minimumFractionDigits: (digits > 4) ? 4 : digits,
    maximumFractionDigits: digits,
  };

  // Fix the logic here to format the number
  if (activeDeals) {
    switch (true) {
      case (isNumber < 10):
        numberFormatter = {
          minimumFractionDigits: (digits > 4) ? digits : 4,
          maximumFractionDigits: 8,
          useGrouping: false,
        };
        break;
      case (isNumber < 1000):
        numberFormatter = {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
          useGrouping: false,
        };
        break;
      case (isNumber >= 1000):
        numberFormatter = {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          useGrouping: false,
        };
        break;

      default:
        break;
    }
  }
  // console.log(digits)
  // if(maxSize && number >= 1) numberFormatter = { 'minimumSignificantDigits': digits , 'maximumSignificantDigits': digits, "useGrouping": false}
  // if(number < 1) numberFormatter = { 'minimumFractionDigits': (digits > 6) ? digits : 6  , 'maximumFractionDigits': (digits > 6) ? digits : 6 , "useGrouping": false}
  // if(maxSize && number < 1) numberFormatter = { 'minimumSignificantDigits': maxSize , 'maximumSignificantDigits': maxSize}

  return isNumber.toLocaleString(undefined, numberFormatter);
};

/**
 *
 * @param numerator top number of fraction
 * @param denominator bottom number of the fraction
 * @returns a parsed string to fixed 0 with %
 */
// eslint-disable-next-line max-len
const formatPercent = (numerator: number, denominator: number) => `${parseNumber((numerator / denominator) * 100, 0)}%`;

export {
  parseNumber,
  formatPercent,
};
