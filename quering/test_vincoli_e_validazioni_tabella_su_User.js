const alter={alter:true}
const sincronizza=async(model)=>{
    return await model.sync(alter)
}
const rendi_lista_risposta=(risp)=>{
    risp.forEach(element => {
        console.log("*** ->",element.toJSON())
    })
}
/**
 * ricordiamo che importero questi metodi che implementano dell query
 * dove ho l istanza di connessione
 * in cui ho definti le instanze delle tabelle a cui applicare le query
 * dove passeremo ai questi metodi i modelli da interrogare
 */
/**
 * TEORIA
 * i vincoli sono definiti a livello SQL qunado un vincolo fallisce è il database
 * o megliol handler del database che solleva l errore tale errore viene passato a sequelize
 * VALDAZIONI
 * Se la validazione fallisce la query nn verrà inviata al database
 * possiamo fornire 
 * 1 funzioni di validazione personalizzate
 * 2 reg expression
 * 3 usare validatori integrati in sequelize
 * 
 */
/**
 * 
 *per utilizzare i validatori integrati dobbiamo specicare la chiave sull attributo
 validate quindi per la colonna email 
 usaimo 
 validate:{
     isEmail:true
 }
 */
/**ANCHE SE PARAMETRIZIAMO I METODI LAVAORIAMO SOLO COL MODELLO USER */

const creaUser=async(model,nome,age,psw,mail)=>{
    /**
     * ritorniamo su getter e i setter
     * se definiamo dei setter poi quando andiamo in creazione bisogno sempre 
     * passare un valore per l attributo che ha il setter
     * altrimenti lavora su undefined e genera errore
     */
    /**QUESTO METODO ATTIVA LA VALIDAZIONE ATTRAVERSO LE REGOLE DEFINITE NELLA DEFINIZIONE NEL MODELLO
     * SUGLI OGGETTI COLONNA
     * MA PASSANDO AL SECONDO METODO RICORDIAMO CHE(commenti continuano su secondo metodo)
     */
    await sincronizza(model)
    const dati={
        username:nome,
        age:age,
        password:psw,
        email:mail
     }
     const resp=await model.create(dati)
     console.log("creato---> ",resp.toJSON())

}

const creaUser_secondo_metodo=async(model,nome,age,psw,mail)=>{
    /**
     *quindi ricordiaamo che utilizzato il metodo build e poi il save 
     accediamo prima all oggetto che sara inserito e poi effetivamente con save si inneschera la query
     possiamo controllare la validazione direttamente sull oggetto restituito dal metodo build
     prima di inescare la query direttamente come faceva il metodo create
     e quindi qualora ci fosse un errore eviteremmo la query
    */
    await sincronizza(model)
    const dati={
        username:nome,
        age:age,
        password:psw,
        email:mail
     }
     const resp=await model.build(dati)
     console.log("build--->",resp.toJSON())
     try{
      const val=await resp.validate()
      console.log("creato---> ",val)
      rendi_lista_risposta(err)
      
     }catch(err){
         const formatta=err.errors[0].message
       console.log("la mail nn valida    ",formatta)
     }

}

/**andiamo nel modello e sull attirbuto age creiamo un validatore personalizzato */



module.exports={creaUser,creaUser_secondo_metodo}