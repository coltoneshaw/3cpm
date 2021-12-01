import { config } from "@/main/Config/config";

const checkInvalidConfig = async () => {
    const loadedConfig = config.store;
    const currentProfile = loadedConfig?.current;
    if(!currentProfile || currentProfile === 'default'){
        const profileIds = Object.keys(loadedConfig.profiles);
        config.set('current', profileIds[0])
    }
}

export const preloadCheck = async () => {
    await checkInvalidConfig()
}