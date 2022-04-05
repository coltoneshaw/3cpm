/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */

const {
  logToConsole,

} = require('./logging');

test('Correctly logs debug to console.', () => {
  jest.spyOn(console, 'debug').mockImplementation();
  logToConsole('debug', 'this is a debug test');
  expect(console.debug)
    .toHaveBeenCalledWith('this is a debug test');
});

test('Correctly logs error to console.', () => {
  jest.spyOn(console, 'error').mockImplementation();
  logToConsole('error', 'this is an error test');
  expect(console.error)
    .toHaveBeenCalledWith('this is an error test');
});

test('Correctly logs to console.', () => {
  jest.spyOn(console, 'log').mockImplementation();
  logToConsole('log', 'this is an log test');
  expect(console.log)
    .toHaveBeenCalledWith('this is an log test');
});

test('Correctly logs to console using default', () => {
  jest.spyOn(console, 'log').mockImplementation();
  logToConsole(undefined, 'this is an log test', 'test2', 'test3');
  expect(console.log)
    .toHaveBeenCalledWith('this is an log test', 'test2', 'test3');
});

test('Correctly logs table to console.', () => {
  jest.spyOn(console, 'table').mockImplementation();
  logToConsole('table', ['this is an log test', 'test2']);
  expect(console.table)
    .toHaveBeenCalledWith(['this is an log test', 'test2']);
});
