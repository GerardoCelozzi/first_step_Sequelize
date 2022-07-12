const { Sequelize } = require('sequelize');
const{oggetto_colonne_users,oggetto_opzioni_users}=require('./models/users')
const{oggetto_colonne_ang_users,oggetto_opzioni_ang_users}=require('./models/anagrafica_users')
const{oggetto_colonne_city,oggetto_opzioni_city}=require('./models/city')
/**importo gli oggetti che vanno in ingresso al metodo define per creare la mappatura della tabella */
const{oggetto_colonne_categorie,oggetto_opzioni_categorie}=require('./models/categorie')

const alter={alter:true}
const sincronizza=async(model)=>{
    return await model.sync(alter)
}


/**importazioni moduli di test metodi sequelize */
const {
        tutta_la_lista,
        tutta_la_lista_sottoinsieme_colonne,
        alias_at_colonna,
        tutta_la_lista_tranne,
        where_clausola
    }=require('./quering/findAll')
const {
      aggregazione_pass_params_when_invoche,
      aggregazione2,
      odrina_result}
    =require('./quering/aggregazioni_funzioni_sql_sui_dati')

const {no_group_by}=require('./quering/GroupBy')

const {
        where_clausola_operatore_or,
        where_applica_di_defualt_operatore_and,
        get_grandi_Citta,
        confronti_logici_su_un_Attributo//confronti logici nidificati
      }=require('./quering/Operatori')

const {
        aggiorna_sottoinsieme_attributi__con_condizione_su_essi,
        aggiornamento_secondo,
        elimina,
        trova_il_massimo_valore_su_attributo,
        somma_eta_utenti,
        somma_con_where
      }=require('./quering/update_destroy_utility')

const {
        formatta_la_risposta_impostando_la_prop_raw,
        cerca_o_crea,
        cerca_e_conta,
        cerca_or_crea_in_Categorie
      }=require('./quering/finders')


const{
  leggi_il_primo_casino_nel_get,leggi_il_primo_con_get_puro
    }=require('./quering/getter') 
    
const{
      creaUser,
      creaUser_secondo_metodo
    }=require('./quering/test_vincoli_e_validazioni_tabella_su_User')


      
