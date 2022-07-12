/**con i metodi getter noi recuperiamo i dati dal db 
 * ma possiamo personalizzare ,formattare i dati prima che vengono restiutiti al frontend
 * viceversa con i setter prima che vengano scritti possiamo formattarli
 */
/**utilizziamo il model categorie */
const alter={alter:true}
const sincronizza=async(model)=>{
    return await model.sync(alter)
}
const leggi_il_primo_casino_nel_get=async(model)=>{
    await sincronizza(model)
    const resp=await model.findOne()//senza passare raw:true posso modellare qualsiassi tipo di elaborazione nel get
                                    //
    console.log('\ncon falla non gestita \n',resp.nome)
}

leggi_il_primo_con_get_puro=async(model)=>{
await sincronizza(model)
const resp=await model.findOne({raw:true})//se passo raw:true anche se nel get faccio giochi lui peschera il valore relativo 
                                            //all attributo in cui è stato definito
console.log('\ncon falla  gestita dalla opzione raw:true\n',resp.nome)
}
module.exports={leggi_il_primo_casino_nel_get,leggi_il_primo_con_get_puro}