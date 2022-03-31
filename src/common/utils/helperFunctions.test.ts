/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */

import {
  tryParseJSON,
  removeDuplicatesInArray,
  dynamicSort,
  convertMiliseconds,
  getDateString,
  getDatesBetweenTwoDates,
  // exportedForTesting: {
  //   padZero,
  // },
  openLink,
  getLang,
  exportedForTesting,
} from './helperFunctions';

const { padZero } = exportedForTesting;

beforeEach(() => {

});
afterEach(() => {
  jest.resetAllMocks();
});
afterAll(() => {
  jest.clearAllMocks();
});

test('Correctly formats invalid and valid JSON String', () => {
  expect(tryParseJSON('{ "test": "test" }'))
    .toStrictEqual({ test: 'test' });
  expect(tryParseJSON('test'))
    .toStrictEqual(false);
});

test('Correctly removes duplicates in array', () => {
  const arrayWithDuplicates = [
    { test: 'test', id: 1 },
    { test: '2', id: 1 },
  ];
  expect(removeDuplicatesInArray(arrayWithDuplicates, 'id'))
    .toStrictEqual([arrayWithDuplicates[0]]);

  expect(removeDuplicatesInArray(arrayWithDuplicates, 'test'))
    .toStrictEqual(arrayWithDuplicates);
});

test('Correctly sorts arrays based on key', () => {
  const dataToBeSorted = [
    { total_profit: 100, name: 'big profit' },
    { total_profit: 0, name: 'bigger profit' },
    { total_profit: 101, name: 'bigger profit' },
  ];
  expect(dataToBeSorted.sort(dynamicSort('total_profit'))[1])
    .toStrictEqual({ total_profit: 100, name: 'big profit' });
});

test('Correctly returns date object from milliseconds', () => {
  expect(convertMiliseconds(100000))
    .toStrictEqual({
      d: 0, h: 0, m: 1, s: 40,
    });

  expect(convertMiliseconds(10000000))
    .toStrictEqual({
      d: 0, h: 2, m: 46, s: 40,
    });
});

test('Correctly pads a zero when needed', () => {
  expect(padZero(15))
    .toBe('15');
  expect(padZero(1))
    .toBe('01');
});

test('Returned correct date string', () => {
  const date = new Date();
  expect(getDateString(date.toISOString()))
    .toBe('');

  const days = 86400000; // number of milliseconds in a day
  const fiveDaysAgo = new Date(date.getTime() - (5 * days));

  expect(getDateString(fiveDaysAgo.toISOString()))
    .toBe('05d');

  const hour = 3600000;
  const fiveHoursAgo = new Date(date.getTime() - (5 * hour));

  expect(getDateString(fiveHoursAgo.toISOString()))
    .toBe('05h');

  const fiveSeconds = 5000;
  const fiveMinutes = 300000;
  const fiveMinutesHoursSecondsAgo = new Date(
    date.getTime() - ((5 * hour) + fiveSeconds + fiveMinutes),
  );

  expect(getDateString(fiveMinutesHoursSecondsAgo.toISOString()))
    .toBe('05h 05m 05s');
});

test('Correctly pads a zero when needed', () => {
  expect(getDatesBetweenTwoDates('2022-01-01', '2022-01-03'))
    .toStrictEqual(
      {
        days: ['2022-01-01', '2022-01-02', '2022-01-03'],
        months: ['2022-01'],
        years: ['2022'],
      },
    );
});

test('Correctly opens link', () => {
  // window = jest.fn() as jest.Mocked<typeof window>;
  const windowSpy: jest.SpyInstance = jest.spyOn(window, 'window', 'get');
  expect(openLink('https://www.google.com'))
    .toBe(undefined);
  windowSpy.mockRestore();
  // window.open.mockClear();

  // window.mainPreload = true;
  // expect(openLink('https://www.google.com'))
  //   .toBe(undefined);
});

test('Correctly returns lanquage', () => {
  const languageGetter: jest.SpyInstance = jest.spyOn(window, 'navigator', 'get');
  languageGetter.mockImplementation(() => ({
    language: 'en-US',
  }));

  expect(getLang())
    .toBe('en-US');

  languageGetter.mockRestore();

  languageGetter.mockImplementation(() => ({
    languages: ['en-US', 'en-UK'],
  }));

  expect(getLang())
    .toBe('en-US');
});
