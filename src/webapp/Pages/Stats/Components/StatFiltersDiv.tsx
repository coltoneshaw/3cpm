import React from 'react';
import { ProfileType } from '@/types/config';
import { getLang } from '@/utils/helperFunctions';

const lang = getLang();

const dateString = (currentProfile: ProfileType) => {
  const date: undefined | number = currentProfile?.statSettings?.startDate;

  if (date !== undefined) {
    const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000);
    const utcDateString = new Date(adjustedTime).toUTCString();
    return new Date(utcDateString).toLocaleString(lang, { month: '2-digit', day: '2-digit', year: 'numeric' });
  }
  return '';
};

const returnAccountNames = (currentProfile: ProfileType) => {
  const { reservedFunds } = currentProfile.statSettings;
  return reservedFunds.length > 0
    ? currentProfile.statSettings.reservedFunds
      .filter((account) => account.is_enabled)
      .map((account) => account.account_name).join(', ')
    : 'n/a';
};

const returnCurrencyValues = (currentProfile: ProfileType) => {
  const currencyValues: string[] | undefined = currentProfile.general.defaultCurrency;
  return currencyValues !== undefined && currencyValues.length > 0
    ? currencyValues.join(', ')
    : 'n/a';
};

const StatFiltersDiv = ({ currentProfile }: { currentProfile: ProfileType }) => (
  <div className="flex-row filters">
    <p>
      <strong>Account: </strong>
      <br />
      {returnAccountNames(currentProfile)}
    </p>
    <p>
      <strong>Start Date: </strong>
      <br />
      {dateString(currentProfile)}
      {' '}
    </p>
    <p>
      <strong>Filtered Currency: </strong>
      <br />
      {returnCurrencyValues(currentProfile)}
    </p>
  </div>
);

export default StatFiltersDiv;
