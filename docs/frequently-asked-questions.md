# Frequently Asked Questions

Table of Questions:

* [Why do my active SOs not match 3C?](./#why-do-my-active-sos-not-match-3C)
* [Why did we change?](./#why-did-we-change)
* [Why did we go with a downloadable application?](./#why-did-we-go-with-a-downloadable-application)
* [Why should I trust this?](./#why-should-i-trust-this)

### Why do my active SOs not match 3C?

This is a fun one. It seems that how 3Commas handles Max Safety Trades is not how you'd expect. You can fill 5 SOs, have 1 active SO but manually set your MSTC to 0. This means that when attempting to calculate the max deal funds within the application it stops at the MSTC value, causing a mismatch in max deal funds on 3cpm and on 3commas. To mitigate this we manually update this value in the app to be the max of either MSTC or filled SOs + active SOs.

TLDR; Numbers were wrong, fixed and the app is _more right_.

### Why did we change?

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

### Why did we go with a downloadable application?

I know, quite a few people might be up in arms about requiring a download on their computer to use this. It was ultimately a tough decision but one that I hope you agree made sense. There were a few considerations:

1. Cost. Running an application through a website is not cheap, requires a lot of work to maintain, and is difficult to scale for a small project.
2. Data storage / security. Building a website requires storing your API keys, transaction data, managing cookies, logins, and more on a database that you have to trust us to keep secure. I don't need that on my conscience right now. Having a local app means that your data is as secure as you keep your computer. It's stored with normal application files, encrypted when necessary, and about as isolated from the world as a database can get. This also means that you're fully in control of your data at all times.

### Why should I trust this?

Well, for starters you shouldn't; At least, not right away. Every time you try something new you should ask yourself a few questions. \(Let's do another list!\).

#### 1. Who are these people?

Right away you can see that this is my real profile with all my real information tied to it. I have a small but important reputation to uphold. A quick google search will show you more than I care to see about myself. Anyone who works on this project has to go through me before getting their code approved for the project. So, at a bare minimum, you have that level of trust.

#### 2. What would they gain from my data?

We have reduced the need for data altogether in this project. The keys are **read-only**, do not send you data off anywhere, and quite frankly transactional data history is boring.

#### 3. It's open-source, so you can review the code and even compile it yourself!

You can search through the code for anything you want to find, it's all available to you. Many people have used this, ran it through virus scanners and the works. At the end of the day I'm building this for myself but the community benefits as well.

### Unsafe File Warning

If you are downloading this for the first time you may get an `Unsafe file warning` within Edge / Chrome / Firefox. This is because the file is currently an unsigned download. Code Signing costs money and takes time. Unfortunately, this project has not reached that point yet.

How can you help? 1. Consider buying a coffee to support the project. If we can raise enough we can look into getting a code signing certificate. They run about $300 - $600 / yr. [You can buy a coffee here!](https://www.buymeacoffee.com/ColtonS) 2. Flag the file as safe once you've downloaded this. The more reports we get the less it'll happen!

* Edge: Click the three dots &gt; `report this file as safe`. 

If you still feel unsafe downloading this file you can download the source code and compile it yourself, or run it through any virus scanner.

