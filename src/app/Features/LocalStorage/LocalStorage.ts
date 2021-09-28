import { tryParseJSON_ } from "@/utils/helperFunctions"


const storageItem = {
    navigation: {
        homePage: 'homePage', // the home page the application navigates to
        statsPage: 'nav-statsPage'
    },
    settings: {
        displayMode: 'displayMode', // the dark mode switcher. Values are 'lightMode' and 'darkMode',
        coinPriceArray: 'coinPriceArray'
    },
    charts:{
        pairByDateFilter: 'pairByDateFilter',
        BotPerformanceBubble:{
            filter: 'filter-botPerformanceBubble'// filter for the bot bubble - values are 'all' , top20, top50, bottom50, bottom20
        },
        DealPerformanceBubble:{
            sort: 'sort-dealPerformanceBubble', // percentTotalProfit , number_of_deals , percentTotalVolume
            filter: 'filter-dealPerformanceBubble'// filter for the bot bubble - values are 'all' , top20, top50, bottom50, bottom20
        },
        PairPerformanceBar: {
            sort: 'sort-pairPerformanceBar', // -total_profit, -bought_volume, -avg_deal_hours
            filter: 'filter-pairPerformanceBar', // all, top20, top50, bottom50, bottom20
        },
        BotPerformanceBar: {
            sort: 'sort-BotPerformanceBar', // -total_profit, -bought_volume, -avg_deal_hours
            filter: 'filter-BotPerformanceBar', // all, top20, top50, bottom50, bottom20
        },
        ProfitByDay: {
            sort: 'sort-ProfitByDay' //day , month, year
        }
    },
    tables: {
        DealsTable: {
            sort: 'sort-DealsTable' // [ {id: 'value', desc: boolean}]
        },
        BotPlanner: {
            sort: 'sort-BotPlanner'// [ {id: 'value', desc: boolean}]
        }
    }
}

const setStorageItem = (id:string, value:string | [] | object) => {

    if(typeof value === 'object'){
        value = JSON.stringify(value)
    }

    localStorage.setItem(id, value)

}

const getStorageItem = (id:string) => {

    const storageItem = localStorage.getItem(id)

    const parsed = (storageItem != undefined) ? tryParseJSON_(storageItem) : undefined

    if(parsed){
        return parsed
    }

    return storageItem
}



export {
    storageItem,
    setStorageItem,
    getStorageItem
}