const { Sequelize } = require('sequelize');//il modulo di ritorno è una funzione di costruzione (metodo costruttore di un oggetto)
                                                  //convezione lettara maiuscola

/**
 * importiamo le nostre personalizzazioni
 */
/**per tabella users lasciamo che id e nome tabella siano creati da sequelize */
const{oggetto_colonne_users,oggetto_opzioni_users}=require('./models/users')
const{oggetto_colonne_ang_users,oggetto_opzioni_ang_users}=require('./models/anagrafica_users')
const{oggetto_colonne_city,oggetto_opzioni_city}=require('./models/city')



const oggetto_opzioni={
  host: 'localhost',
  dialect: 'mysql' ,
  //logging: (...msg) => console.log(msg),
}


const oggetto_connesione_db = new Sequelize('sequelize_sync_intables', 'root', '', oggetto_opzioni);
const User = oggetto_connesione_db.define('user',oggetto_colonne_users,oggetto_opzioni_users)
const Ang_User=oggetto_connesione_db.define('anagrafica_users',oggetto_colonne_ang_users,oggetto_opzioni_ang_users)
const Citta=oggetto_connesione_db.define('city',oggetto_colonne_city,oggetto_opzioni_city)

/*sincroniziamo su ogni singola tabela */
// const ok=()=>{
//     //console.log('ok')
//     //tutto cio che faremo lo implementiamo dentro questa callback e sappiamo che lavoreremo sempre con il modello users aggironato visto 
//     //l utilizzo del metodo sync()
//  //1 aggiungiamo dati metodo build()
//     const dati={
//         username:'jerry',
//         password:'1234',
//         age:35,
//         sporter:false
//     }
//     const user=User.build(dati)
//il metodo build restituisce solo un oggetto quindi possiamo accederevi
 //   console.log(user.username,user.age)
//quindi il metodo non comunica direttamente col il db infatti non è neache asyncrono 
//è utile solo per costruire l ooggetto dei dati che vogliamo effetivamente salvare nel db
//il metodo save() è quello che prende l oggetto user ritornato dal metodo build()e salva i dati nel db

//quindi :
    //user.save()
//il metdo save ritorna una promessa perche asyncrono quindi dobbiamo gestirla
//quindi facciamola ritornare al blocco di gestione utilizzato per il sync 
//la facciamo risalire praticamente
//ma dobbiamo modificare il codice se vogliamo gestire la proimessa con il then che risale
//quindi commentiamo tutto
// return user.save()
    
// }

const scrivi=async ()=>{
    const dati_scorretti={
        /*
                quando chiamavo il metodo save con l oggetto avente i dati scorretti
                username:'jerry',
                password222:1234,//mentre per passwprd nn match con nome colonna giusta e nn avendo definito alcun personalizzazione
                               //mi mette null per quella colonna
                agde:39,  //avento in age valore di defualt gli assegna quello
                sporter:false
        */
            }
            //quindi molta attenzione con la mappatura e i metodi
            const dati_corretti={
                username:'jerry',
                         password:'1234',
                         age:40,
                         sporter:false
            }
    const obj=User.build(/*dati_scorretti*/dati_corretti)
    if(!obj.username)throw err//non mi andava in errore quindi condizione di undefinend che negata diventa vera e mi lancia l eccezione
            /**
             * mentre null è un oggetto come valore di assegnazione,
                undefined è un tipo e significa che a una variabile non è stato assegnato un valore
             */
 
    // console.log("obj--->",obj.username)
   /**
    * attraverso il metodo build possiamo accedere all oggetto dei dati che devono essree salvati
    * per manipolarlo prima che questo venga effettivamente scritto nel db
    */
    const data= await obj.save()
    return data
}

const ok=async ()=>{
    const resp= await scrivi()
    console.log("scritto e promessa gestita" ,resp)//risposta della priomise .save() con tutte le informazioni'
    console.log("risposta solo dati inseriti: ",resp.toJSON()) 
    return resp
}
const ko=()=>{
    console.log('ko')
}
const vuota=()=>{}


 User.sync({alter:true}).then(/*Ok*/vuota).catch(ko)

