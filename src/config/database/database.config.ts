export default () => ({
  database: {
    type: 'mysql',
    host: process.env.host || 'localhost',
    port: process.env.port && parseInt(process.env.port, 10) || 3306,
    username: process.env.username || 'root',
    password: process.env.password || 'password',
    database: process.env.database || 'test',
    entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development', // 仅在开发环境下同步
  },
});