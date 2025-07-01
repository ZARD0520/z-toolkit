export default () => ({
  database: {
    type: 'mysql',
    host: process.env.sql_host || 'localhost',
    port: (process.env.sql_port && parseInt(process.env.sql_port, 10)) || 3306,
    username: process.env.SQL_USERNAME || 'root',
    password: process.env.sql_password || 'password',
    database: process.env.sql_database || 'test1',
    entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development', // 仅在开发环境下同步
  },
});
