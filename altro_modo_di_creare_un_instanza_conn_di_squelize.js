/**
 * Nel file in cui si inizializza Sequelize, è necessario chiamare l'importazione in questo modo:
/* Initialize Sequelize */
// Check previous code snippet for initialization
/* Define Models */
// sequelize.import("./models/my_model.js"); // The path could be relative or absolute
// Quindi nei file di definizione del modello, il codice sarà simile a questo:
// module.exports = function(sequelize, DataTypes) {
//  return sequelize.define("MyModel", {
//  name: DataTypes.STRING,
//  comment: DataTypes.TEXT,
//  date: {
//  type: DataTypes.DATE,
//  allowNull: false
//  }
//  });
// };

//  */
//METTIAMO IN CODA QUESTO SOLUZIONE