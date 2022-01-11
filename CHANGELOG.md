# v2.0.0
## New Features
- Add copy today stats button
- Abstract backend electron from the application for web portability.
- Added write mode to update deal TP. Future possibilities coming.
- Added a Open in 3C button to deals and bots.
- Added API error banner to display instead of the alert.
- Added Snapshot dashboard that allows a combination of currencies, accounts, and displays statistics centered around profit.
- Implemented the ability to show/hide specific columns.
- Added UST

## Enhancements
- Improved the 3C API handler.
- Reworked entire data storage logic to break profiles into set databases.
- Improved table layout to flex, should be more stable on all screen sizes. 
## Bug Fixes
- Max Active Deals column was not editable on the bot planner
- Fixed notification settings that did not persist on reload.
- Bot API calls only pulled 100 bots at a time, improved this to pull all bots.
- Fix tooltips that were hidden behind elements.
- Improved reliability of the auto refresh function.
- Multiple profiles would rewrite old deals causing a loss of data. 
- Fixed reserved funds storing as a string instead of number.

# v1.0.0

## New Features
- Save settings into a custom profile and fast swap between! Even supports multiple 3 Commas accounts.
- Auto-refresh bar has a built-in loading indicator in seconds.
- DCA calculator, order details, and order timeline built into every active deal.
- Force paper or real account directly in the settings.
- Documentation on docs.3cpm.io along with a link in the sidebar!
- Support for ALL 3Commas quote pairs across the entire app.
- Added Completed SO Distribution chart.
- Added bot risk % to the bot planner to show how much risk that bot accounts for.


## Enhancements
- Enabled accounts are synced on every auto-refresh, no more out-of-date data!
- Update banner now differentiates between beta and general releases.
- TTP has been added to the active deals bot name hover.
- Active deals with an error have the `Active SO` and `# SO` in bold red with a tooltip hover to see the specific error message.
- Adjusted wording on deal notifications if you lost money.
- Reset all data is moved under Menu > Help > Delete All
- Added a clear all local storage under Menu > Edit
- Adjusted metrics to be ordered the same across stats.
- Dynamic chart height for bot/pair performance based on the number of data points.
- Improved overall chart formatting (highlighting, colors, bar width, etc.)
- Adjusted tooltips and headers for better clarity.
- Improved the Risk Monitor view for larger screens. 
- Improved chart loading performance
- Updating TradingView Icon

## Bugs
- Fixed a few spelling mistakes across the app
- Fixed the max risk bar from overflowing if over 400% risk.
- Updated unnecessary scroll bars across the app

## Breaking Changes
- You can no longer select more than currency unless it's a USD base. This will be improved in the future.


## Backend Changes
- Entire data handling has been moved from React context API to Redux
# v0.4.1

## New Features
- MacOS application is now signed and does not require additional permissions to download!
- Menu bar under help includes relevant links to github, discord, and more.

## Enhancements
- Updates the overall style of active deals (removed top header, normalized number width)

## Bug Fixes
- Discovered issue in how the bots calculated funds when MSTC was 0. Resolved this by properly calculating the MSTC with active + completed SOs.
- Fixed bug in the Manual SO count metric showing cancelled deals counted.
- Fixed hovering on the darkmode icon.
- Fixed the labels incorrectly wrapping on the bot performance charts


# v0.4.0
## New Features
- Added a coin header where you can customize the coins that are tracked on a 5 second refresh.
- Update notifications that prompt you to download when you're not on the latest release!
- Added SO number to the Deal SO Utilization chart.

## Enhancements 
- Redo of the entire layout of active deals, and stats.
- Changed the ROI metric from ROI on bought volume to ROI from total profit and bankroll.
- Active Deal pills now are colored based on if that metric is positive, not the deal itself.
- New Table fonts for easier viewing of financial data.
- Adjusted KPIs to be relevant to the page active.
- Adjusted quite a few metrics from three decimals to two.
- Adjusted the bot / pair charts to be vertical charts.
- Added the average line value on profit by day.
- API key is not a secret instead of text field.
- Massive backend code enhancements thanks to @TontonAo!
- Added Average profit per deal to the bot performance chart.
- Adjusted number length on the active deals table


## Bug
- Fixed bug in how the pair by date was calculated. This was using `actual_profit` from 3C which returns the profit if you never sold the coin
- Profit by day chart removed days with 0 profit, added these back.
- Fixed bug where the TA chart would not load on the first click, additionally fixed the theme of the charts.



# v0.3.0
## Bug
- Fixed bug in the date display that caused dates to show as an invalid Date
- Active Deals were not properly updating if a deal was open longer than your last 1000 closed deals. Rewrote the sync logic
- Bot planner did not properly filter/sort based on the enabled status if it was changed on the UI.
- Tooltips would crash the UI if an undefined value was found.
- Fixed bug where reserved funds was not properly saving to the config

## Enhancements
- Updated the auto-sync to be more preformat. Now it will update only active deals, then if a new active deal is found it updates all deals.
- Active Bots is renamed to Enabled Bots
- Bot API looping. Now if you have more than 1000 bots it'll sync all of them. Also, more than 1000 bots is... nuts. Are you rich?

## New Features
- Pair performance by Date within Settings > Performance monitor. This allows you to compare profits on up to 8 pairs at a time by date.
- All UI filters / settings now persist upon refresh!
- Unrealized profit KPI on active deals.
- Added EUR to the currency selector

