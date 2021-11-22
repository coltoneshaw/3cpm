# Active Deals

### Why do my active SOs not match 3C?

This is a fun one. It seems that how 3Commas handles Max Safety Trades is not how you'd expect. You can fill 5 SOs, have 1 active SO but manually set your MSTC to 0. This means that when attempting to calculate the max deal funds within the application it stops at the MSTC value, causing a mismatch in max deal funds on 3cpm and on 3commas. To mitigate this we manually update this value in the app to be the max of either MSTC or filled SOs + active SOs.

### What does auto sync do?

Auto sync will update your deals and accounts every 15 seconds with information directly from 3Commas. Additionally, it turns on the ability to have push notifications about your deals closing!

