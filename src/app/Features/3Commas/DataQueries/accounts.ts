import { Type_Query_Accounts } from '@/types/3Commas'
import { getFiltersQueryString } from '@/app/Features/3Commas/queryString';
import { Type_Profile } from '@/types/config'

/**
 *
 * @param {string} defaultCurrency This is the default currency configured in settings and used as a filter
 * @returns
 */
const getAccountDataFunction = async (profileData: Type_Profile) => {
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
    `
    let accountData: Type_Query_Accounts[] | [] = await window.ThreeCPM.Repository.Database.query(currentProfileID, query)

    // removed this since it seems redundant to the above query
    // .then((data: Type_Query_Accounts[]) => data.filter(row => defaultCurrency.includes(row.currency_code)))

    if (accountData == null || accountData.length > 0) {
        let on_ordersTotal = 0;
        let positionTotal = 0;

        for (const account of accountData) {
            const { on_orders, position } = account
            on_ordersTotal += on_orders;
            positionTotal += position;

        }
        return {
            accountData,
            balance: {
                on_orders: on_ordersTotal,
                position: positionTotal,
            }
        }
    }

    return {
        accountData: [],
        balance: {
            on_orders: 0,
            position: 0,
        }
    }
}

export {
    getAccountDataFunction
}
