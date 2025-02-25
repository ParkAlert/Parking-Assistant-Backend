import { Module, Global } from '@nestjs/common'
import { Pool } from 'pg'
import { ConfigModule, ConfigService } from '@nestjs/config'

const databaseProvider = {
  provide: 'DATABASE_POOL',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const user = configService.get('POSTGRES_USER')
    const password = configService.get('POSTGRES_PASSWORD')
    const host = configService.get('POSTGRES_HOST', 'localhost')
    const port = configService.get('POSTGRES_PORT', '5432')
    const database = configService.get('POSTGRES_DB', 'parkAlert')

    return new Pool({
      connectionString: `postgres://${user}:${password}@${host}:${port}/${database}`
    })
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}