# Google Sheets

### Why did we change from Google Sheets?

If you find yourself asking "Why did you go from Google Sheets to an Electron app? I love sheets!" then read below!

There were two reasons in the consideration of switching, the limitations/performance of sheet storage and the pain of end-users updating the sheet.

#### Performance and storage limitations

As you might know, Google Sheets limits your entire sheet to be about five million cells which means you cannot have all of your transaction data and for some people, you can only have a small subset of your recent deals. We went through a long process of pruning the data not needed and becoming critical of each column that we added. We even took the step of limiting the sheet to only about 5000 deals, however, this was still about 300k columns and a 2-6 minute data refresh the experience.

**The updates...**

How long have you used the sheet? Was it during the period when we had a new update every hour it seemed? So you may have experienced the pain updating was. It meant you had to...

1. Go copy the new sheet
2. Delete your old sheet
3. Regenerate your API keys
4. Put them in the new sheet
5. Hope the sheet took them without hitting an error that required private browsing... 
6. Resync the entire sheet
7. Now you have your data again.

Did that feel like a lot to you? Imagine doing it every time we release a new version. It's a pain, sometimes _even I_ wouldn't update to the new version since it wasn't worth it. Now with it being local, that means all you need to do is download the latest version, run the installer and you're done! Everything under the hood is stored directly on your computer. Which means it's also far safer.

