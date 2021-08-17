# Summary

The 3C Portfolio Manager is an essential addon to your 3Commas experience. It enables you to manage your DCA bots with greater analytics, real-time alerting, and tons of additional features. It's a downloadable desktop application that's supported across Mac OS, Windows, and Linux operating systems. We are always expanding and adding new features! You may have seen this before as the 3C Portfolio Manager. That Google Sheet was the project that paved the way for the success of this application.


# Table of Contents

- [Initial Setup](#initial-setup)
- [Frequently Asked Questions](#frequently-asked-questions)
    - [Initial Setup](#initial-setup)
    - [Why did we change?](#why-did-we-change)
    - [Why did we go with a downloadable application?](#why-did-we-go-with-a-downloadable-application)
    - [Why should I trust this?](#why-should-i-trust-this)
- [Change Log](https://github.com/coltoneshaw/3c-portfolio-manager/blob/main/CHANGELOG.md)

# Initial Setup

1. Download the latest release for your OS from the sidebar.
2. Run the installer on your computer (or a local VM)
3. Add your API keys to the application, run `Test API keys`
4. Choose a filter currency, the start date, and enable an account.
    - If you have funds in your account that you **do not** want to be used in calculations add that to the `Reserved Bankroll` field
5. Click Save. This will download the deal data, bots, and account information from 3commas
6. Start to profit!


# Frequently Asked Questions

## Why did we change?

If you find yourself asking "Why did you go from Google Sheets to an Electron app? I love sheets!" then read below!

There were two reasons in the consideration of switching, the limitations/performance of sheet storage and the pain of end-users updating the sheet.

### Performance and storage limitations
As you might know, Google Sheets limits your entire sheet to be about five million cells which means you cannot have all of your transaction data and for some people, you can only have a small subset of your recent deals. We went through a long process of pruning the data not needed and becoming critical of each column that we added. We even took the step of limiting the sheet to only about 5000 deals, however, this was still about 300k columns and a 2-6 minute data refresh the experience.

#### The updates...
How long have you used the sheet? Was it during the period when we had a new update every hour it seemed? So you may have experienced the pain updating was. It meant you had to...

1. Go copy the new sheet
2. Delete your old sheet
3. Regenerate your API keys
4. Put them in the new sheet
5. Hope she sheet took them without hitting an error that required private browsing... 
6. Resync the entire sheet
7. Now you have your data again.

Did that feel like a lot to you? Imagine doing it every time we release a new version. It's a pain, sometimes _even I_ wouldn't update to the new version since it wasn't worth it. Now with it being local, that means all you need to do is download the latest version, run the installer and you're done! Everything under the hood is stored directly on your computer. Which means it's also far safer.

## Why did we go with a downloadable application?

I know, quite a few people might be up in arms about requiring a download on their computer to use this. It was ultimately a tough decision but one that I hope you agree made sense. There were a few considerations:

1. Cost. Running an application through a website is not cheap, requires a lot of work to maintain, and is difficult to scale for a small project.
2. Data storage / security. Building a website requires storing your API keys, transaction data, managing cookies, logins, and more on a database that you have to trust us to keep secure. I don't need that on my conscience right now. Having a local app means that your data is as secure as you keep your computer. It's stored with normal application files, encrypted when necessary, and about as isolated from the world as a database can get. This also means that you're fully in control of your data at all times.


## Why should I trust this?

Well, for starters you shouldn't; At least, not right away. Every time you try something new you should ask yourself a few questions. (Let's do another list!).

### 1. Who are these people?
Right away you can see that this is my real profile with all my real information tied to it. I have a small but important reputation to uphold. A quick google search will show you more than I care to see about myself. Anyone who works on this project has to go through me before getting their code approved for the project. So, at a bare minimum, you have that level of trust.

### 2. What would they gain from my data?
We have reduced the need for data altogether in this project. The keys are **read-only**, do not send you data off anywhere, and quite frankly transactional data history is boring.

### 3. It's open-source, so you can review the code and even compile it yourself!
You can search through the code for anything you want to find, it's all available to you. Many people have used this, ran it through virus scanners and the works. At the end of the day I'm building this for myself but the community benefits as well.
