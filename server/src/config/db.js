import { Sequelize } from 'sequelize';
import 'dotenv/config.js'

const sequelize = new Sequelize('hirehub', 'root', 'Amsni1987!', {
    dialect: 'mysql'
});

export default sequelize;