const oggetto_opzioni={
    host: 'localhost',
    dialect: 'mysql' ,
    //logging: (...msg) => console.log(msg),
  }

  
  const oggetto_connesione_db = new Sequelize('sequelize_sync_intables', 'root', '', oggetto_opzioni);
 // console.log("XXX-->",oggetto_connesione_db)
  const User = oggetto_connesione_db.define('user',oggetto_colonne_users,oggetto_opzioni_users)
  const Ang_User=oggetto_connesione_db.define('anagrafica_users',oggetto_colonne_ang_users,oggetto_opzioni_ang_users)
  const Citta=oggetto_connesione_db.define('city',oggetto_colonne_city,oggetto_opzioni_city)

 // sincronizza(Citta)




  /******************* */
  //utlima tabella mappata
  const Categorie=oggetto_connesione_db.define('categorie',oggetto_colonne_categorie,oggetto_opzioni_categorie)
  //creiamola nel db
 //Categorie.sync({alter:true}) dopo la creazione commettiamo la syncronizzazione che useremo solo nei metodi di query
  /***************** */


 
  const rendi_lista_risposta=(risp)=>{
    risp.forEach(element => {
      console.log("*** ->",element.toJSON())})
    }
    /**liste ,filtro lista ,alias */

    //tutta_la_lista(User)
    //tutta_la_lista(Ang_User)
    //tutta_la_lista_sottoinsieme_colonne(User)
   // tutta_la_lista_tranne(User,['password','username'])
    //alias_at_colonna(User)

    /**aggregazioni */
  
  //aggregazione_pass_params_when_invoche(oggetto_connesione_db,User,'age','SUM','eta')
  //aggregazione2(Citta,oggetto_connesione_db)

  /**where con clausola piu valorizzazione di limit  */
  const select=async()=>{
    const clausole_in_AND={
      age:21,
      username:'jerry'
    }
      const num_row_in_resp=2
    const resp=await where_clausola(User,['username','age'],clausole_in_AND,num_row_in_resp)
       resp.forEach(element => {
       console.log("*** ->",element.toJSON())
    });
  }
 // select()//invochiamo la funzione :)


  /**ORDINAMENTO RISULTATI  mettiamo sempre limit */
    const risultato_ordinato=async()=>{
      const ordina_su=['abitanti','DESC']
      const limit=2
    
      const resp=await odrina_result(Citta,ordina_su,limit)
      resp.forEach(item=>{
        console.log(item.toJSON())
      }) 
    }
    //risultato_ordinato()

    /**TEST COMPRESIONE MODELLAZIONE QUERY DI GROUP BY
     * nel risultato dovremmo avere tutte le tuple 
     * con valore del operazione della funzione di aggregazione definito nell alias che si ripete per ogni tupla
     * quel valore è il risultatto calcolato su tutti i valori della colonna su cui agisce la funzione
     * quindi dato incoerente
     */
    const dati_groupby_incoerenti=async()=>{
      //model,instanza_conn,array_Attributi,operazione,colonna,alias,limit
      const resp=await no_group_by(Citta,oggetto_connesione_db,['nome'],'SUM','abitanti','scimuniti') 
      resp.forEach(item=>{
        console.log(item.toJSON())
      })
    }
   // dati_groupby_incoerenti()

    const dati_groupby_COERENTI=async()=>{
      //model,instanza_conn,array_Attributi,operazione,colonna,alias,colonna_raggrupamento,limit,
      const resp=await no_group_by(Citta,oggetto_connesione_db,['nome'],'SUM','abitanti','scimuniti','nome') 
      resp.forEach(item=>{
        console.log(item.toJSON())
      })
    }
    //dati_groupby_COERENTI() tutto fila


    /**Operatori OR */
    const filra_in_OR=async()=>{
      const oggeto_valori_filtraggio={
        username:'jerry',
        age:40
      }
    
      const resp=await where_clausola_operatore_or(User,'or',oggeto_valori_filtraggio)
      resp.forEach(item=>{
        console.log(item.toJSON())
      })

    }
    //filra_in_OR()
    /**il filtraggio in and e di default se specifichiamo una lista di attributi nell oggetto_valori_filtraggio */
    const filra_in_AND_specificando_operatore=async()=>{
      const oggeto_valori_filtraggio={
        username:'jerry',
        age:40
      }
    
      const resp=await where_clausola_operatore_or(User,'and',oggeto_valori_filtraggio)
      resp.forEach(item=>{
        console.log(item.toJSON())
      })
    
    }
   // filra_in_AND_specificando_operatore()//CHIAMATA
    
     
    const and_di_default_con_oggetto_attributi_confronto=async()=>{
       /**qui nn specifichiamo l operatore ma mandiamo lo stesso oggetto con la stessa lista di attributi nelle chiavi e nei valori
       * quindi quando abbiamo un AND nn ce bisogno di disturbare l oggetto Op
       */
      const oggeto_valori_filtraggio={
        username:'jerry',
        age:40
      }
      const resp=await where_applica_di_defualt_operatore_and(User,oggeto_valori_filtraggio)
      resp.forEach(item=>{
        console.log(item.toJSON())
      })
      console.log("\n***********\n")
    }
   // and_di_default_con_oggetto_attributi_confronto()//CHIAMATA

    /**agigiamo sul dominio dei singoli attributi con condizione di maggiore */
    const get_big_citys=async()=>{
      const resp=await get_grandi_Citta(Citta,oggetto_connesione_db,5)
      rendi_lista_risposta(resp)
    }
    //get_big_citys() //CHUIAMATA



    /**OPERATORI NIDIFICATI PER CONFRONTI LOGICI  */

    const piu_condizioni_logiche_su_attributo_age_di_user=async()=>{
      const resp=await  confronti_logici_su_un_Attributo(User)
      rendi_lista_risposta(resp)
    
    }
      
   // piu_condizioni_logiche_su_attributo_age_di_user() //CHIMATA


/**                 UPDATE      ****
  *  su sottoinsieme di attributi che verificano una data condizione */

/**
 * aggiornaiamo in user chi si chiama jerry e ha uguale a zero e gli diamo 100 anni
 */

    const aggiorna_nascituro=async()=>{
      const resp=await aggiorna_sottoinsieme_attributi__con_condizione_su_essi(User,'username','jerry',0)
      console.log(resp)
    }
  //  aggiorna_nascituro() CHIAMATA

