const { Sequelize } = require('sequelize')


/**importazioni oggetti che personalizza le nostre tabelle */
const{oggetto_colonne_users,oggetto_opzioni_users}=require('./models/users')
const{oggetto_colonne_ang_users,oggetto_opzioni_ang_users}=require('./models/anagrafica_users')
const{oggetto_colonne_city,oggetto_opzioni_city}=require('./models/city')

/**importazione modulo metodi */
const{getSchemaDatabase,query_diretta_1}=require('./quering/funzioni_dirette_su_database')

const oggetto_opzioni={
    host: 'localhost',
    dialect: 'mysql' ,
    //logging: (...msg) => console.log(msg),
  }
  
  
  const connessione = new Sequelize('sequelize_sync_intables', 'root', '', oggetto_opzioni);
/**definiamo le nostre tabelle per quetsa instanza */
  const User = connessione.define('user',oggetto_colonne_users,oggetto_opzioni_users)
  const Ang_User=connessione.define('anagrafica_users',oggetto_colonne_ang_users,oggetto_opzioni_ang_users)
  const Citta=connessione.define('city',oggetto_colonne_city,oggetto_opzioni_city)

    /**start services */
   
    const rendi_lista_risposta=(risp)=>{
        risp.forEach(element => {
            console.log("*** ->",element.toJSON())
        })
    }
    /**end services */


  getSchemaDatabase(connessione).then(data=>{
      console.log("schema: ",data)
  })
  const query_diretta_nessuna_mappatura_della_azione_in_node=async ()=>{
    const resp=await query_diretta_1(Citta,connessione)
    rendi_lista_risposta(resp)
  }
  query_diretta_nessuna_mappatura_della_azione_in_node()
  module.exports=connessione