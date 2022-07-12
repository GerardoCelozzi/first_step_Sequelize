const {Op } = require('sequelize');
const alter={alter:true}
const sincronizza=async(model)=>{
    return await model.sync(alter)
}
const aggiorna_sottoinsieme_attributi__con_condizione_su_essi=async (model,attributi_che_vuoi_aggiornare,cha_è_uguale_a,eta)=>{
    await sincronizza(model)
    /**
     * attributi_che_vuoi_aggiornare,cha_è_uguale_a-->'username':''jerry
     */
    console.log(attributi_che_vuoi_aggiornare,cha_è_uguale_a,21)
    return await model.update(
        /** il primo oggetto definisce i campi da aggiornare nelle proprie chiavi
         * è i valori che devono essere aggiornati nel db sono i valori che diamo alle chiavi di tale oggetto
        */
        {//oggetto 1
        [attributi_che_vuoi_aggiornare]:'aggiorno nome e psw=1234',
        'password':'putin',
        'age':100  
        }
        ,
        /**
         * definiamo la logica di selezione di aggiornamento
         * di defalut l oggetto passato come valore al where è in and
         * quindi questa selezionerà tutti gli elementi che hanno age=21 e pasword=1234
         */
        {//oggetto 2
        where:{ 
                age:21,
                password:'1234'
                }
        }

    )
/**
 * il metodo restituisce non le tuple ma aggiorname ma un array contente un solo elemento 
 * di tipo intero che è il numero delle tuple interessate all aggiornamento
 */
}


/**QUERY DI AGGIORNAMENTO PIU COMPLESSA
 * aggiorniamo le tuple che hanno in username valore 21 (1 tupla)
 * oppure aggiorniamo le tuple che hanno psw=putin (2 tuple)
 * cons username='bello de mamma'
 * passeeord='biden'
 * 
 */
 const aggiornamento_secondo=async(model)=>{
     await sincronizza(model)
    return await  model.update(
         {
            'username':'alien ', 
            'password':'celozzi2'
         }
         ,
         /**apri oggetto condizioni come secondo argomento */
         {
             where:{
                 //[Op.or]: [{ a: 5 }, { b: 6 }],
                 [Op.or]:[
                        {username:'alien'},//dove username =alien
                        //or 
                        {password:'biden_CICCIO'}//dove password =biden_CICCIO'
                 ]
                }
         }

     )
            
}

/**DESTROY 
 * passando in ingresso al primo argomento un oggetto {nome_Attributo: valore} seleziona tutte le tuple che soddisfano la condizione 
 * e di conseguenza le eliminera
 * proiviamo a nidificare anche con qualche condizione in piu
 * 
 */

    const elimina=async(model,user_name)=>{
        await sincronizza(model)
        //model.destroy({truncate:true})--->elimina tutti i record ma nn la tabella
        return await model.destroy({
                                    where:{
                                            [Op.or]:[
                                                    {username:user_name},
                                                    {age:100}
                                                    ]
                                            }
                                    }
        )
    }

/**METODI  DI UTILITA SQLIZE */
/**MAX */

    const trova_il_massimo_valore_su_attributo=async(model)=>{
        await sincronizza(model)
        console.log("eta massima: ",await model.max('age'))
    }
/**SUM */
    const somma_eta_utenti=async(model)=>{
        await sincronizza(model)
        console.log('la somma di tute le eta degli utenti è: ',await model.sum('age'))
    }

/**SUM CON CLAUSOLA WHERE */

    const somma_con_where=async(model)=>{
        await sincronizza(model)
        console.log("somma di tutti i 40enni presenti : ",await model.sum('age',{where:{
                                                                                    age:40
                                                                                        }
                                                                                    }))
    }


module.exports={
                aggiorna_sottoinsieme_attributi__con_condizione_su_essi,
                aggiornamento_secondo,
                elimina,
                trova_il_massimo_valore_su_attributo,
                somma_eta_utenti,
                somma_con_where
            }