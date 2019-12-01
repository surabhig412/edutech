const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  mysql_host: process.env.MYSQL_HOST,
  mysql_user: process.env.MYSQL_USER,
  mysql_password: process.env.MYSQL_PASSWORD,
  employee_user: process.env.EMPLOYEE_USER,
  employee_password: process.env.EMPLOYEE_PASSWORD,
  user: process.env.USER_NAME,
  user_password: process.env.USER_PASSWORD
};
