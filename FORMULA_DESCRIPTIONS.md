## Bank Roll Calculations

### Total Bankroll
Formula:
`Total Bankroll = Position ( Funds in that currency ) + funds currently in deals` 

Additional information:
    - What is in position?
        - Position is a sum of what you have in active deals + what you have in available funds. This 
    - Why doesn't it match exactly to my crypto account?
        - Your crypto account also takes into account any coins that you hold that are not a part of your DCA bots. For example, if you've made a smart trade, holding coins, etc.
        - Additionally, the data from your crypto account to 3Commas is not always up to date, there may be slight variances in the numbers. But you should see within 1-4% the number is right.

### Bankroll Available:
Formula:
` ( 1 - ( ( funds currently in deals ) / ( Total Bankroll )) ) * 100 = remaining bankroll percent`


Additional information:
    - This takes into account all the bankroll you have for the selected currency and gives the percent remaining after you remove what's on an order plus funds in a deal.
    - This is calculated within the `calculateMetrics` inside `DataContext.js`
