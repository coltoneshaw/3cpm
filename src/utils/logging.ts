/* eslint-disable no-console */

type ConsoleTypes = 'debug' | 'log' | 'table' | 'error';

const logToConsole = (type: ConsoleTypes, ...args: any[]) => {
  switch (type) {
    case ('debug'):
      console.debug(...args);
      break;
    case ('log'):
      console.log(...args);
      break;
    case ('table'):
      console.table(...args);
      break;
    case ('error'):
      console.error(...args);
      break;
    default:
      console.log(...args);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { logToConsole };
