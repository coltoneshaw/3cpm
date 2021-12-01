import { config } from "@/main/Config/config";
import { TconfigValues } from "@/types/config";
import { checkOrMakeTables } from "./Database/initializeDatabase";

const checkInvalidConfig = async (currentProfile: string | undefined | 'default', loadedConfig: TconfigValues) => {
    
    if(!currentProfile || currentProfile === 'default'){
        const profileIds = Object.keys(loadedConfig.profiles);
        config.set('current', profileIds[0])
    }
}

const checkProfileDatabase = async (currentProfile: string) => {
    await checkOrMakeTables(currentProfile)
}



export const preloadCheck = async () => {
    const loadedConfig = config.store;
    const currentProfile = loadedConfig?.current;

    await checkInvalidConfig(currentProfile, loadedConfig)
    await checkProfileDatabase(currentProfile)
}