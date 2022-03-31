/* eslint-disable no-undef */

const { parseNumber, formatPercent } = require('./numberFormatting');

test('Correctly parses number', () => {
  expect(parseNumber('10', 2, false))
    .toBe('10.00');
  expect(parseNumber(10, 3, false))
    .toBe('10.000');
  expect(parseNumber('1', 2, true))
    .toBe('1.0000');
  expect(parseNumber('10', 2, true))
    .toBe('10.00');
  expect(parseNumber('.00001', 5, true))
    .toBe('0.00001');
  expect(parseNumber(1000, 2, true))
    .toBe('1000');
});

test('Correctly formats a percent', () => {
  expect(formatPercent(10, 100))
    .toBe('10%');
});
