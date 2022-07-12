


const {DataTypes } = require('sequelize');
const criptare=require('bcrypt')
//const Buffer = require('buffer').Buffer;
const zlib = require('zlib');

const { get } = require('express/lib/response');
/**
 * dentro questa tabella definiremo 
 * GETTER E SETTER
 * qualsiasi personalizzazione di questi metodi 
 * va implementata nei relativi oggetti che riferiscono ai campi di una tabella a cui siamo interessati
 * 
 */

 const oggetto_colonne_categorie={
/**id ci pensa sequelize */
  
    nome: {
        type: DataTypes.STRING,
      /**vogliamo che il valore che esite nel db sia ritornato al front end in maiuscolo */
     // Questo getter, proprio come un getter JavaScript standard, viene chiamato automaticamente quando viene letto il valore del campo
    
     /** 
      * GETTER JAVASCRIPT
      * const obj = {
                    log: ['a', 'b', 'c'],
                    get latest() {
                        return this.log[this.log.length - 1];
                    }
                    };

                    console.log(obj.latest);
                    // expected output: "c"
      * LA KEYWORD GET IN OBJ crea una funzione che agisce sulle prop di OBJ
         e tale funzione diventa una prop di obj e quando tramite la notazione punto
         accediamo alla chiave che la riferisce il  valore ritornatoci  è il risultato quindi di una computazione
         su un altra prop di obj
        e in js deve per forza seguire un etichetta dopo la keyword get altrimenti se avessimo
        const obj = {
                    log: ['a', 'b', 'c'],
                    get () {
                        return this.log[this.log.length - 1];
                    }
                    };
                console.log(obj.get);
                //stampa la funzione ovvero il get risulta essere il riferimento alla funzione
                prende l indirzzo di memoria che contien come valore la funzione 
                come quando usiamo le callback che passiamo il nome della callback in ingresso alla funzione che
                contenitore poi la esguira
                per intenderci:

                const nome.calback=(data_promise)=>{
                    ...fai qualcosa  comn data promise 
                }
                 obj.metodo.then(nome_callback).catch(nome.callback)
                 e se facciamo 
                 console.log(nome_callback)//stamperebbe (data_primise)=>{...fai qualcosa comn data promise}
                che l
         js vs sequelize 
         mentre in sequelize NO NESSUNA ETICHETTA DOPO LA KEYWORD GET perke se usiamo la keyword get per un attributo
          avviene che 
          facciamo la query
          ritorna l istanza della query
            facciamo conto che è una tupla che chiamiamo data
            quando facciamo data.username e se username ha un get il valore di ritorno
            sara l eleaborazione fatta dal get sul attributo in cui è stato implementato 

         in automatico verrà invocata la eleaborazione del dato 
         
      */
      get (){
          /**quindi posso agire solo su username in questo caso */
          /*ricordando che sequelize crea un instanza della query nell heap
          per recuperare il valore della prop username di questo oggetto non posso fare this.username
          perhce genererebbe un ciclo infinito il perche bisgnerebbe vedere come sono le classi di inflection
          in alternativa per reucperare il dato che ritorna dal db abbiamo un getter da invocare sull instanza che ritorna 
          ovverro:
          const rawValue = this.getDataValue('username');
          quindi "getDataValue"
          ma se gli devo passare il rifwerimento al nome della colonna
          a sto punto posso cambiare riferimento e ritornare un altro dato di un altra colonna al forntend
          pero questo avverebbe lato applicativo nel db i dati saranno sempre salvati coerentewmente

           */
          /**testiamo l accorgimento */
          let rawValue = this.getDataValue('peso');
         //return rawValue ? rawValue.toUpperCase() : null;
         //IN EFFETTI è COME PENSAVO A STO PUNTO POSSO MODELLARE I DATI COME VOGLIO ANCHE
        // let rawWalue=this.getDataValue('nome')
        /**
         * se pero passo al metodo raw:true anche se ho cambiato la colonna a cui accedere 
         * lui mi riotorna sempre il valore in nome
         */
         
        return rawValue
      },
    // e nn posso dare un etichetta come js dopo get esite un solo get per attributo 
    //  get ciao(){
    //         return 'ciao'
    //         }

        
    },
    sigla_catg:{
        type: DataTypes.STRING,
        validate:{
            len:[1,2]//se inseriamo citta con create nessun problema il metodo convalida i dati prima di salvarli
            //mentre per il bulkCreate bisgona passare la prop validate :true nell oggetto opzioni
        }
    },
    descrizione:{
        /**
         * installiamo zlib modulo di  compressione dati supponendo che una descrizione sia onerosa intermiti di 
         * memoria
         * 

            var input = new Buffer('lorem ipsum dolor sit amet');
            var compressed = zlib.deflate(input);
            var output = zlib.inflate(compressed);
            
        /**DOBBIAMO USARE I METODI SINCRONI */
         
        type:DataTypes.TEXT,
        set(value){
            /**comprimiamo */
            /*const compressed=zlib.deflateRawSync(value)*///questo metodo prende un buffer che puo essere
                                                        //un oggetto buffer,un array buffer,una stringa
                                                        //un dataview ,un array tipizzato
            /**
             * noi possiamo una stringa che converitamo in un buffer
             * quindi dobbiamo riconvere l output binario in una stringa e specilizzare il tipo di codifica
             * quindi commentiamo riga 128 
             */
            /**comprimiamo e codifichiamo  */
            const compressed=zlib.deflateSync(value).toString('base64')
            /**scriviamo nella colonna */
            this.setDataValue('descrizione',compressed)
            },
            /**CREIAMO ANCHE IL GETTER */
            get(){
                /**prima cosa da fare recuperare i dati */
             
                const value=this.getDataValue('descrizione')
            
                /**decomprimerli */
                //const uncopressed=zlib.inflateSync()
                /**specifichaiamo al metodo che tidpo deve decomprimere da base 64 a stringa */
                //Buffer.from(valore,tipodiCodifica)
                const uncopressed=zlib.inflateSync(Buffer.from(value,'base64'))
               /* return uncopressed*///cosi vediamo il buffer
               //ma ritorniamo la stringa relativa a l buffer
               return uncopressed.toString()
            }
            
        
    },
    peso:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    psw:{
        type:DataTypes.STRING,
        /**ci mettiamo un setter che hashia la pasw
         * ultilizzeremo il modulo bycrypt 
         * i metodi set e get sono syncroni quindi qualsiasi funzione di qualsiasi modulo utilizzato
         * deve rendere metodi sincroni 
         * in questo caso il modulo bycrypt rende anche metodi sincroni
         * 
         */
        set(value){
            /**sequelioze in fase di creazione prima di inviare i dati al database invochera questo setter
             * che prende il valore che gli arriva da una funzione di creazione che è associato alla prop psw
             * lo modifichera e poi lo renderà modificato per essere scritto sul db
             * HASHING 
             * è un azione unidirezionale irreversibile
             * ovvero l unico modo per scoprire a quale password corrisponde un hash
             * e produrre tenttantivi  in ingresso che in uscita ritornino l hash che stiamo conforntando
             * per vedere se ritorna lo stesso hash
             * "hacker ->tabelle arcobaleno"
             * 
             */
            //setDataValue('nome_colonna','valore da insierire')
            // this.setDataValue('password', hash(this.username + value));
            // this.setDataValue('peso', hash(this.username + value)); come per il getter potremmoo agire anche su altri campi
            //RICORDIAMO CHE SONO METODO SINCRONI QUINDI PE FARE L HASH UTILIZZIAMO I METODI SINCRONI DI BYCRPT
            
            console.log("jcdhivsupsdfiubpsbu6gsb----->",value)
            
            const sale=criptare.genSaltSync(12)//12 max range
            const psw_hashiata_con_sale=criptare.hashSync(value,sale)
            this.setDataValue('psw', psw_hashiata_con_sale);
            

        }
        
    },
    //possiamo definire enne campi virtuali che nn esistono nel db per ritornare alla forntend
    //i dati relativi a questa tabella cosi come li vogliamo unire
    /**defininiamli */
    unioneDati_1:{
        type:DataTypes.VIRTUAL,
        /**getter */
        get(){
            const value1=this.getDataValue('nome')
            
            const value2=this.getDataValue('descrizione')
            const uncopressed=zlib.inflateSync(Buffer.from(value2,'base64'))
           
          
            return value1+"   "+uncopressed.toString()
        }

    },
    unioneDati_use_back_tick:{
        type:DataTypes.VIRTUAL,
        /**getter */
        get(){
          return `${this.nome}  ${this.descrizione}`//cosi qui si attiva il getter definito in descrizione senza fare la decompresiione
          // e decodifica come abbiamo fatto in unione_data_1 
        }

    },
   
    
   
}
//  const oggetto_opzioni_tabella1={
//     freezeTableName: true,//forziamo la pluralizzazione di sequelize
// }
 
const oggetto_opzioni_categorie={
    timestamps: false,
    freezeTableName:true
   

}


 module.exports={oggetto_colonne_categorie,oggetto_opzioni_categorie}
   
   