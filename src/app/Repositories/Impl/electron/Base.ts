export default class BaseElectronRepository {
    protected mainPreload: any;

    constructor(mainPreload: any) {
        this.mainPreload = mainPreload;
    }
}