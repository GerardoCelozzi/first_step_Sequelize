/**ipotizziamo che abbiamo un variabile Users che mappa la tabella user */

    const alter={alter:true}
    let Model=null;
   
    const denied=(err)=>{
    console.log("ERRORE-->",err)
   }

    const success=async()=>{
        console.log("\n\nfindAll senza filtri sugli attributi\n")
        return await Model.findAll()
    }
    const success2=async(list_find_all)=>{
        console.log("tutti gli elementi di ",Model," con tutte le prop")
        list_find_all.forEach(item=>{
           console.log(item.toJSON())
       })
    }
    /**TUTTA LA LISTA */
    const tutta_la_lista=async(model)=>{
        Model=model
        model.sync(alter).then(success)
            .then(success2)
            .catch(denied)

    }
    /**potrei parametrizzare la prima ma per rendere le cose piu chiare separo i concetti e gli esempi e codice piu leggibile in futuro */
   
  
    /**FIND ALL SOTTOINSIEME DI ATTRIBUTI  */
    const success_filtered=async()=>{
        const sottinsieme_attributi=['id','age']
        const opzioni_metodo_findAll={attributes:sottinsieme_attributi}
        console.log("\n\nfindAll tutta lista filtra solo per username e age \n")
        return await Model.findAll(opzioni_metodo_findAll)

    }
    const success_filtered_2=async(lista)=>{
        lista.forEach(item=>{
            console.log(item.toJSON())
        })

    }

    const tutta_la_lista_sottoinsieme_colonne=(model)=>{
        Model=model
        model.sync(alter).then(success_filtered)
            .then(success_filtered_2)
            .catch(denied)

    }
    /**tutta la lista tranne  EXCLUDE*/

    const tutta_la_lista_tranne=(model,array_da_escludere)=>{
    const opzioni={attributes:{exclude:array_da_escludere}}
    model.sync(alter).then(()=>{
        return model.findAll(opzioni)
    }).then(data=>{
        data.forEach(item=>{
            console.log(item.toJSON())
        })
    }).catch((err)=>{
        console.log(err)
    })

    }

    /**forniamo uin alias per i nomi delle colonne nel db 
     * 
     * nell oggetto opzioni del metodo ogni colonna che deve ridefinire il proprio alia è un array nidificato
     * con [nome colonna, nuovo nome colonna] dove ognuno di questo array è un elemento dell array pio esterno
     * passato alla chiave attributes dell oggetto opzioni 
     * 
     * vediamo:
    */
     const success_filtered_alias=async()=>{
         const rinomina_age=['age','eta']
         const rinomina_username=['username','scanza_fatiche']
         const sottinsieme_attributi=[rinomina_username,rinomina_age]
         const opzioni_metodo_findAll={attributes:sottinsieme_attributi}
         console.log("\n\nfindAll tutta lista filtra solo per username e age \n")
         
         return await Model.findAll(opzioni_metodo_findAll)

    }
    const success_filtered_2_alias=async(lista)=>{
        lista.forEach(item=>{
            console.log(item.toJSON())
        })

    }


   const alias_at_colonna=async(model)=>{
        Model=model
        model.sync(alter).then(success_filtered_alias)
            .then(success_filtered_2_alias)
        .catch(denied)
   }

   /**Condizioni su clausola where
    * funzione parametrizzata
     input :
        * model
        * array attributi da rendere nel risultato 
        * oggetto contente la clausola del where, oggetto={porp:valore,prop2:valore2} sono in AND
        * 
     */

    /**aggiunto paramentro limit diamo un default altrimenti è una prop di primo livello nell oggetto_opzioni  p*/
     const where_clausola=async (model,array_att,clausola,valore_limit=null)=>{
        const opzioni_findAll={
                        attributes:array_att,
                        where: clausola, 
                        limit: valore_limit}    
        await  model.sync(alter)
          const resp=await  model.findAll(opzioni_findAll)
          return resp
     }




module.exports ={tutta_la_lista,
                tutta_la_lista_sottoinsieme_colonne,
                alias_at_colonna,
                tutta_la_lista_tranne,
                where_clausola
            };