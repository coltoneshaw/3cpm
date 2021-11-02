
// This gets pulled from the preload.ts file opening up the electron api to the app window.

export default class BaseElectronRepository {
    protected mainPreload: Window["mainPreload"];

    constructor(mainPreload: Window["mainPreload"]) {
        this.mainPreload = mainPreload;
    }
}