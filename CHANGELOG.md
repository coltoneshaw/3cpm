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

## Known Bugs / Issues:
- Trading View page requires you to click the icon twice to load. 
- Dark mode does not exist yet, but the button is there.
- You may see an invalid date on settings when first setting up the application.
- No right clicking inside of text boxes.
- Multiple scrollable views inside of the Bot planner chart. 
- When pressing the reset button it does not always clear API keys and the API test button won't work after reset.


## Things you can test / Feedback on
- Does setting reserved funds properly remove from your bankroll?
- Verify all calculations that you can across the application.
- Are you seeing anything cut off on your screen horizontally? 
- How easy is the Bot planner to use / understand?
- What charts / data view do you think is missing?


v0.0.3

- Multi-Currency selector
- Feedback / bug report links in the settings
- Chart refresh is now included in the refresh data button
- Project has been migrated fully to TypeScript
- Fixed issues in the bankroll miscalculating
- Renamed the bot manager to Bot Planner
- Added a multi-Account selector
- Cleaned up the functions to into utility files.

v0.0.2-RC1

- Fixed issue where the data table hid the overflow and prevented scrolling. Will need further improvements for responsiveness.
- Added alerts when making changes to the settings page to inform you of a needed refresh
- Alternating colors on the data table
- try/catch block to the data functions so it properly changes the state of the spinner
- conditional routing rules based on if API keys are set up or not.
- Spinning icons when the data is updating.
- Added a rough description of API key perms needed to the settings page
- Increased pie chart size (praise), added formatting to the tooltips
- fixed application height issues
- settings button height, and scrolling on that page.

v0.0.1-RC1
- added spinner to the update data icons
- added description of API keys
- modified the chart to show thousands
- application height issues resolved
- settings button height has been updated

v0.0.1
- implemented and tested the mac dmg installer
- moved files from public into the src
- moved asset files around
- fixed a bug in the lenght of the name array for filters causing an error
- added columns to the bots table