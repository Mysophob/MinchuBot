import { Sequelize } from 'sequelize';

const botDatabase = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

export default botDatabase;