# v0.2.3
## Bug
- Fixed bug in the avg daily profit KPI
- Bot manager was capping results at 50 bots. Adjusted this to 1000 and will address looping in a future release.

# v0.2.2
## Bug
- Issue with bot manager not properly pulling in the bots.

# v0.2.1

## Enhancements
- Added a calculated tooltip to avg deal hours

## Bug
- Manually typing into the date selector would crash the application.
- Avg Deal hours was incorrectly averaging the sum by date instead of by deal.

# v0.2.0

##  Enhancements
- Improved the auto-sync to bring account data every 5 minutes to keep the bankroll metric correct
- Improved the overall responsiveness and scrollbar on the Bot Planner
- Project code was restructured to improve understanding for future contributors.
- Added an average line to the daily profit chart
- Improved profit by day to include month / year on the filter.
- #9 - Improved readability of the tables in dark mode - Thanks @vdmsmnk!
- Adjusted the Y axis to avg deal for Bot Performance scatter.
- Risk speedometer now caps at 350%'
- Migrated the data tables from DataGrid (Material-UI) to React-table and made these a bit more responsive. This also fixed a bug with multiple scroll bars.

## Bugs
- Deals with 0 BO would cause the application to crash because null was not handled
- Renaming or deleting an account in 3C would not updating the Reserved Bankroll accounts
- The checkbox state for notifications / sync was not properly updating
- #10 - The metrics on the active deal table were not getting properly updated with each sync.

## New Features
- Added a checkbox to allow you to choose what bots are calculated into the metrics
- Added deal length to the push notifications
- UNTESTED - Added BTC / ETH to the currency selector
- Added additional filters to Bot / Pair performance charts'

## Backend
- Added upsert to sqlite to merge bot data with database.
- Added 'hide' database column in bots


# v0.1.1

## Enhancements
- Added average line to the profit by day chart
- Fixed KPI display on smaller screens.
- Improved the performance of the profit query metrics

## Bug Fixes
- Redid the entire date filter to now work based on UTC dates instead of splitting the 1st date in a range
- Database was showing deleted bots, now the bots table gets cleared on each sync.

## New Features
- Filters now work for the bots table and the deal notifications



# v0.1.0

## Enhancements
- Risk % is now a KPI within Stats
- App Version and the changelog can be found at the bottom of Settings
- Clarified the Reserved funds as it adds/subtracts funds from the calculations
- Added the bot type to the bot performance chart
- Charts are sorted by default desc now

## Bug Fixes
- Fixed bug where the bot names were incorrect because it was stored directly on the deals table
- Adjusted the direction that the update spinner went.
- Fixed bug with clearing the data causing the application to crash
- Fixed bug where deleting the fake bots from the bot planner was unable to save

## New Features
- Added active deals tab with a ton of fun data!
- Changelog popup and version information within the settings
- Changed the color pallet across the application
- Added ability for auto-refreshing the data on a 15 second interval.
- DARK MODE is officially released.



# v0.0.5

## New Features:
- Pair and bot performance chart to see volume, profit, and deal length
- Added chart filters and additional bubble charts

## Bug Fixes:
- Incorrect date on the settings page, this was pulling account ID into the date.
- Issue where outdated currency data was being shown. Fixed this by adding a delete to remove the account table on each sync.
- Default currency was getting duplicated due to the default config.

## Enhancements:
- Better styling of the deal allocation chart
- Added UI alert if no currency or account is enabled
- Improved the initial first user onboarding flow
- Redesigned the headers on each page to work better and utilize the screen better
- Fixed various typos across the app
- Added a `POST` to the account update to pull updated account information on each sync


# v0.0.4
- a TON of settings and user flow updates
    - New structure to the settings page to utilize more of the screen
    - API key test so you can verify easily if you've properly uploaded the keys
    - Reserved funds that you can set per account
    - Auto updating data when you save settings. This prevents the need to manually refresh anything. The only downside is the initial load can take some time. Added a fun loader.
    - Added GBP to currency options (use with caution at the moment)
    - Now resetting the config will also clear the database.
- KPI tooltip descriptions. These are dynamic descriptions on each KPI that help understand where the numbers are coming from!
- Added toast notifications when syncing / saving and removed alerts.
- Added basic responsiveness to the containers. 
- Donate button.
- Bug Fixes:
    - Issue with calculations when using multiple accounts. This should be resolved
    - Bot Planner screen was not properly updating calculations.


# v0.0.3

- Multi-Currency selector
- Feedback / bug report links in the settings
- Chart refresh is now included in the refresh data button
- Project has been migrated fully to TypeScript
- Fixed issues in the bankroll miscalculating
- Renamed the bot manager to Bot Planner
- Added a multi-Account selector
- Cleaned up the functions to into utility files.

# v0.0.2-RC1

- Fixed issue where the data table hid the overflow and prevented scrolling. Will need further improvements for responsiveness.
- Added alerts when making changes to the settings page to inform you of a needed refresh
- Alternating colors on the data table
- try/catch block to the data functions so it properly changes the state of the spinner
- conditional routing rules based on if API keys are set up or not.
- Spinning icons when the data is updating.
- Added a rough description of API key perms needed to the settings page
- Increased pie chart size (praise), added formatting to the tooltips

# v0.0.1-RC1
- added spinner to the update data icons
- added description of API keys
- modified the chart to show thousands
- application height issues resolved
- settings button height has been updated

# v0.0.1
- implemented and tested the mac dmg installer
- moved files from public into the src
- moved asset files around
- fixed a bug in the length of the name array for filters causing an error
- added columns to the bots table
