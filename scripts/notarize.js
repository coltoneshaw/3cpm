// inspired by https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
require('dotenv').config();
const {notarize} = require('electron-notarize');


exports.default = async function notarizing(context) {
    const {electronPlatformName, appOutDir} = context;
    if (electronPlatformName !== 'darwin' || process.platform !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;
    if (typeof process.env.APPLEID === 'undefined') {
        console.log('skipping notarization, remember to setup environment variables for APPLEID and APPLEIDPASS if you want to notarize');
        return;
    }
    return await notarize({
      appBundleId: 'com.savvytoolbelt.3cportfoliomanager',
      appPath: `${appOutDir}/${appName}.app`,
      appleId: 'coltoneshaw@gmail.com',
      appleIdPassword: 'cyuj-jlos-zcjw-lkoy',
      tool: 'notarytool',
      teamId: '4UHVHSRL22'
    });
};
