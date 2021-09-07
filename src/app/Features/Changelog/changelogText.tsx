
const mostRecent = 'v0.4.0-rc2'


const versionInformation = [
    {
        version: 'v0.0.1',
        enhancements: [
            'Spinner to show the app is updating',
            'Description of what permissions are required for API keys',
            'Chart now shows commas',
        ],
        bugs: [
            'Application height / width issues fixed',
        ],
        new: [
            'Distribution for all OSs',
            'Implementation of the bot planner, stats, and settings.'
        ]
    },
    {
        version: 'v0.0.2',
        enhancements: [
            'Alerts to tell the user to refresh the Stats page for updated info',
            'Alternating colors on the bot planner table',
            'Error handling around the sync spinner',
            'Larger pie chart in Stats to fill the div'
        ],
        bugs: [
            'Data table hid the overflow and prevented scrolling.',
            'Additional height issues fixed'
        ],
        new: []
    },
    {
        version: 'v0.0.3',
        enhancements: [
            'Change "Bot Manager" to "Bot Planner"',
            'Improved the overall structure of the code.'
        ],
        bugs: [
            'Fixed issue where bankroll was counting on-orders twice'
        ],
        new: [
            'Multi-currency selector',
            'Feedback / bug reports directly in settings',
            'Project has been migrated fully to Typescript!',
            'Added a multi-account selector'
        ]
    },
    {
        version: 'v0.0.4',
        enhancements: [
            'Auto updating data when you save the settings. This fixes the issue where you have to refresh the stats data for the filters to take effect',
            'Added GBP as a currency option.',
            'All KPIs now have calculated tooltips to help understand where the metrics are coming from',
            'Removed unnecessary alerts across the app',
            'Improved the responsiveness across the application.'
        ],
        bugs: [
            'Fixed issue with calculations when using multiple acounts. This should be resolved',
            'Fixed issued with the bot planner not properly updating calculations when changing the data fields.'
        ],
        new: [
            'Rebuilt the entire settings page, including the initial user onboarding flow',
            'API Key test when adding keys, this also populates the reserved funds table',
            'Reserved funds - Allows you to add / remove funds from the bankroll calculations.',
            'Ability to reset the config and clear the database.',
            'Toast notifications when syncing / saving',
            'Added a donate button... 💰💰💰💰'
        ]
    },
    {
        version: 'v0.0.5',
        enhancements: [
            'Improved the styling of the deal allocation chart',
            'Added a UI alert if no currency / account is enabled',
            'Improved the initial first user flow',
            'Redesigned the headers to take less white space on the page',
            'Fixed typos across the application',
            'Added a POST to the acount update to ensure the most updated information comes directly from the exchange.'
        ],
        bugs: [
            'Fixed incorrect date on settings page when you first set up the application.',
            'Fixed issue where account information from 3C was stale. Fixed this by dropping the accounts table on each sync',
            'Default currency was getting duplicated in multiple places. Removed a default all-together.'
        ],
        new: [
            'Added pair and bot performance charts to see volume, profit, and deal length',
            'Added chart filters to the new charts and conditional coloring to bubbles'
        ]
    },
    {
        version: 'v0.1.0',
        enhancements: [
            'Risk % is now a KPI within Stats',
            'App Version and the changelog can be found at the bottom of Settings',
            'Clarified the Reserved funds as it adds/subtracts funds from the calculations',
            'Added the bot type to the bot performance chart',
            'Charts are sorted by default desc now'

        ],
        bugs: [
            'Fixed bug where the bot names were incorrect because it was stored directly on the deals table',
            'Adjusted the direction that the update spinner went.',
            'Fixed bug with clearing the data causing the application to crash',
            'Fixed bug where deleting the fake bots from the bot planner was unable to save'
        ],
        new: [
            'Added active deals tab with a ton of fun data!',
            'Changelog popup and version information within the settings',
            'Changed the color pallet across the application',
            'Added ability for auto-refreshing the data on a 15 second interval.',
            'DARK MODE is officially released.'

        ]
    },
    {
        version: 'v0.1.1',
        enhancements: [
            'Added average line to the profit by day chart',
            'Fixed KPI display on smaller screens.',
            'Improved the performance of the profit query metrics'
        ],
        bugs: [
            'Redid the entire date filter to now work based on UTC dates instead of splitting the 1st date in a range',
            'Database was showing deleted bots, now the bots table gets cleared on each sync.'
        ],
        new: [
            'Filters now work for the bots table and the deal notifications'
        ]
    },
    {
        version: 'v0.2.0',
        enhancements: [
            'Improved the autosync to bring account data every 5 minutes to keep the bankroll metric correct',
            'Improved the overall responsiveness and scrollbars on the Bot Planner',
            'Project code was restructured to improve understanding for future contributors.',
            'Added an average line to the daily profit chart',
            'Improved profit by day to include month / year on the filter.',
            'Improved readability of the tables in darkmode - Thanks @vdmsmnk!',
            'Adjusted the Y axis to avg deal for Bot Performance scatter.',
            'Risk speedometer now caps at 350%'
        ],
        bugs: [
            'Deals with 0 BO would cause the application to crash because null was not handled',
            'Renaming or deleting an account in 3C would not updating the Reserved Bankroll accounts',
            'The checkbox state for notifications / sync was not properly updating',
            'The metrics on the active deal table were not getting properly updated with each sync.'
        ],
        new: [
            'Added a checkbox to allow you to choose what bots are calculated into the metrics',
            'Added deal length to the push notifications',
            'UNTESTED - Added BTC / ETH to the currency selector',
            'Added additional filters to Bot / Pair performance charts'
        ]
    },
    {
        version: 'v0.2.1',
        enhancements: [
            'Added a calculated tooltip to avg deal hours',
        ],
        bugs: [
            'Manually typing into the date selector would crash the application.',
            'Avg Deal hours was incorrectly averaging the sum by date instead of by deal.'
        ],
        new: []
    },
    {
        version: 'v0.2.2',
        enhancements: [
        ],
        bugs: [
            'Bot manager was not properly downloading the bots'
        ],
        new: []
    },
    {
        version: 'v0.2.3',
        enhancements: [
        ],
        bugs: [
            'Fixed bug in the avg daily profit KPI',
            'Bot manager was capping results at 50 bots. Adjusted this to 1000 and will address looping in a future release.'
        ],
        new: []
    },
    {
        version: 'v0.3.0',
        enhancements: [
            'Bot API looping. Now if you have more than 1000 bots it will sync all of them. Also, more than 1000 bots is... nuts. Are you rich?',
            'Active Bots is renamed to Enabled Bots',
            'Updated the auto-sync to be more preformat. Now it will update only active deals, then if a new active deal is found it updates all deals.'
        ],
        bugs: [
            'Fixed bug where reserved funds was not properly saving to the config',
            'Tooltips would crash the UI if an undefined value was found.',
            'Bot planner did not properly filter/sort based on the enabled status if it was changed on the UI.',
            'Active Deals were not properly updating if a deal was open longer than your last 1000 closed deals. Rewrote the sync logic',
            'Fixed bug in the date display that caused dates to show as an invalid Date'
        ],
        new: [
            'Pair performance by Date within Settings > Performance monitor. This allows you to compare profits on up to 8 pairs at a time by date.',
            'All UI filters / settings now persist upon refresh!',
            'Unrealized profit KPI on active deals.'
        ]
    },
    {
        version: 'v0.4.0-rc2',
        enhancements: [
        
        'Redo of the entire layout of active deals, and stats.',
        'Changed the ROI metric from ROI on bought volume to ROI from total profit and bankroll.',
        'Active Deal pills now are colored based on if that metric is positive, not the deal itself.',
        'New Table fonts for easier viewing of financial data.',
        'Adjusted KPIs to be relevant to the page active.',
        'Adjusted quite a few metrics from three decimals to two.',
        'Adjusted the bot / pair charts to be vertical charts.',
        'Added the average line value on profit by day.',
        'API key is not a secret instead of text field.',
        'Massive backend code enhancements thanks to @TontonAo!',
        'Added Average profit per deal to the bot performance chart.',
        ],
        bugs: [
        
        'Fixed bug in how the pair by date was calculated. This was using `actual_profit` from 3C which returns the profit if you never sold the coin.',
        'Profit by day chart removed days with 0 profit, added these back.',
        'Fixed bug where the TA chart would not load on the first click, additionally fixed the theme of the charts.',
        ],
        new: [
        
        'Added a coin header where you can customize the coins that are tracked on a 5 second refresh.',
        'Update notifications that prompt you to download when you are not on the latest release!',
        'Added SO number to the Deal SO Utilization chart.'
        ]
    },
]

export {
    versionInformation,
    mostRecent
}