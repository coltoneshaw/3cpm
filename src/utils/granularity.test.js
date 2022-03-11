/* eslint-disable no-console */
/* eslint-disable no-undef */

const { formatCurrency } = require('./granularity');

test('Formats included currency correctly', () => {
  expect(formatCurrency(['USD'], 1000, false))
    .toStrictEqual({
      metric: '1,000.00',
      symbol: '$',
      extendedSymbol: 'USD',
    });
});

test('Formats invalid currency correctly and throws console.error', () => {
  jest.spyOn(console, 'error').mockImplementation();

  expect(formatCurrency(['ABC'], 1000, false))
    .toStrictEqual({
      metric: 1000,
      symbol: '',
      extendedSymbol: '',
    });

  expect(console.error)
    .toHaveBeenCalledWith('No matching currency code found.', ['ABC']);
});
