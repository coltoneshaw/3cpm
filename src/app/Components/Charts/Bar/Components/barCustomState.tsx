
import React, { useState, useEffect, useLayoutEffect } from 'react';

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';
import { Type_Bot_Performance_Metrics, Type_Pair_Performance_Metrics } from '@/types/3Commas';
import { dynamicSort } from '@/utils/helperFunctions';
import { filterData } from '@/app/Components/Charts/formatting'


const defaultFilter = 'all';
const defaultSort = '-total_profit';


type name = 'PairPerformanceBar' | 'BotPerformanceBar'
type metrics = {
    total_profit: boolean
    bought_volume: boolean
    avg_deal_hours: boolean
    avg_profit?:boolean
}


const usePerformanceSortAndFilter = (name: name, metrics:metrics) => {
    const localStorageFilterName = storageItem.charts[name].filter
    const localStorageSortName = storageItem.charts[name].sort

    const [sort, setSort] = useState(defaultSort);
    const [filter, setFilter] = useState(defaultFilter);
    const [metricsDisplayed, updatedMetricsDisplayed] = useState(() => (metrics))


    useLayoutEffect(() => {
        // const getFilterFromStorage = getStorageItem(localStorageFilterName);
        // setFilter((getFilterFromStorage != undefined) ? getFilterFromStorage : defaultFilter);

        setFilter(defaultFilter);
        const getSortFromStorage = getStorageItem(localStorageSortName);
        setSort((getSortFromStorage != undefined) ? getSortFromStorage : defaultSort);
    }, [])


    const handleSortChange = (event: any) => {
        const selectedSort = (event.target.value != undefined) ? event.target.value : defaultSort;
        setSort(selectedSort);
        setStorageItem(localStorageSortName, selectedSort)
    };

    const handleFilterChange = (event: any) => {
        const selectedFilter = (event.target.value != undefined) ? event.target.value : defaultFilter;
        setFilter(selectedFilter);
        setStorageItem(localStorageFilterName, selectedFilter)
    };

    return {
        sort: {
            handleSortChange,
            sort,
        },
        filter: {
            handleFilterChange,
            filter
        },
        metrics: {
            metricsDisplayed,
            updatedMetricsDisplayed
        }
    }
}


type data = Type_Pair_Performance_Metrics[] | [] | Type_Bot_Performance_Metrics[]
const useLocalDataWithHeight = (data : data, filter:string , sort :string ) => {

    const [localData, updateLocalData] = useState<any[]>(() => data);
    const [chartHeight, updateChartHeight] = useState<number>(300)
    const [newData, updateNewData] = useState<any[]>([])
    useEffect(() => {
        if (data && data != []) updateLocalData(data)
    }, [data])   

    // useLayoutEffect here works only for the bot perf bar. Runs into rerender issues with pair performance
    useEffect(() => {
        if (data && data != []) updateNewData(() => {
            const newData = filterData(localData, filter).sort(dynamicSort(sort))
            updateChartHeight((newData.length * 15) + 250)
            return newData
        })
    }, [filter, sort, localData])

    return {
        newData, chartHeight
    }
}


export {
    usePerformanceSortAndFilter,
    useLocalDataWithHeight
}