//  // se nn usavo callbak definte estranamente la catena delle promise veniva gestita cosi§:
//   User.sync({alter:true}).then(()=>{
//        const obj=User.build({username:'pippo'})
       
//        return obj.save()// il primo the rimane in attessa di questa priomise arrivata la risposta si attiva il secondo
//        }).then((data)=>{
//            console.log("data-->",data)
//           // gestione promessa del metodo save
//     }).catch(()=>{
//    //gestione errore unica nella cateena delle promise
//   })
 


/**qui gestiamo la catena delle promise tutto a scope interno */


Ang_User.sync({alter:true}).then(()=>{
    /**metodo CREATE() compila e salva direttamente nel db 
     * unisce il metodo build -->compilazione
     * con metodo save -->memorizzazione o meglio salvataggio nel db
     */
     const dati_ang_user={
        name:'mario',
        surname:'lilletti',
        tel:'3466372889',
        email:'nnn@hotmail.com'
    }
    // return  Ang_User.create(dati_ang_user)

    }).then((promise_metodo_create)=>{
        console.log("anagrafica :",promise_metodo_create.toJSON())
    })
    .catch(()=>{

})

/** MANIPOLAZIONE INTERNA 1
 * possiamo aggiornare i dati anche dopo averli inseriti */

Ang_User.sync({alter:true}).then(()=>{
    /**metodo CREATE() compila e salva direttamente nel db 
     * unisce il metodo build -->compilazione
     * con metodo save -->memorizzazione o meglio salvataggio nel db
     */
     const dati_ang_user={
        name:'michele',
        surname:'rossi',
        tel:'3466372889',
        email:'nnn@hotmail.com'
    }
        
     // return  Ang_User.create(dati_ang_user)

    }).then((promise_metodo_create)=>{

        console.log("primo inserimento dati: ",promise_metodo_create.toJSON())
        
        /**prendo l oggetto salvato */
        const dati_da_ggiornare_dopo_averli_salvati=promise_metodo_create
       
        /**modificahiamo i dati */
        dati_da_ggiornare_dopo_averli_salvati.email='mail_aggiornata@hotmai.com'
       
       
        /**invochiamo  save()  .datnuova promise */
        return dati_da_ggiornare_dopo_averli_salvati.save()
      
    }).then((dati_aggiornati)=>{
        console.log("dati aggiornati anagrafica-->",dati_aggiornati.toJSON())

    })
    .catch(()=>{

})


/**MANIPOLAZIONE INTERNA 2
 * 
 *  salvataggio oggetto
 *  recupero oggetto
 *  manipolazione oggetto
 *  annullamento azione di manipolazione per aggironamento con metodo RELOAD()
 *  gestione promise RELOAD() ritorna l oggetto scritto con il create,oggetto allo stato inziale 
 *  salvataggio 
 * */
 Ang_User.sync({alter:true}).then(()=>{
    
     const dati_ang_user={
        name:'gianni',
        surname:'rossi',
        tel:'3466372889',
        email:'stato_iniziale@hotmail.com'
    }
        
     // return  Ang_User.create(dati_ang_user)

    }).then((promise_metodo_create)=>{

        console.log("primo inserimento dati: ",promise_metodo_create.toJSON())
       
        /**prendo l oggetto salvato */
        const dati_da_ggiornare_dopo_averli_salvati=promise_metodo_create
       
        /**modificahiamo i dati (manipolazione interna) */
        dati_da_ggiornare_dopo_averli_salvati.email='mail_aggiornata@hotmai.com'
       console.log("dati manipolati internamente --->",dati_da_ggiornare_dopo_averli_salvati.toJSON())
       /**annullamneto manipolazione (add gestione promise)*/
        console.log("ANNULAMENTO AGGIORNAMENTO.....")
       return dati_da_ggiornare_dopo_averli_salvati.reload()
        /**invochiamo  save()  .datnuova promise */
        
      }).then((oggetto_primo_inserimento)=>{
        console.log('stato iniale: ',oggetto_primo_inserimento.toJSON())
        console.log("salvataggio.....")
        return oggetto_primo_inserimento.save()
      }).then((oggetto_stato_iniziale)=>{

        console.log("dati stato iniziale anagrafica-->",oggetto_stato_iniziale.toJSON())

    })
    .catch(()=>{

})


