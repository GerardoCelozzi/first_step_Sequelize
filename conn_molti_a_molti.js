/**
 * implementiamo due relazioni una molti tra due tabelle
 * in una tabella join di giunzione
 * dove ogni riga di questa tabella di giunzione contiene
 * le chiavi primarie delle due tabelle coinvolte 
 * queste chiavi primarie risulteranno essere quindi le fk delle due tabelle che partecipano a
 * questo tipo di relazione che le vede coinvolte
 * una tabella di giunzione in sqlize ha piu colonne di chiavi esterne 
 * sequelize conosce le associazione che corrispondo alla data delle colonna di chiave esterna nella tabella di giunzione
 */
 const { Sequelize, DataTypes } = require('sequelize');//il modulo di ritorno è una funzione di costruzione (metodo costruttore di un oggetto)
 //convezione lettara maiuscola







const oggetto_opzioni={
host: 'localhost',
dialect: 'mysql' ,
//logging: (...msg) => console.log(msg),
}


const conn = new Sequelize('sequelize_sync_intables', 'root', '', oggetto_opzioni);

//afterConnect: {params: 2},
conn.addHook('afterConnect', () => {
console.log("\nci siamo connessi potrei eliminare l invocazione del metodo autenticate")
});

const Consumatore=conn.define('consumatori',{
nome:{
type:DataTypes.STRING
}
},{
timestamps:false,
paranoid: true,
freezeTableName:true
})
const Product=conn.define('product',{
nome:{
type:DataTypes.STRING
}
},{
timestamps:false,
paranoid: true,
})
//conn.sync({alter:true})

module.exports=conn