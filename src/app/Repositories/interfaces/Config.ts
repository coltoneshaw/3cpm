export default interface ConfigRepository {
    get(value: string): any;
    getProfile(value: string): any;
    reset(): any;
    set(key: string, value: any): any;
    setProfile(key: string, value: any): any;
    bulk(changes: object): any;
}
