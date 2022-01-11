import type {database, tableNames} from '@/types/preload';

export default interface DBRepository {
    query: database['query'];
    update: database['update'];
    upsert: database['upsert'];
    run: database['run'];
    deleteAllData: database['deleteAllData'];
}
