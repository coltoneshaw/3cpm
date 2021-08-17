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
    - New structure to the settings page to utalize more of the screen
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
    - Issue with calculations when using multiple acounts. This should be resolved
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
- fixed a bug in the lenght of the name array for filters causing an error
- added columns to the bots table