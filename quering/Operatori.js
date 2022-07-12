//♠
const {Op } = require('sequelize');
const { oggetto_colonne_city } = require('../models/city');
const alter={alter:true}
const sincronizza=async(model)=>{
    return await model.sync(alter)
}


/**operatori */
/**
 * funzione parametrica che concatena all oggetto Op il tipo di operatore
 * input: 
  - tipo operatore
  - model
  -oggetto chaivi:valore 
 */

  /**
   * per semplicita gli passo l operatore cmq come parametro ma distinguiamo
   * per ogni operatore logico una funzione
   */
  /**OR */
  const where_clausola_operatore_or=async(model,operatore_logico,oggetto_confronto)=>{
      /**
       const oggetto_confronto={
                                username:'jerry',
                                age:40
                                }
     */
        await sincronizza(model)
         
            const operator=Op[operatore_logico]  //Op.or
              
            const opzioni={
                where:{
                    [operator]:oggetto_confronto
                }
            }  
          
        return await model.findAll(opzioni)

  }

  const where_applica_di_defualt_operatore_and=async(model,oggetto_attributi_confronto)=>{
      await sincronizza(model)
      const opzioni={
        where:oggetto_attributi_confronto
      }
      return await model.findAll(opzioni)
  }


  /**OPERAZIONI DI CONFRONTO SU UNA COLONNA SPECIFICA CHE SUPERI IL TEST 
   * applichiamo l operatore alla colonna abitanti in citta
   * e recuperiamo solo citta che hanno piu 200000 abitati
   * l oggetto opzioni dopo la prop where si definirà un oggetto
   * cha avra come prop i nomi delle colonne su cui agire con la condizione
   * e come chiave un oggetto che avra come chiave l opertore e valore  il valore del confronto
   * ovverr:
   * const oggetto_opzioni={
   *                        where:{
   *                            abitanti:{
   *                                       [Op.gt]:200000
   *                                        }
   *                               }
   *                        ,limit:2
   *                        }
   * 
   */

  /*nessuna pèarametrizzazione se non per il model che deve essere sincronizzato e cmq i dati che passeremo
    rifeririranno tabella oggetto_colonne_city
   */
    const get_grandi_Citta=async(model,instanza_conn,valore_limit=null)=>{
        await sincronizza(model)
        try{
        return await model.findAll({
            where:{
                abitanti:{
                    [Op.gt]:3500000
                }
            },//qui mi pesca solo roma che supera tale condizione
            limit:valore_limit,
           
            attributes:[
                        /** distinct  */
                        [instanza_conn.fn('DISTINCT', instanza_conn.col('nome')) ,'citta'],//aggiungiamo funzione di aggregazione
                        'abitanti',//per aggiungere altri attributi alla risposta aggiungerli dopo la funzione di aggregazione
                                    //altrimenti va in errore
                        'provincia'
            ]
        })
    }catch(err){
        console.log("errore ",err)
    }
    }

    /**CONFRONTI LOGICI NIDIFICATI */
    /**
     *
     * quindi 
     * NIDIFICHIAMO CONSIDERANDO CONDIZIONI SU UN ATTRIBUTO ALLA VOLTA
     */
    /**nessuna parametrizzazione cosi in futuro sarà piu chiaro  */
    const confronti_logici_su_un_Attributo=async(model)=>{
        //query--> SELEZIONIAMO TUTTI GLI UTENTI CHE HANNO ETA MAGGIORE DI 25 OPPURE UGUALE A 0(modifica al db per avere coerenza di query )
        await sincronizza(model)
        return await model.findAll({
                                    where:{
                                        age:{
                                            /**opertore in or (oppure) 
                                             * per ogni operazione che corrisponde ad una chiave nell oggetto relativo all attributo
                                             * si valorizzo con un altro oggetto nidificato che contiente i confronti logici e cosi via
                                             * quindi
                                            */
                                           /**chiave operatore */
                                            [Op.or]:{//apre nuovo oggetto come valore ma abbiamo ancora condizioni di confronto
                                                    //ma a questo livello di nidificazione dobbiamo mettere i valori con ciu age
                                                    //deve superare i test quindi questo è l ultimo livello di nidificazione
                                                    //quindi abbiamo come prop le condizioni attraverso gli operatori dt test
                                                    //e valori i valori che carettirzzano il test
                                                    /**ETA >025 */
                                                    [Op.gt]:45,
                                                    [Op.eq]:0
                                                    }
                                            }
                                    }
                                })

    }
    
  module.exports={
                  where_clausola_operatore_or,
                  where_applica_di_defualt_operatore_and,
                  get_grandi_Citta,
                  confronti_logici_su_un_Attributo
                 }