/**query di aggiornameto in or un livello di nidificazione in piu */

    const query_update_con_or=async()=>{
        const resp=await aggiornamento_secondo(User)
        console.log("righe interessate all aggiornamento numero: ",resp)
    }
  //  query_update_con_or() CHIAMATA


  /**DESTROY */

   const elimina_2_truple=async ()=>{
     const resp=await elimina(User)
     console.log("eliminazione-->",resp)
   }

  // elimina_2_truple() CHIAMATA

  //test paranoid
  const elimina_paranoid=async ()=>{
    const resp=await elimina(User,'2222ww')
    console.log("eliminazione-->",resp)
  }
  elimina_paranoid()
/**METODI DI UTILITA  */

//trova_il_massimo_valore_su_attributo(User)//model.max()
//somma_eta_utenti(User)//model.sum()
//somma_con_where(User)//model.sum(attr,{where:{attr:valor}})



/**METODI FINDERS NEL DETTAGGLIO */

//formatta_la_risposta_impostando_la_prop_raw(User)

//cerca_o_crea(User)//findOrCreate
 //cerca_e_conta(User)


/**metodi GETTER */ 

//leggi_il_primo_casino_nel_get(Categorie)
//leggi_il_primo_con_get_puro(Categorie)

/**SETTER */
const racconto='questa è una descrizione e potrebbe essere molto lungo quindi usiamo zlib per comprimere e usiamo il findORCreate'
const psw='1111'
const chiaveRicerca='nome'
//cerca_or_crea_in_Categorie(Categorie,chiaveRicerca,'luloup',psw,racconto) ///---->con questo metodo implemento un controllo automatico purche
//stia attento a inserire asyncronicità nella sua definizione altrimenti il setter nn si attiva 

/**usare il Create senza controllo è piu utile solo nel caso in cui devo accedere subito ai valori inseriri nel db
 * come si vede nelle log di seguito
 * e il metodo sempre sincrono
 */


const crea_categoria=(nome,passw)=>{
const dat_cat={
  nome:nome,
 psw:passw,
 descrizione:'questa è una descrizione e potrebbe essere molto lungo quindi usiamo zlib per comprimere'
}
Categorie.create(dat_cat).then((data)=>{
  console.log("nome arcobaleno : ",data.nome)//qui mi si attiva anche il getter che ho impostato con valore di ritorno sulla colonna 
                                            //peso,appositiamente in maniera errata per agire successivamente nelle query di lettura
                                            //con l opzione di pulizia raw:true che cmq pesca il valore della colonna in cui il get 
                                            //è definito a prescindere dalle instruzione scorrette che io ho appositamente inserito
                                            //ma che in questo casso non potendo utilizzare il raw:true che mi genera un asincornicità 
                                            //per il setter il valore di ritorno in questa log è il valore che è nella colonna peso
       console.log("psw: ",data.psw)
      console.log("descrizione: ",data.descrizione)
})
}

//crea_categoria('melo','ciccio')




//    const dat_cat2={
//       nome:'catg6634',
//      psw:'1111 sincrono'
//   }
//     Categorie.create(dat_cat2)//funziona
//     //Categorie.create(dat_cat2,{raw:true})//non funziona sintazzi sbagliata credo
//     

//   .then((promise_metodo_create)=>{
//       const data=promise_metodo_create
//       console.log("nome : ",data.nome)
//       console.log("psw: ",data.psw)

//   })
//   .catch(()=>{

// })


/**SEZIONE VINCOLI e VALIDAZIONI */
//  creaUser(User,'pippo',22,'skjso','jerry@google.com')//qui se inseriamo un eta <21 genera un errore personalizzato con una nostra funz
                                                        //abbiamo inserito anche isIn[[array dei valori accettati]] e abbiamo messo solo
                                                        //lòa mail che passiamo come valore accettato 
                                                        //aggiungiamo altri elementi fra i valori accettati se no mi da l errore di duplicazione
  //creaUser_secondo_metodo(User,'concetta',25,'2222','htomail.com')

  module.exports =oggetto_connesione_db