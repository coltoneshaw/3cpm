# Setup a dev build

A developers build will enable you to contribute to the project locally, make changes in real time, and test the code for yourself. Just follow the below steps.

1. Download the project locally

   ```text
   git clone https://github.com/coltoneshaw/3c-portfolio-manager.git
   ```

2. Navigate into the folder you downloaded

   ```bash
   cd 3c-portfolio-manager
   ```

3. Download the project dependencies.

   ```bash
   npm i --include=dev
   ```

  
   If you experience issues with `node-gyp` when installing the dependencies run `pwd` or equivalent and ensure that you **do not** have any spaces in your path names.

   Invalid path name example - `/Desktop/my folder/3c-portfolio-manager`

   Valid path name example - `/Desktop/my_folder/3c-portfolio-manager`

4. Build webpack and sqlite3

   ```text
   npm run webpack
   npm run rebuild
   ```

   These commands will take a few minutes as they build the webpack config and rebuild sqlite locally.  

5. Start the dev server

   ```text
   npm run dev
   ```

   This will start the development version of 3C portfolio manager in a new window for you to test with. As you make changes to the code the application will refresh. You may see errors for dev tools. This is expected until the full build is complete. Give it about a minute to finish.

   Note: If you make changes to the Electron main.ts / preload.ts file you may need to cancel the dev server, rebuild with `npm run rebuild`, and start up the dev server again.

```bash
npm i --include=dev
```

