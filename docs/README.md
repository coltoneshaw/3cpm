# README

## Summary

The 3C Portfolio Manager is an essential addon to your 3Commas experience. It enables you to manage your DCA bots with greater analytics, real-time alerting, and tons of additional features. It's a downloadable desktop application that's supported across Mac OS, Windows, and Linux operating systems. We are always expanding and adding new features! You may have seen this before as the 3C Portfolio Manager. That Google Sheet was the project that paved the way for the success of this application.

## Table of Contents

* [Initial Setup](./#initial-setup)
* [Feedback / Bug reports](./#feedback-or-bug-submission)
* [Building the application locally](./#building-the-application-locally)
* [Frequently Asked Questions](./#frequently-asked-questions)
* [Change Log](https://github.com/coltoneshaw/3c-portfolio-manager/blob/main/CHANGELOG.md)
* [Screenshots](./#screenshots)

## Initial Setup

1. Download the latest release for your OS from the sidebar.
   * Depending on how you're downloading this file you could get an unsafe file warning. For more information read [Why should I trust this?](./#why-should-i-trust-this) and [Unsafe File Warning](./#unsafe-file-warning).
   * You can find the latest release [here](https://github.com/coltoneshaw/3c-portfolio-manager/releases). Scroll to the bottom and you'll find the download links under `Assets`.
2. Run the installer on your computer \(or a local VM\)
3. Add your API keys to the application, run `Test API keys`
   * The API keys should be **read-only** access in 3C to bots / smart trades / accounts
4. Choose a filter currency, the start date, and enable an account.
   * If you have funds in your account that you **do not** want to be used in calculations add that to the `Reserved Bankroll` field
5. Click Save. This will download the deal data, bots, and account information from 3commas
6. Start to profit!

### Supported Operating Systems

* Debian:
  * 10 - Seems to have a bug when attempting to run an Electron application
  * 11 - Works with the `.Appimage`
* Chrome OS - Works with the `.Appimage`
* macOS - M1 and Intel are fully supported
* Windows
  * &lt;10 - Untested, if it works let me know!
  * 10 - Fully supported
  * 11 - Untested
* Linux
  * Ubuntu - Fully Supported
  * Other distros are currently untested.

## Feedback or Bug Submission

We welcome all feedback and bug reports as it helps us improve the project for everyone. You can submit these reports in two ways:

1. \(Preferred\) If you have a Github account do so on [the issues page](https://github.com/coltoneshaw/3c-portfolio-manager/issues) and select the right type of report.
2. If you do not have a GitHub account you can use our Google Form [here](https://forms.gle/EZeXuLcR8eosikkAA).

If you have any issues don't hesitate to reach out to me on Discord @the\_okayest\_human\#1680

## Building the application locally

### Setting up a dev build

A dev build will enable you to contribute to the project locally, make changes in real time, and test the code for yourself. Just follow the below steps.

1. Download the project locally

```text
git clone https://github.com/coltoneshaw/3c-portfolio-manager.git
```

1. Navigate into the folder you downloaded

```bash
cd 3c-portfolio-manager
```

1. Download the project dependencies.

```text
npm i --include=dev
```

If you experience issues with `node-gyp` when installing the dependencies run `pwd` or equivalent and ensure that you **do not** have any spaces in your path names.

Invalid path name example - `/Desktop/my folder/3c-portfolio-manager`

Valid path name example - `/Desktop/my_folder/3c-portfolio-manager`

1. Build webpack and sqlite3

```text
npm run webpack
npm run rebuild
```

These commands will take a few minutes as they build the webpack config and rebuild sqlite locally.

1. Start the dev server

```text
npm run dev
```

This will start the development version of 3C portfolio manager in a new window for you to test with. As you make changes to the code the application will refresh. You may see errors for dev tools. This is expected until the full build is complete. Give it about a minute to finish.

Note: If you make changes to the Electron main.ts / preload.ts file you may need to cancel the dev server, rebuild with `npm run rebuild`, and start up the dev server again.

### Packaging the application

1. Run steps 1 - 5 of setting the dev server up.
2. Package the application

```text
npm run build
```

1. The relevant build files will be located in `./release`

## Frequently Asked Questions

Questions

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

## Screenshots

### Dark Mode!

![Stats Dark Mode](https://user-images.githubusercontent.com/46071821/129786728-0b809352-4577-407f-9be2-0cbadf502e51.png)

### Active Deals

![Active Deals](https://user-images.githubusercontent.com/46071821/129786817-9baf215d-4dbe-4561-ae3f-5b9bfc33e8f4.png)

### Bot Planner

![Bot Planner](https://user-images.githubusercontent.com/46071821/129786825-b63830c5-f171-48af-a63c-29b90b451e50.png)

### Stats - Performance Monitor

![Stats - Performance Monitor](https://user-images.githubusercontent.com/46071821/129786830-923fa6af-1603-49ab-bbbe-f053c4d1f881.png)

### Stats - Risk Monitor

![Stats - Risk Monitor](https://user-images.githubusercontent.com/46071821/129786831-1394a978-7250-4c17-bea7-85869bfa10fa.png)

### Stats - Summary

![Stats - Summary](https://user-images.githubusercontent.com/46071821/129786832-10048284-7b3f-42bf-b3f3-287b3f87fcd0.png)

### Settings

![Screen Shot 2021-08-17 at 3 18 17 PM](https://user-images.githubusercontent.com/46071821/129787149-8404a624-9b8b-4770-a8cf-2d0131498f3a.png)

