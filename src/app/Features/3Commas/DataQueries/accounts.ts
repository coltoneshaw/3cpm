import { QueryAccountsType } from '@/types/3CommasApi';
import getFiltersQueryString from '@/app/Features/3Commas/queryString';
import { ProfileType } from '@/types/config';

/**
 *
 * @param {string} defaultCurrency This is the default currency configured in settings and used as a filter
 * @returns
 */
const getAccountDataFunction = async (profileData: ProfileType) => {
  const filtersQueryString = await getFiltersQueryString(profileData);
  const { currencyString, accountIdString, currentProfileID } = filtersQueryString;

  const query = `
                SELECT
                    *
                FROM
                    accountData
                WHERE
                    account_id IN ( ${accountIdString} )
                    and currency_code IN ( ${currencyString} )
    `;
  const accountData: QueryAccountsType[] | [] = await window.ThreeCPM.Repository.Database
    .query(currentProfileID, query);

  // removed this since it seems redundant to the above query
  // .then((data: Type_Query_Accounts[]) => data.filter(row => defaultCurrency.includes(row.currency_code)))

  if (accountData == null || accountData.length > 0) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let on_ordersTotal = 0;
    let positionTotal = 0;

    accountData.forEach(({ on_orders, position }) => {
      on_ordersTotal += on_orders;
      positionTotal += position;
    });
    return {
      accountData,
      balance: {
        on_orders: on_ordersTotal,
        position: positionTotal,
      },
    };
  }

  return {
    accountData: [],
    balance: {
      on_orders: 0,
      position: 0,
    },
  };
};

export default getAccountDataFunction;
