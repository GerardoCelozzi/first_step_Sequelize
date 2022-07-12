const {Op } = require('sequelize');
const alter={alter:true}
const sincronizza=async(model)=>{
    return await model.sync(alter)
}
/**
 * metodi finders generano query con selezionamento
 * 
 * questi metodi restituiscono istanze della classe del modello
 * ovvero oggetti 
 * infatti in precedenza a queste instanze quando applichiamo  il metodo toJSON() 
 * questo converte lato node le instanze in semplici oggetti javascript in cui possiamo accedere alle proprieta
 * 
 * cioè in node se nel flusso del metodo definiamo un oggetto per qualche motivo come quando creiamo oggetti per ordinare il codice 
 * su tale oggetto nn potremmo applicare il metodo toJSON()
 * darebbe errore 
 * 
 * XKE QUESTA DIFFERENZA (proviamo a dare una risposta)?
 * linguaggio a oggetti
 * quando creiamo un instanza con  "new Sequelize" si  alloca un oggetto nella HEAP della memoria con un indirizzo fisso
 * stesso discorso quando definiamo una mappatura per i nostri modelli
 * le instanze dei nostri modelli sranno calssi che estendo l oggetto Sequelize (instanza di connesssione)
 * e quindi o perche erditano o perhce definiscono metodi propri possiamo invocare su queste instanze metodi di quering
 * quindi la differenza con un oggetto creato nella sintassi internamente a un metodo è che 
 * nell heap le nostre mappature esistono e sono allocate mentre quelli che utiliziamo in un metodo rispettano solo
 * le regole sintaticche per la manipolazione dei dati ma non esistono nell heap 
 * quindi deduco il metodo toJSON() possa essere invocato solo da oggetti che eistono nell heap
 * 
 * e se tutto questo è giusto
 * 
 * allora un metodo invocato da un oggetto model che restituisce un instanza vuol dire che agisce sul db
 * e cio che ritorna dal db lo allocca nell heap creandone un instanza per l applicativo 
 * quindi il risultato della query diventa un oggetto allocato nell heap
 *   
 */

/**detto cio un alternativa al toJSON() sulla risposta e impostare in ingresso al metodo
 * di ricerca la prop raw:true nell oggetto opzioni
 */
/**METODO FINDALL CON RAW:TRUE */

const formatta_la_risposta_impostando_la_prop_raw=async(model)=>{
   //questo oggetto_opzioni ad esempio è un oggetto di lavoro non allocato nell heap 
 
   /*start test findAll*/ 
   const tutta_la_lista='findAll'
   const oggetto_opzioni={
       raw:true,
       limit:5
    }

    const oggetto_opzioni_con_clausola={
        raw:true,
        limit:5,
        where:{
            age:40
            }
    }
    /**end findAll */
    
    /**ricerca su chiave primaria findByPk  start*/
    const id=6
    /***end findByPk */

    /**findOne
     * restituisce la prima occorenza che soddisfa la clausola nel where
     */

    await sincronizza(model)
     console.log("raw:true -->limit:5-->",await model[tutta_la_lista](oggetto_opzioni_con_clausola))//raw è al primo livello dell ogggetto opzioni
     console.log("id:6--->",await model['findByPk'](id,{raw:true}))
    
     console.log("\n\nnessuna clausola findone\nquindi mi ritorna la prima tupla dell intera tabella:\n",await model.findOne({raw:true}))
    console.log("\n")

    console.log("findOne dove age=40",await model.findOne({raw:true,where:{age:40}}))
    console.log("findOne dove age=21 and username =zio",await model.findOne({raw:true,where:{age:21,username:'zio'}}))//in and di default

    console.log("finOne username=zio or age=35",await model.findOne({raw:true,where:{
                                                                                     [Op.or]:[   {age:35},{username:'zio'}]
                                                                                    }
                                                                    }),"\n pesca subito la condizione in or age=35 sulla prima tupla")


    }


    /**FIND ON CREATE
     * cerca la tupla che soddisfa le condizioni di where se nn la trovi 
     * creare
     * possiamo passare al metodo valori di default in fase di creazione
     * che scriverebbero se non sono stati definiti in precedenza  o
     *  sovrascrivebbero quelli gia definiti nella personalizzazione del modello
     * dopo la query ritorna un array conentenete 
     * tupla trovata o tupla inserita (sono sempre instanze)
     * piu valore booleano true se trova false se scrive
     */

    /**findOrCreate */      

    const cerca_o_crea=async(model)=>{
        await sincronizza(model)
        // console.log("finOrCreate utente pippolone ..",[boleano,instanza]=await model.findOrCreate({
        //                                                                                             where:{
        //                                                                                                 username:'pippolone'
        //                                                                                             },
        //                                                                                             raw:true
        //                                                                                            }
        // ))

        /**impostiamo valori di defulats */
            console.log("finOrCreate utente pippolone ..",
          
            [uno ,due]=await model.findOrCreate({
                                                        where:{
                                                            //username:'pippolone' esiste quindi nn crea
                                            /**cambiamo nome */  username:'marco2'               
                                                                },
                                                        defaults:{
                                                                    age:104
                                                                },
                                                        raw:true
                                                        })
                        )
        console.log("se mi servono i valori separati destrutturo->",uno)
        console.log("se mi servono i valori separati destrutturo->",due)
    }

