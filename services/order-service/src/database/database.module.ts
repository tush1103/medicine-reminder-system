import { Module } from '@nestjs/common';
import { databaseProvider, DATABASE_POOL } from './database.provider';

@Module({
  providers: [databaseProvider],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
