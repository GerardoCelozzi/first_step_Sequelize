/**
 * sequelize fondamentalmente è un client di interfacciamento al db
 * che fornisce delle api che ci permettorno di utilizzare instruzion ddl o dml
 * ma non tute le operazioni sul db  o nn tutte le instruzioni del set di instruzioni ammissibili hanno un api
 * per un certo sottinsieme di query abbiamo funzioni dirette al database 
 * invocabile per mezzo dell oggetto che crea un instanza di connessione al db
 * 
 * l instanza è data dalla creazione di un nuovo  oggetto  Sequelize della libreaira Inflection
 * ovvero:  const instanza_connessione=new Sequelize(arg1,arg2,arg3) che accetta degli argomenti in ingresso da passare al constructor
 * quindi in questo modulo utilezzeremo qualche funzione diretta al db per mezzo dell oggetto instanza_connessione
 * 
 * empiricamente ho appurato praticamente che funzione dirette non hanno un riscontro o una mappatura della loro
 * azione dentro il programma node 
 * praticamente una volta invocate scrivono nel db in maniera ovviamente asyncrona ma nn ritorna alcuno oggetto
 * di risposta sull azione che hanno intrapreso nel db
 * quindi comunque bisogna scrivere funzione che gestiscano l asyncronicita  quando utilizziamo questa funzioni dirette
 * il metodo che implemente queste funzioni dirette è di instanza_connessione ed è fn
 * quindi generalizzando abbiamo il seguente codice che le implementa:
 * 
 * model.metodo().then(//questa promise ovvera quella generata da metodo aspetta prima che si risolva quella nidificata
 *                  ()=>{return instanza_connesssione.fn(pattern_relativo_al_tipo_di_query)}).then(
 *                      (risposta_promise)=>{
 *                           ripsosta_promise che nn ci faccio nuilla perche a meno che nn genera un errore che
 *                          risale nella catena delle promisa usando il then ,mi ritorvo con undefined   
 *                          })
 *              })
 *              .catch((err)=>{
 *                  stampa errore
 *              })
 * 
 * dalla documentazione dovrebbe essere che questi metodo che dovrebbero essere invocati solo 
 * con l istanza di connesione sono metodi statici
 */

            //services
            const alter={alter:true}
            const sincronizza=async(model)=>{
                return await model.sync(alter)
            }
            //

const getSchemaDatabase=async(instanza)=>{
    return await  instanza.showAllSchemas()
}

const query_diretta_1=async(model,connessione)=>{
    /**
     * attraverso il metodo fn possiamo invocare direttamente funzioni che esitono in sql ma 
     * sequelize non le rende come  api direttamente
     * 
     */
    await sincronizza(model)
    return await model.findAll({
                    where: connessione.where(// where su instanza 2 args
                                            connessione.fn(
                                                            'char_length',//fn 2 args
                                                            connessione.col('nome')
                                                        )
                                            ,
                                            4
                                            )
        
                })

}

module.exports={getSchemaDatabase,query_diretta_1}