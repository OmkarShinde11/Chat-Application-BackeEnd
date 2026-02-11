const sequelize=require('./utils/db-connection');
require('./models/index');


(async () => {
    try {
      await sequelize.authenticate();
      console.log('DB connected');
  
      await sequelize.sync({ alter: true });
      console.log('All tables synced');
    } catch (err) {
      console.error(err);
    }
  })();