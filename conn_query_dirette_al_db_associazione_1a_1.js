const { Sequelize, DataTypes } = require('sequelize')


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
  const alter={alter:true}
  const sincronizza_lista_tabelle_asyncrono=async(list)=>{
  //  return await model.sync(alter)
  const unresolved  = list.map( async item=>{
    const g= await await item.sync(alter)
       return item 
     })
 const resolved=await Promise.all(unresolved)
     return(resolved)
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


  // getSchemaDatabase(connessione).then(data=>{
  //     console.log("schema: ",data)
  // })
  const query_diretta_nessuna_mappatura_della_azione_in_node=async ()=>{
    const resp=await query_diretta_1(Citta,connessione)
    rendi_lista_risposta(resp)
  }
  //query_diretta_nessuna_mappatura_della_azione_in_node()

  /*******************ASSOCIAZIONI ****************************** */
  /**
   * (DEFINIAMO QUI NUOVE TABELE X BREVITA')
   */

  const Nazione=connessione.define('nation',
      {
        nome_nazione:{
          type:DataTypes.STRING,
          unique:true
        }
      },
      {
        timestamps:false
      })
  const Capitale=connessione.define('capitol',
  {
    nome_capitale:{
      type:DataTypes.STRING,
      unique:true
    }
  }, {
    timestamps:false
  })
  /**associazione 1:1 */
  //ogni nazione puo avere una sola capitale e vicevers
  //parent=Nazione 
  //child=Capitale ha una colonna di FK con nationId ...è la capitale che punta ad una nazione nn esiste capitale se nn esite nazione
  // ---->parent.hasOne(child)<----
  Nazione.hasOne(Capitale)//qui dobbiamo sincronizzzare l instanza di connessione quindi a seguire
  /**non sbagliaree
   * nel db abbiamo la chiave esterna in capitols
   * perche in effetti e capitols essendo figlia e lei che  referenzia il parent nazione ovvero
   * gli id in nations vengono puntati dll attributo  nationId definito in capitols 
   */
 // connessione.sync({alter:true})//aggiornera il db con questo vincolo di chiave

  /**
   * --------->hasOne(tabellaFigla,oggetto_opzioni)<-----------------
   * personalizziamo il nome della colonna di fk
   * Nazione.hasOne(Capitale,{foreingKey:'lamiaNazione'})
   */

  /**Popoliamo in blocco le tabelle */
 // Nazione.bulkCreate([{nome_nazione:'italia'},{nome_nazione:'spagna'},{nome_nazione:'francia'},{nome_nazione:'germania'}])
 // Capitale.bulkCreate([{nome_capitale:'roma'},{nome_capitale:'madrid'},{nome_capitale:'parigi'},{nome_capitale:'berlino'}])
  /**a questo punto abbiamo solo popolato le tabella ma non abbiamo instaurato nessuna relazione  in capitols*/
  /**
   * definendo solo hasOne sul modello di orgine tutti i metodi di utilità che sequelize ci fornisce
   * per creare le associazione tra le due tabelle vengono resi solo per quel modello 
   * di seguito mostriamo tutti le possibilità di creare le associazioni fino a quando 
   *  giungieremo a un metodo che ci darà errore perche manca l implementazione del metodo che 
   * definisce anche l apparteneza della tabella child alla tabella parent
   * fino a qui sequelize sa solo che esiste una chiave esterna NationId nella tabella Capitols
   * questo vuole dire che 
   * possiamo invocare i metodi di utilità solo dalla Tabella Nation per scrivere relazioni e non viceversa
   * del tipo che facciamo :
   * prendi nazione dove NAZIONE=francia.then(instanzaTupla=>{
   *                                                prendi capitale=parigi.then(
   *                                                          instanza_capitale.setNazione(instanzaTuplaNAZIONE))}) 
   * il metodo setNazione non esiste sulle tuple che prendiamo dalla tabella Capitols fin ora 
   * quindi i metodi di supoorto che scriveremo noi per creare associazioni che al suo intenro
   * utilizzeranno i metodi di utilità di sequelize avraanno un corpo diverso
   * in funzione del tipo di query che anch essa si modellerà in fuznione da quale modello 
   * partiamo a interrogare 
   *  quindi la query che crea la associazione dipende dal tipo della prima instanza che recuperiamo
   * 
   */
  /**CREAZIONE ASSOCIAZIONI
   * AVENDO SOLO DEFINTO L hasone tutte le query devono lavorare su instanze di nation perche solo queste
   * hanno a disposione i metodi di utilita
   * 
   *  METODO 1
   * selezioniamo una capitale
   *  istanza di capitale passata al gestore della promessa dove 
   * selezioniamo la relativa nazione
   * a instanza di nazione setNazione(instanza di capitale)<----(su instanza nation applichiamo metodo di utilita)
   */

    const seleziona_Capitale_seleziona_Nazione_relativa_e_nazione_setCHIAVE_Esterna=async(citta,paese)=>{
     try{
        const capitale=await Capitale.findOne({where:{nome_capitale:citta}})
      
        const nazione= await Nazione.findOne({where:{nome_nazione:paese}})
  
        nazione.setCapitol(capitale).then(resp=>{
        /** metodi di utilita  set,get ,create ...nome della tabella usata con lettera maiuscola
         * istanza del modello  si chiama capitol quindi setCapitol non setCapitale per il modello di origine  
         *  quindi su un instanza di tipo Nazione ho i setter che riferiscono al nome tabella figlia Capitol 
         */
        try{
        console.log(resp.toJSON())
         /**se il voncolo è gia impostato non alza un eccezione ma bensi ritorna null
         * quindi mi va in errore su null.toJSON() che viene intercettato dal try piu esterno 
         * in ogni modo console.log(resp?.toJSON()) mi faceva evitare il try catch sulla funzione di log
         */
        }catch(err){
          console.log("test",err)
        }
      })
      }catch(err){
       
        console.log('dati non presenti ...stai aggiornando non creando')
      }
    }
    /**
     * quindi con la dichiarazione hasOne sequelize vede il vincolo 
     * vede chi è il modello di orginine
     * rende solo per il modello di orgine i metodi di utilità setCapitol,getCapitol,createCapitol
     * in eusta condizione ovvero che i dati sono gia insierito siamo sul set
     * ovvero su gli aggiornamenti
     * quindi il metodoè implementato dopo  su relazioni che noi conosciamo
     * ovvero diventa determinisco perche sappiamo quali input passargli 
     */
   
/********************************************* */  
    //metodi di aggiornamentoe se passo valori che non sono presenti nel db va in errore
    //seleziona_Capitale_seleziona_Nazione_relativa_e_nazione_setCHIAVE_Esterna(/** */)
/******************************************** */



  //GETTER 
  //ora una volta collegate le due tabelle col metodi di sopra usiamo il getCapitol
  //tenmendo presente il modello di orgine
    const mostra_Nazione_capitale=async(paese)=>{
      //prima filtriamo su child
      //const capitale=await Capitale.findOne({where:{nome_capitale:citta}})!!!nn seerve
      //filtriamo su nazione
       const nazione= await Nazione.findOne({where:{nome_nazione:paese}})
      // //su modello orgine metodo ausiliaro getCapitol
     /**
      * !!!!!!!!!!
      * errore perche nazione gia conosce per quale citta è chiave esterna non bisogna
      * passargli nessuna instanza della capitale 
      * !!!!!!!!!
       console.log("info--->",await nazione.getCapitol(capitale))
    */
      const info=await nazione.getCapitol()
      console.log(info.toJSON())//{ id: 4, nome_capitale: 'berlino', nationId: 4 }
      }
/*************************** */
// mostra_Nazione_capitale('germania')
/*************************** */


/**METDO DI CREAZIONE ATTRAVERSO MODELLO DI ORGINIE */

      const crea_relazione_Nazione_capitale=async(paese,citta)=>{
        //prendiamo l instanza del modello nazione
        const nazione=await Nazione.create({nome_nazione:paese})
       const associazione=await  nazione.createCapitol({nome_capitale:citta})
       console.log(associazione)

      }
     // crea_relazione_Nazione_capitale('usa','waschigton')

  Capitale.belongsTo(Nazione)
/**METEDO DI AGGIORNAMENTO DA CAPITALE A NAZIONE
 * ovvero vogliamo che sia l instanza di capitale e utilizzare un metodo di utilita setNations ricevendo un instanza di nazione
 * la tebella Capitale che è quella figlia o quella di destinazione che dir si voglia
 * per poter valorizzare la propria chiave esterna che è NationID deve dichiarare a chi appartiene
 * ,chi referenzia
 * quindi riassumendo 
 * orgine.hasOne(destinazione) origine conosce chi la referenzia
 * destinazione.belongsTo(origine) destinazione definisce chi referenzia
 * quindi implementato il belongsTo
 * il metodo puo:
 * 1 prendi instanza nazione
 * 2prendi instanza capitale
 * capitale.setNazione(nazione) memorizza l id della nazione della tabella che punta
 * 
 */
      const relazione_Pargi_Francia=async()=>{
        const capitale=await Capitale.findOne({
          where:{nome_capitale:'roma'}
        })
        const nazione=await Nazione.findOne({
          where:{
            nome_nazione:'italia'
          }
        })
        const relazione=await capitale.setNation(nazione)
        console.log(relazione.toJSON())//{ id: 1, nome_capitale: 'roma', nationId: 1 } vabe abbiamo usato roma 

      }
      relazione_Pargi_Francia()

/**POSSIAMO SEMPRE PASSARE UN OGGETTO DI OPZIONI NELL HASONE  o SUL BELONGSTO DOVE POSSIAMO CAMBIARE IL NOME DELLE FOREIGKEY 
 * E DEFINIRLO DIRETTAMENTE NELL OGGETTO COME QUNADO PERSONALIZZIAMO UN MODELLO AD ESEMPIO
 * Nazione.hasOne(Capitale,{foreinkey:{
 *                                    type:Datatype.INTEGER,
 *                                    name:'pippo'}
 *                          })
 */

/**NELL OOGGETTO DELLE OPZIONI PUO ESSERE IMPORTANTE PASSARE DLLE OPZIONE CHE RIFERISCONO AL COMPORTAMENTE
 * CHE SEQUELIZE DEVE AVERE SUL DB QUANDO ANDIAMO IN ELIMINAZIONE O AGGIORNAMENTO DI UNA TABELLA CHE NEIO SUOI 
 * RECORD DELLE RELAZIONI
 * metodo_di_relazione(Tabella,{
 *                          onDelete:'CASCADE' se eliminaimo un recordo in una tabella viene eliminata anche l elemento con cui ha la relazione
 *                           })
 */

  /** OSSERVAZIONE DI UN LIMITE STRUMENTALE DI SQUELIZE
   * ABBIAMO DUE FUNZIONE CHE DEFISCONO TIPI DI RELAZIONE TRA DUE MODELLI
   * LE USIAMO ENTRAMBE PERCHE POTREMMO AVERE NECESSITA DI MEMORIZZARE DATI DA ENTRMABE LE DIREZIONI
   * MODELLO PADRE VERSO FIGLIO
   * O MODELLO FIGLIO VERSO PADRE
   * LA FUNZIONE BELONGSTTO CHE PERMETTE AL FIGLIO DI MEMORIZZARE GLI DI DEL PADRE NELLA COLONNA DELLE CHIAVI ESTERNE
   * OPERA SU DUE TIPI DI RELAZIONI
   * UNO A UNO E UNO A MOLTI
   *ESITE UNA INCOERENZA DI MEMORIZZAZIONE DI DATI QUANDO ABBIAMO UNA RELAZIONE UNO A UNO
   PERCHE 
   PADRE ATTRAVERSO I METODI DI UTILITA PUO SOVRASCIRVERE   IL PROPRIO ID CON UNA FUNZIONE DI SET
   E ASSOCIARALO IN MANIERA ERRATA SU UN ALTRA TUPLA DELLA TABELLA FIGLIA ANCHE SE MAGARI IL PROPIO ID ERA GIA PRESENTE
   E SPOSTARE  IL PRIPRIO ID SU UN ALTRA TUPLA NELLA COLONNA DELLE CHIAVI ESTERNE LASCIANDO A NULL LA TUPLA CHE 
   AVEVA QUELL ID PRIMA DELLA SOVRASCRITTURA
   ESEMPIO DI CONTESTO
   abbiamo parigi che nationID=2
   allora possiamo invocare questa funzione che fa
   ()=>{
        const capitale=await Capitale.findOne({where:{nome_capitale:londra}})

        const nazione= await Nazione.findOne({where:{nome_nazione:francia}})
  
        nazione.setCapitol(capitale).then(resp=>{
        
          nazione ha sovrascitto in capitale creando nella tabella capitali
        tale situazione
        
          che londra---->con nationID=2
          e in parigi --->abbriamo natioonID=null 
        }
        CONCLUDENDO IN QUESTO CASO AVVEINE CIO :
        PER I METODI USATI CON LA TABELLA DI  ORGINE SEQUELIZE 
        SA CHE UNA TUPLA DELLA TABELLA ORIGNIE E' CHIAVE ESTERNA IN TABELLA DI DESTINAZIONE 
        QUINDI SE NN FACCIAMO NOI UN CONTROLLO NELLA FUNZIONE DI AGGIORNAMENTO
        PERMETTE LA SCRITTURA MA IN AUTOMATICO CONCENDE SEMPRE E SOLO UN UNICO VALORE PRESENTE NELLA COLONNA DELLE FK
        DEGLI ID DELLA TABELLA PADRE
        E SENZA CONTROLLO POTREMMO INSERIRE INFROMAZIONE INCOERENTE NEL DB


        ORA VEDIAMO IN CONTRAPPOSIZIONE QUELLO CHE SUCCEDE SEMPRE NELLO STESSO TIPO DI RELAZION 1 A 1
        QUANDO UTILIZZIAMO INVECE I METODI DI UTILITA CON LA TABELLA FIGLIA
        ASSUMIAMO CHE IL CODICE SOPRA ABBIA PRODOTTO QUESTO STATO NEL DB
         londra---->con nationID=2
         parigi --->con natioonID=null 
          dove nationID=2 corrisponde a FRANCIA --->abbiamo gia una situazione di dati incoerenti   
        AGGIORNIAMO LE CHIAVI ESTERNI IN CAPITALI CON L ISTANZE DI CAPITALI USIAMO I METODI DI UTILITA CONCESSI
        ALLA TABELLA FIGLIA  DAL BELONGSTO:

         const capitale=await Capitale.findOne({where:{nome_capitale:pargi}})

        const nazione= await Nazione.findOne({where:{nome_nazione:francia}})
  
        capitale.setNation(nazione).then(resp=>{
          IN QUESTO CASO PER SEQUELIZE IL BELOGSTO AMMETTE ANCHE LE RELAZIONE 1 A MOLTI E QUINDI NON BLOCCA LA
          SCRITTURA DI UN ID GIA PRESENTE SULLA TABELLA FIGLIA COME CHIAVE ESTERNA 
        
          E QUINDI NELLA TABELLA CAPITALE (FILGIA ) AVREMMO LA DUPLICAZIONE DEGLI ID DI NAZIONE
        
          che londra---->con nationID=2
          e in parigi --->abbriamo natioonID=2 

          QUINDI INFINE
          !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          FARE MOLTA ATTENZIONE QUANDO ANDREMO A IMPLEMENTARE METODI DI AGGIORNAMENTO NEL CASO DI RELAZIONI
          UNO A UNO
          !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }

 * 
 */
  //sincronizza_lista_tabelle_asyncrono([Nazione,Capitale]) sincronizzando il db posso fare a meno 

  module.exports=connessione