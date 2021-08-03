# Why did we change?

If you find yourself asking "Why did you go from Google Sheets to an Electron app? I love sheets!" then read below!

There were two reasons in the consideration to switch, the limitations/performance of sheet storage and pain of end users updating the sheet.

### Performance and storage limitations
As you might know, Google Sheets limits your entire sheet to be about five million cells which means you cannot have all of your transaction data. We went through a process of pruning the data not needed and really being critical of each column that we added. Additionally, we limited deals to about 5000 which already took up about 300k+ cells.

### The updates...
How long have you used the sheet? Was it during the period when we had a new update every hour it seemed? So you may have experienced the pain updating was. It meant you had to:

1. Go copy the new sheet
2. Delete your old sheet
3. Regenerate your API keys
4. Put them in the new sheet
5. Hope she sheet took them without hitting an error that required private browsing... 
6. Resync the entire sheet
7. Now you have your data again.

Did that feel like a lot to you? Imagine doing it every time we release a new version. It's a pain, sometimes _I_ wouldn't even update to the new version since it wasn't worth it. Now with it being local that means all you need to do is download the latest version and swap out the program itself. Everything under the hood is stored in your data application storage!

# Why did we go with a downloadable application?

I know, quite a few people might be up in arms about requiring a download on their computer to use this. It was ultimately a tough decision but one that I hope you agree made sense. There were a few considerations:

1. Cost.
2. Data storage. Building a website requires storing your keys, transaction data, managing cookies, logins, and more on a database that you have to trust us to keep it secure. I don't need that on my concenious right now. Having a local app means that your data is as secure as you keep your computer. It's stored with normal application files, encrypted when necessary, and about as isolated from the world as a live database can get.


# Why should I trust this?

Well, for starters you shouldn't. At least, not right away. Every time you try something new you should ask yourself a few questions. (Let's do another list!).

1. Who are these people?
You can see right away that this repo is under my real name with my real company attached to it. I have a small but important repuation to uphold. A quick google search will show you more than I care to see about myself. Anyone who works on this project has to go through me before getting their code approved into the project.

2. What would they gain from my data?
3. Just search for anything that's `https` or looks like an IP address.
4. It's open source, so you can review the code and even compile it youself!



# Test Functions

## Get bankroll test

```javascript
// code to find bankroll
let testAccountData = async (accountId, currencyCode) => {
    const accountData = await electron.database.query(`select * from accountData where account_id IN (${accountId}) and currency_code IN ('${currencyCode}') `);


    let on_orders;
    let position;


    if (accountData.length > 0) {
        let on_ordersTotal = 0;
        let positionTotal = 0;

        for (const account of accountData) {
            const { on_orders, position } = account
            on_ordersTotal += on_orders;
            positionTotal += position;

        }

        console.log({ on_ordersTotal, positionTotal })
        position =  positionTotal
        on_orders = on_ordersTotal
        }
    

    let activeDeals = await electron.database.query(`select * from deals where finished = 0 and currency IN ('${currencyCode}')  and account_id IN (${accountId}) `)
    const boughtVolume = activeDeals.map((deal) => deal.bought_volume).reduce((sum, item) => sum + item)

    console.log('Bankroll is: ' + ( position + boughtVolume ))
    console.log({position, on_orders, boughtVolume})
}
```

You can run this function with `testAccountData(30368609, 'BUSD')`