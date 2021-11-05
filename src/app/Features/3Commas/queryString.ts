
import { Type_ReservedFunds, Type_Profile } from '@/types/config'


export const getFiltersQueryString = async (profileData: Type_Profile) => {
    const { general: { defaultCurrency }, statSettings: { reservedFunds, startDate }, id } = profileData

    const currencyString = (defaultCurrency) ? defaultCurrency.map((b: string) => "'" + b + "'") : ""
    const startString = startDate
    const accountIdString = reservedFunds.filter((account: Type_ReservedFunds) => account.is_enabled).map((account: Type_ReservedFunds) => account.id)

    return {
        currencyString,
        accountIdString,
        startString,
        currentProfileID: id
    }

}
