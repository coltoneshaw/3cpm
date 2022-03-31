import { ReservedFundsType, ProfileType } from 'types/config';

const getFiltersQueryString = (profileData: ProfileType) => {
  const { general: { defaultCurrency }, statSettings: { reservedFunds, startDate }, id } = profileData;

  const currencyString = (defaultCurrency) ? defaultCurrency.map((b: string) => `'${b}'`) : '';
  const startString = startDate;
  const accountIdString = reservedFunds
    .filter((account: ReservedFundsType) => account.is_enabled)
    .map((account: ReservedFundsType) => account.id);

  return {
    currencyString,
    accountIdString,
    startString,
    currentProfileID: id,
  };
};

export default getFiltersQueryString;
