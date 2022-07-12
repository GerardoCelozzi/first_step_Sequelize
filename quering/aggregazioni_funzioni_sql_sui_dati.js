
    const alter={alter:true}
    let Model=null;
   /**
    per poter fare una delle operazioni di aggregazioni abbiamo bisogno :
     instanza di connessione 
     per chiamare il metodo .fn()
     che accetta uno delle funzioni di aggregazioni  
    */
   /**
    * RIPETERE TEORIA
    * Le funzioni di aggregazione eseguono un calcolo in un set di valori e restituiscono un singolo valore. 
    * Ad eccezione di COUNT(*), le funzioni di aggregazione ignorano i valori Null.
    * Le funzioni di aggregazione vengono spesso usate con la clausola GROUP BY dell'istruzione SELECT.
    * Tutte le funzioni di aggregazione sono deterministiche. In altre parole, le funzioni di aggregazione 
    * restituiscono lo stesso valore ogni volta che vengono chiamate con un set specifico di valori di input.
    */
    const denied=(err)=>{
    console.log("ERRORE-->",err)
   }
   const success=async(instanza_connessione,model,colonna,operazione,alias)=>{
        const colonna_operazione=[instanza_connessione.fn(operazione,instanza_connessione.col(colonna)),alias]
        const oggetto_opzioni={attributes:[colonna_operazione]}
        resp=await  model.findAll(oggetto_opzioni)
        console.log("zio-->",resp)    
        return resp
    }

   const success2=(data2)=>{
        data2.forEach((item)=>{
        console.log("XXX->",item.toJSON())
    })
       

   }
   const aggregazione_pass_params_when_invoche = (conn,model,col,oper,alias)=>{
         model.sync(alter).then(()=>success(conn,model,col,oper,alias))
        .then(success2)
        .catch(denied)
   }

/***********  */

   const aggregazione2=(model,db)=>{//senza un alias non funziona nn mi ritorna il dato
       model.sync(alter).then(()=>{
        return model.findAll({attributes:[[db.fn('SUM',db.col('abitanti')),'pippi']]})
        /**qui ritorniamo  l oggetto se ci servisse solo un numero abbiamo query meno complesse
         * direttamente model.sum()
         */
        .then(data=>{
            
            data.forEach(item=>{
                console.log("XXX->",item.toJSON())
            })
        })
       }).catch
   }

   /**ORDER BY */
   //exs : array_nidificato= ['abitanti','DESC']

   /**
    * array_nidificato_attributo_tipo_ordinamento 
        model.sync() si ripete sempre creiamo una funzione cosi non scriviamo piu    
   */
  const sincronizza=async(model)=>{
      return await model.sync(alter)
  }
   const odrina_result=async(model,array_nidificato_attributo_tipo_ordinamento,valore_limit=null)=>{
       await sincronizza(model)

       const opzioni_findAll={
           order:[array_nidificato_attributo_tipo_ordinamento],
           limit:valore_limit
       }
       return await model.findAll(opzioni_findAll)
   }
   
   module.exports={
                    aggregazione_pass_params_when_invoche,
                    aggregazione2,
                    odrina_result
                }
 