/**ultimo findAndCountAll 
 * trovami le tuple che soddisfano la condizione e contamele
 * restituisce un oggetto con due prop {count,row}
 * 
 */
const cerca_e_conta=async(model)=>{
   const resp=await  model.findAndCountAll({
                                        where:{
                                            username:'alien'
                                        },
                                        raw:true
                                        })
    console.log("utente alien ",resp)
    //questo metodo invece ritorna un oggetto se dovessi destrutturare ricorda che le chiavi di destrutturazione devono combaiare
    //{count,row}=resp
                                        
}


/**metodo per testare il model categorie con funzione setter definita */
const cerca_or_crea_in_Categorie=async(model,chiavedi_ricerca,nome_Categoria,psw1,description)=>{
    //await sincronizza(model)
    //console.log(chiavedi_ricerca)
    const calusola={[chiavedi_ricerca]:nome_Categoria}
    //console.log("calusola: ",calusola)
    const senzaDestrutturazione= await model.findOrCreate({
                where:calusola
                ,
                defaults:{
                    psw:psw1,
                    descrizione:description
                },                                                    
              // raw:true sembrerebbe che questo opzione inserisce un asyncronicita che non attiva il setter
                })
    
//console.log('instanza : ',uno,"status: ",due)
console.log("senzaDestrutturazione-->raggiungo psw",senzaDestrutturazione[0].dataValues.psw)
console.log("senzaDestrutturazione-->descrizione",senzaDestrutturazione[0].dataValues.descrizione)
const [uno,due]=senzaDestrutturazione
console.log("findOrCreate--->risposta: ",senzaDestrutturazione)
console.log("destrutturando l array  e solo se applico il toJSON() interpreta la decondifica fatta nel getter e leggo cio che \n è stato scritto ")
console.log("primo elemento con il toJSON()-->",uno.toJSON())
console.log("\n\nprimo elemento senza toJSON() ",uno)

console.log("VIRTUALE DATA utilizzando il metodo di instanza getValue nel getter: \n",uno.unioneDati_1,'\n\n')

console.log("VIRTUALE 2 UTILIZZATO I BACKTICK ",uno.unioneDati_use_back_tick)

console.log("infatti mi ritorna il valore zero al posto del nome ")

// senzaDestrutturazione.forEach(item=>{
//     console.log("xxxx --->",item)
// })

/** utilizzando il findorCreate non riesco a formattare i dati pulendoli
 * perche il raw:true non puo essere inserito
 * per accedere ai valori nel db devo scendere nella catena di formattazione di risposta dal db
 * ovverro :
 * senzaDestrutturazione[0].dataValues.psw--->recupero valore psw
 * 
 */
   
}

    module.exports={formatta_la_risposta_impostando_la_prop_raw,cerca_o_crea,cerca_e_conta,
        cerca_or_crea_in_Categorie}