/*MANIPOLAZIONE INTERNA 3*/
/**
 * restrizione aggiornamento su sottinsieme di campi 
 * oggetto dati
 * create()
 * modifica oggetto create
 * salva solo sottoinsieme di dati modificati
 */
 Ang_User.sync({alter:true}).then(()=>{
    
     const dati_ang_user={
        name:'lucio',
        surname:'rossi',
        tel:'3466372889',
        email:'nnn@hotmail.com'
    }
        
     return  Ang_User.create(dati_ang_user)

    }).then((oggetto_from_promise_metodo_create)=>{

        console.log("primo inserimento dati: ",oggetto_from_promise_metodo_create.toJSON())
       
        /**prendo l oggetto salvato */
        const dati_da_ggiornare_dopo_averli_salvati=oggetto_from_promise_metodo_create
       
        /**modificahiamo i dati */
        dati_da_ggiornare_dopo_averli_salvati.name='pippo'
        dati_da_ggiornare_dopo_averli_salvati.email='mail_aggiornata@hotmai.com'
        dati_da_ggiornare_dopo_averli_salvati.tel='10000'
       
       console.log("dati aggiornati internamente",dati_da_ggiornare_dopo_averli_salvati.toJSON())
       console.log("manteniamo solo la modifica sul campo ---tel--- ")
        /**invochiamo  save()  .datnuova promise */
        const array_campi_da_aggiornare=['tel']
            const oggetto_sottoinsieme_campi_da_aggiornare={
                fields:array_campi_da_aggiornare
            }
        return dati_da_ggiornare_dopo_averli_salvati.save(oggetto_sottoinsieme_campi_da_aggiornare)
        /**OSSERVAZIONE IMPORTANTE
         * nella log vediamo che le modifiche vengono apportate a tutti i campi
         * perche il metodo save aggiorna internamente (lato applicativo) solo i campi che cambiano di valore
         * sull oggetto che gli passiamo 
         * quindi nell applicativo noi cambiamo tutti quei valori lui nella log va a prendere il riferimento 
         * all oggetto e vede tutti gli indirizzi delle prop che sono modificati per quel riferimento
         * e quindi ti  rende loggetto con tutti i valori delle prop  modifcate confondendo le idee 
         * pensando che alla fine questo metodo aggiorni tutti i campi
         * ma a livello di db invece memorizzerà solo i campi che passiamo come filtro nella prop fields dell 
         * oggetto qui chiamato "oggetto_sottoinsieme_campi_da_aggiornare"
         * QUINDI
         * se non modifichi nulla nell oggetto create e poi invochi il punto save alla fine 
         * questo non vedendo alcuna modifica non genererà alcuna query nel db e semplicemente sara il create a salvare i dati 
         * nel db
         * 
         * 
         */
       
      
    }).then((dati_aggiornati_parzialmente)=>{
        console.log("dati aggiornati anagrafica-->",dati_aggiornati_parzialmente.toJSON())

    })
    .catch(()=>{

})
/**METODO BULKCREATE()creaazione in blocco 
 * attenzione non opera in convalida dati qualora ci fossero dei vincoili di validazione definiti per una colonna della tabella
 * a meno che non passiamo un oggetto nell opzioni con prop validate impostate a true
 * validate:true 
  */
/**
 * CREAZIONE IN BLOCCO SENZA VALIDAZIONE
 */
