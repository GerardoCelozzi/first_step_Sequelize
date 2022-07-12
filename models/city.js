const {DataTypes } = require('sequelize');


 const oggetto_colonne_city={
/**id ci pensa sequelize */
  
    nome: {
        type: DataTypes.STRING,
        // allowNull: false,
         unique: true
        
    },
    provincia:{
        type: DataTypes.STRING,
        validate:{
            len:[1,2]//se inseriamo citta con create nessun problema il metodo convalida i dati prima di salvarli
            //mentre per il bulkCreate bisgona passare la prop validate :true nell oggetto opzioni
        }
   
    },
    regione:{
        type: DataTypes.STRING,
    
    },
    nazione:{
        type:DataTypes.STRING,
        
    },
    abitanti:{
        type:DataTypes.INTEGER
    }
}
//  const oggetto_opzioni_tabella1={
//     freezeTableName: true,//forziamo la pluralizzazione di sequelize
// }
 
const oggetto_opzioni_city={
    timestamps: false,
    freezeTableName:true
   

}


 module.exports={oggetto_colonne_city,oggetto_opzioni_city}