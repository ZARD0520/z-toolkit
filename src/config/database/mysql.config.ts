export default () => ({
  database: {
    type: 'mysql',
    host: process.env.SQL_HOST || 'localhost',
    port: (process.env.SQL_PORT && parseInt(process.env.SQL_PORT, 10)) || 3306,
    username: process.env.SQL_USERNAME || 'root',
    password: process.env.SQL_PASSWORD || 'password',
    database: process.env.SQL_DATABASE || 'test1',
    entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development', // 仅在开发环境下同步
  },
});
