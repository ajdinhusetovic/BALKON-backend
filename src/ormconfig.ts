import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'postgresql-recipie1.alwaysdata.net',
  port: 5432,
  username: 'recipie1',
  password: 'Orhideja1',
  database: 'recipie1_balkon',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
