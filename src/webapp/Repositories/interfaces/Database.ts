import type { Database } from '@/types/preload';

export default interface DBRepository {
  query: Database['query'];
  update: Database['update'];
  upsert: Database['upsert'];
  run: Database['run'];
  deleteAllData: Database['deleteAllData'];
}
