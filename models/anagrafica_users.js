const {DataTypes } = require('sequelize');


 const oggetto_colonne_ang_users={
/**id ci pensa sequelize */
  
    name: {
        type: DataTypes.STRING,
        // allowNull: false,
        // unique: true
    },
    surname:{
        type: DataTypes.STRING,
   
    },
    tel:{
        type: DataTypes.INTEGER,
    
    },
    email:{
        type:DataTypes.STRING,
        
    }
}
//  const oggetto_opzioni_tabella1={
//     freezeTableName: true,//forziamo la pluralizzazione di sequelize
// }
 
const oggetto_opzioni_ang_users={
    timestamps: false,
}


 module.exports={oggetto_colonne_ang_users,oggetto_opzioni_ang_users}