import React from "react";
import { Type_Profile } from '@/types/config';
import { getLang } from '@/utils/helperFunctions';
const lang = getLang()

const dateString = (currentProfile: Type_Profile) => {
    const date: undefined | number = currentProfile?.statSettings?.startDate;

    if (date != undefined) {
        const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000)
        const dateString = new Date(adjustedTime).toUTCString()
        return new Date(dateString).toLocaleString(lang, { month: '2-digit', day: '2-digit', year: 'numeric' })
    }
    return ""
}

const returnAccountNames = (currentProfile: Type_Profile) => {

    const reservedFunds = currentProfile.statSettings.reservedFunds;
    return reservedFunds.length > 0 ?
        currentProfile.statSettings.reservedFunds.filter(account => account.is_enabled).map(account => account.account_name).join(', ')
        :
        "n/a";
}

const returnCurrencyValues = (currentProfile: Type_Profile) => {
    const currencyValues: string[] | undefined = currentProfile.general.defaultCurrency
    return currencyValues != undefined && currencyValues.length > 0 ?
        currencyValues.join(', ')
        :
        "n/a";
}


const StatFiltersDiv = ({ currentProfile }: { currentProfile: Type_Profile }) => {

    return (
        <div className="flex-row filters" >
            <p><strong>Account: </strong><br />{returnAccountNames(currentProfile)}</p>
            <p><strong>Start Date: </strong><br />{dateString(currentProfile)} </p>
            <p><strong>Filtered Currency: </strong><br />{returnCurrencyValues(currentProfile)}</p>
        </div>
    )
}

export default StatFiltersDiv;