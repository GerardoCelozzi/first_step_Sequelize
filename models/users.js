
//const moduloDb= require('../../conn'); NN ESISTE ANCORA L ISTANZA DI CONNESSIONE SE DEVO SICRONIZZARE LA TABELLA

/**
 * 
 * QUI COSTRUISCO SOLO GLI OGGETTI CHE VANNO IN PASTO AL METODO DEFINE DELL ISTANZA DI CONNESSIONE (punto 1 metodo finale)
 * 
 */
 const {DataTypes } = require('sequelize');
const { cerca_e_conta } = require('../quering/finders');


 const oggetto_colonne_users={
/**id ci pensa sequelize */
  
    username: {
        type: DataTypes.STRING,
        // allowNull: false,
        // unique: true
    },
    password:{
        type: DataTypes.STRING,
   
    },age:{
        type: DataTypes.INTEGER,
        defaultValue: 21,
        /**se consetiamo valori nulli
         * solo i validatori integrati verrano saltati mentre quelli personalizzati no
         * quindi potremo gestire nel nostro validatore anche la condizione di null
         * quindi aggiungimaola sull attributo mail perche qui come si attiva la funzione troppo_giovane 
         */
        allowNull:true,
        validate:/**il nome della funzione sara la chiave che sequelize intercettera  */
        {
            sei_troppo_giovane(valore_inserito){
                if(valore_inserito<21){
                //lanciamo l eccezione
                    throw new Error('sei troppo giovane per esser inesrito')
                }
            },
            /**aggiungiamo un validatore integrato */
            isNumeric:{
                
                /**personalizziamo il messaggio  */
                /**se passiamo '10' funziona nn accetta una lettera quindi va in errore se 'fg20'
                 * se volevamo farlo attivare anche se passavamo solo '10'
                 * dovevamo impostare solo isNumeric:true senza l oggetto che personalizza il msg
                 *                     
                 *  */
                msg:'sveglia devi inserire un numero'
            }

        }   
    },
    sporter:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    /**add campo email  */
    email:{
        type:DataTypes.STRING,
        //unique:true ,//vincolo di unicità..vincolo di tupla
        allowNull:true,
        validate:{
            // isEmail:true,//validatore integrato sequelize
            // /**aggiungiamo un altro validatore di sequelizze */
            // isIn:[['jerry@google.com','jerry1@google.com']]
            /**personalizziamo il messaggio anche qui */
            isIn:{
                args:['jerry@google.com','jerry1@google.com'],
                msg:'mail non accettata'
            },
            
            intercettiamo_valori_null(valore_inserito){
                    if(!valore_inserito){//se arriva undefinend rendiamo vero l undefined e il null pero passa
                        //if (valore_inserito===null) intercetta null ma nn undefined
                    //lanciamo l eccezione
                        throw new Error('devi inserire una mail')
                    }
         },
        }
    }
}
//  const oggetto_opzioni_tabella1={
//     freezeTableName: true,//forziamo la pluralizzazione di sequelize
// }
 
const oggetto_opzioni_users={
    timestamps: true,
 /**POSSIAMO FARE CONVALIDE ANCHE A LIVELLO DI MODELLO DEFINENDOLE NEL TERZO OGGETTO 
  * OVVERO IN QUESTO QUELLO DELLE OPZIONI  LA LOGICA è LA STESSA MA ACCEDIAMO CON LA 
  * KEYWORD THIS ALLE PROPRIETA DA VALIDARE*/
 /**CREIAMO UNA VALIDAZIONE PERSONALIZZATA */  
    validate:{
        validazione_personalizzato_su_modello(){
            /**diciamo che utente e pasw devono essere diversi */
            if(this.username === this.password){
               
                throw new Error("devi inserire valori differenti tra utente e psw")
            }
            if(!this.password){
                throw new Error("devi inserire un valore non puoe essere undefinde")
            }
        }
    },
    paranoid:true,//setto timestamp a true e tengo traccia dell eliminazione
    /**
     * per forzare definitivamente l eleiminazione di una tabella paranoid bisgona passare
     * la prop force:true al metodo destroy come l esempio di sotto 
     * 
     *  const elimina=async(model,user_name)=>{
        return await model.destroy({
                                    where:{
                                            [Op.or]:[
                                                    {username:user_name},
                                                    {age:100}
                                                    ]
                                            },
                                            force:tru
                                    }
        )
    }
    tutti i record eliminati temporaneamente possono essere ripristinati e 
    a livello di database nella colonna deletedAt un record ripristano reimposta il vallore null
    infatti tutti quelli non elimanti hanno valore su null
    cmq il metodo e restore al posto di destroy

    const elimina=async(model,id_user)=>{
        return await model.restore({
                                    where:{
                                            id:id_user
                                            },
                                       
       tutti i record eliminati temporaneamente verrano ignorati dalle query di sequelize
       a meno che non siamo le raw query in sequelize     
       oppure ai metodi sequelize passaimo nelle opzione 
       la prop paranoid:false
       USer.findOne({paranoid:false})                                
     */
    updatedAt:false,//imposto a false cosi nn ho queste colonne
    createdAt:false,
    // hooks: {
    //     afterDestroy: function (instance, options) {
    //         console.log("dentro hook---------------> ",instance.name)
    //         console.log("tipo: ",typeof(instance))
    //         instance.getPosts().then(posts=> instance.removePosts(posts)); // Softdelete on product table
    //         console.log('after destroy: destroyed');
    //     }
    // }
}


 module.exports={oggetto_colonne_users,oggetto_opzioni_users}
// module.exports=oggetto_opzioni_gino;
// module.exports=name;