const oggetto_citta1={
    nome:'torino',
    provincia:'to',
    regione:'piemonte',
    nazione:'italia',
    abitanti:100000
}
const oggetto_citta2={
    nome:'milano',
    provincia:'milano',
    regione:'lombardia',
    nazione:'italia',
    abitanti:200000
}
const citta3={
    nome:'roma',
    provincia:'ro',
    regione:'lazio',
    nazione:'italia',
    abitanti:4000000
}
const citta4={
    nome:'napoli',
    provincia:'na',
    regione:'campania',
    nazione:'italia',
    abitanti:2500000
}
const blocco_dati=[oggetto_citta1,oggetto_citta2]

    const gestione_errori=()=>{
        console.log("hai generato un errore")
    }
    const primo_livello_success=async ()=>{
        console.log("stiamo inserindo un blocco di dati ....")
       // return await Citta.bulkCreate(blocco_dati)

    }
    const secondo_livello_success=async (data)=>{
        /**utilizziamo il metodo increment  */
       
        data.forEach(element=>{
           console.log(element.toJSON())//il toJson nn si applica a una lista ma a ogni lemento della lista
        })
       
        

    }
  
    // Citta.sync({alter:true}).then(primo_livello_success)
    //     .then(secondo_livello_success)
    // .catch(gestione_errori)


/**CREAZIONE IN BLOCCO PASSANDO AL METODO BULKCREATE UN OGGETTO OPZIONI CHE CONVALIDA ANCHE I DATI */
const blocco_dati22=[citta3,citta4]

    const gestione_errori2=(err)=>{
        console.log("hai generato un errore",err)
        /**
         * se solo uno dei dati non passa la validazione tutto il blocco viene considerato non buono
         * e non viene memorizzato niente
         */
    }
    const primo_livello_success2=async ()=>{
        const oggetto_opzioni_validazione={validate:true}
        console.log("stiamo inserindo un blocco di dati ....",citta3,citta4)
        console.log("acettaiamo province di 2 carratteri quindi ",citta4," nn supererà il test...")
        return await Citta.bulkCreate(blocco_dati22,oggetto_opzioni_validazione)

    }

    /**in funzione secondo_livello_success viene invocata */
    const tutte_le_asyncronicita_nel_map=async(list)=>{
       lista_prop_colonne_da_incrementare={abitanti:500}//potevamo riferire ad altre colonne con altri valori
                                                        /*ex: {
                                                                abitanti:500,
                                                                scadenza_mandato_sindaco:2 -->tra 2 anni
                                                            }*/
        const incrementa_ogni_elemento_con_processo_asincrono=list.map(async (item)=>{
             const resp_after_query=await item.increment(lista_prop_colonne_da_incrementare)
            console.log("dopo che incremento elemento ",resp_after_query.toJSON())
            console.log("il metodo scrive solo nel db senza ritornare il dato aggiornato ")
             return resp_after_query 
        })
        const resolved=await Promise.all(incrementa_ogni_elemento_con_processo_asincrono)//aspetta tutte le promise
        return resolved
    }
        
    
    const secondo_livello_success2=async (data)=>{
        console.log("blocco memorizzato\n elementi :")
        data.forEach(element=>{
           console.log(element.toJSON())//il toJson nn si applica a una lista ma a ogni lemento della lista
        })
        console.log("incrementiamo di 500 unita gli abitanti")
        const resp= await tutte_le_asyncronicita_nel_map(data)
        resp.forEach((incrementi)=>{
            console.log("incrememnto: ",incrementi.toJSON())
            /**
             * increment esegue direttamente la query nel db non mappa la tupla inserita quindi nelle logh
             * non vediamo il dato aggiornato 
             */
            console.log("dopo creazione distruggo",incrementi.destroy())
            console.log("ultimi id non presenti nel database")
        })
    }

    Citta.sync({alter:true}).then(primo_livello_success2)
        .then(secondo_livello_success2)
    .catch(gestione_errori2)

    /**
     * non riportati il metdo increment e decrement e destroy
     */
module.exports =oggetto_connesione_db