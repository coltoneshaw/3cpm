export default class BaseElectronRepository {
    protected electron: any;

    constructor(electron: any) {
        this.electron = electron;
    }
}