import type { general, pm } from "@/types/preload";


export interface GeneralRepository {
    openLink: general['openLink']
}

export interface PmRepository {
    versions: pm['versions']
}