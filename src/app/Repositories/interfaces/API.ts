export default interface APIRepository {
    update(type: string, options: any, profileData: any): any;
    updateBots(profileData: any): any;
    getAccountData(profileData: any, key?: string, secret?: string, mode?: string): any;
    getDealOrders(profileData: any, dealID: number): any;
}