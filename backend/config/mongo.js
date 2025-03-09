const mongoose = require('mongoose')
const DB_URL = process.env.MONGODB_URI
const PORT = process.env.PORT

module.exports = () => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        console.log(`
            ****************************
            *    Starting Server 
            *    Port: ${PORT || 5000}
            *    Time: ${new Date().toLocaleTimeString()}
            *    Date: ${new Date().toLocaleDateString()}
            *    - CONNECTION OK -
            ****************************
          `)
      })
      .catch((err) => console.error(err));
}
