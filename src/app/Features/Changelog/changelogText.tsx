
const mostRecent = '0.1.0'


const versionInformation = [
    {
        version: '0.0.1',
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
        version: '0.0.2',
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
        version: '0.0.3',
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
        version: '0.0.4',
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
        version: '0.0.5',
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
        version: '0.1.0',
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
]

export {
    versionInformation,
    mostRecent
}