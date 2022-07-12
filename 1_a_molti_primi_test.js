const { Sequelize, DataTypes } = require('sequelize');//il modulo di ritorno è una funzione di costruzione (metodo costruttore di un oggetto)
                                                  //convezione lettara maiuscola

/**
 * importiamo le nostre personalizzazioni
 */
/**per tabella users lasciamo che id e nome tabella siano creati da sequelize */
const{oggetto_colonne_users,oggetto_opzioni_users}=require('./models/users')





const oggetto_opzioni={
  host: 'localhost',
  dialect: 'mysql' ,
  //logging: (...msg) => console.log(msg),
}


const conn = new Sequelize('sequelize_sync_intables', 'root', '', oggetto_opzioni);

/**CREIAMO UNA UNA TABELLA POST DOVE AD UN UNTENTE CORRISPONDO PIU POST
 * UTENTE HA MOLTI POST (utente tabella padre/origine)
 * MOLTI POST APPARTENGO A  UTENTE(post tabella figlio/destinazione)
 * molte occrorenze dello stesso user possono essere presenti nella tabella post
 * 
 *  idPost  | userId
 * ------------------       
 * |     1  |     8  |
 * ------------------
 * |     2  |     8  |
 * -------------------
 */

    const Post=conn.define('post',{
                message:{
                        type:DataTypes.STRING
                }
            },{
                timestamps:false,
                paranoid: true,
            })
    const Product=conn.define('product',{
        nome:{
                type:DataTypes.STRING
        }
    },{
        timestamps:false,
        paranoid: true,
    })
    
    const User=conn.define('user',oggetto_colonne_users,oggetto_opzioni_users)
  
       /**
        * passaimo ai metodi che definiscono le relazioni un oggetto opzioni
        * dove specifichiamo l azione di cascade tra user e post
        * perche se eliminiamo un utente di conseguenza eliminiamo anche tutti i suoi post
        *  */ 

       //HOOK METODO 2 DELLA GUIDA
       /**
        User.addHook('beforeValidate', (user, options) => {
        user.mood = 'happy';
        });
        */
        const primaeliminazione= (instance, options)=> {
            console.log("dentro hook---------------> ",instance)
            console.log("è un post? ",options)
            if(options.miaOpzione ==='zioe'){
            instance.getPosts().then(posts=> instance.removePosts(posts)); // plurale
            console.log('after destroy: destroyed');
            }else{
                console.log("vuoi eliminare altre relazioni --->",options.name )
            }
        }

      User.addHook('afterDestroy',()=>{
          //praticamente va in automatico bassa che gli passo su quele riferimento deve eliminare
          //quindi se un utente ha anche piu fatture collegate nella funzione che invoca l hook gli passo un altro riferimento
      }) 
    
    /**quindi pper il moemnto abbiamo visto come definirli nel modello o con l istanza del modello 
     * dobbiamo usarli quando abbiamo relazioni tra tabelle paranoid
     * altrimenti sequelize ignora le azioni come le l eliminazione di una tupla in tabella di orgine
     * che ha il suo did come chiave esterna su una tabella figlia 
     * quindi quelle instanze in tabella figlia che mantengono un id eliminato sarebbero instanze con infromazione incoerente
     * ovviamente tutto quando ce la necessita di eliminazione in cascata
     */
    User.hasMany(Post,{onDelete:'CASCADE',
                        hooks: true,
                        foreignKey: "userId"})//ricorda che i metodi di utilita (quando instanza tabella padre aggiorrna crea  o legge in tabella figlia)sono
                    //posizioonati sulla tabella di orgine quindi per poter usare anche la tabella figlio utilizziamo anche il belongsTo
    Post.belongsTo(User,{onDelete:'CASCADE',
                         as: 'User',
                         foreignKey: "userId"})
    //sincronizziamo


/**creiamo un po di post in blocco */

            // Product.bulkCreate([
            //     {
            //         nome:'ciao io sono un prodotto 1'
            //     },
            //     {
            //         nome:'ciao io sono un prodotto 2'
            //     },
            //     {
            //         nome:'ciao io sono un prodotto 3'
            //     },
            //     {
            //         nome:'ciao io sono un prodotto 4'
            //     },
            //     {
            //         nome:'ciao io sono un prodotto 5'
            //     },
            //     {
            //         nome:'ciao io sono un prodotto 6'
            //     },
            // ])


           

            User.hasMany(Product,{onDelete:'CASCADE',
            hooks: true,
            foreignKey: "userId"})//ricorda che i metodi di utilita (quando instanza tabella padre aggiorrna crea  o legge in tabella figlia)sono
        //posizioonati sulla tabella di orgine quindi per poter usare anche la tabella figlio utilizziamo anche il belongsTo
        Product.belongsTo(User,{onDelete:'CASCADE',
             as: 'User',
             foreignKey: "userId"})
             conn.sync({alter:true}).then(resp=>{
                console.log("sinc")
            })
/**
 * RISPETTO ALLE ASSOCIAZIONE 1A1 QUESTA HA PIU METODI DI UTILITA
 * ad esempio nel prossimo metodo utlizziamo il metodo plurazzato della tabella figlia per aggiungere con una chiamata 
 * piu post ad utente 
 * sintass è add+(nome model pluralizzato)-->addPosts
 */

        const cerca_Username_e_aggiungi_post=async(user_name)=>{
            //await User.sync({alter:true})
            const user1=await User.findOne({
                where:{
                    username:user_name
                },
               // raw:true
            })
            console.log("user: ",user1)
            const listaPost=await Post.findAll()
            //console.log("post -->",listaPost)
            const tutti_i_post_di_user1=await user1.addPosts(listaPost)

            //constiamo quanti post abbiamo aggiunti
            const numero_post_di_utente=await user1.countPosts()
            console.log("post di ",user_name," numero: ",numero_post_di_utente)

            //rimuoviamo il post con id 9
          //  const post_delete=await Post.findOne({where:{id:8}})
            //    await user1.removePost(post_delete)//metodo al singolare "removePost" 
                                                   //e nella tabella in post con id =8 nn nelle fk ritornerà null

            //getter
           // console.log("post di je ",await user1.getPosts({raw:true}))
            
            //rimuoviamo tutti i post a utente je
            // const lista_post=await Post.findAll()
            // await user1.removePosts(lista_post)
            

        }
       // cerca_Username_e_aggiungi_post('tom')
        /**ci sono alcune tuple che nn vengono metchate da sequelize ad esempio quelle
                                                 id:16-17-18-20 mah? 
        perche sono eliminate in paranoid ecco perche le vedo nel db ma non le recupero
        nell applicativo

                                                 */


        /**FUNZIONE CHE TESTA L AZIONE DEL CASCADE IN ELIMINAZIONE TABELLA PADRE */

        const rimuoviUser=async(nome)=>{
           const resp= await User.destroy({where:{username:nome}})
           console.log("eliminazione ",nome,"   ",resp)
            // await User.restore({
            //     where:{
            //         username:nome
            //             },})
        }

      // rimuoviUser('je')
      /**testiamo l opzione false di paranoid per vedere se lo include nella lista */

        // User.findAll({raw:true,paranoid:false}).then(resp=>{
        //     console.log(resp)
        // })  ok

        /**ripristiniamo utente */
        User.sync({alter:true})
        // User.restore({
        //         where:{
        //             username:'alba'
        //                 },})

        /**eliminiamo con paranoid false per vedere se elimina le chiavi esterne in post */
        const funzione_di_eliminazione_su_tabelle_paranoid_con_hook_afterDsitroy=async (nome_user)=>{
          
            //recupero user
          const instanza_user=await User.findOne({
            where:{
                username:nome_user
            }})  
            //meotdi utilita recupero post di user
            const molti_post_di_user=await instanza_user.getPosts()//plurale

            //elimino instanza_user
            await instanza_user.destroy({
                                         where:{
                                                 username:nome_user
                                            },
                                        miaOpzione:'zio'
                                        })
            //gli hook si invocano con le instanze dei modelli(define)
            //instanze degli oggetti dei modelli sono quelle che ritornano dalle query 
            
            //invochiamo l hook da noi implementato che in ingresso prende il riferimento della lista dei post
            //quindi nome array 
            User.afterDestroy(molti_post_di_user)
            /*qui chiamiamo un hook definito nell modello di user
            !!!!!!!!!!!!!!!!!!!await User.afterDestroy(molti_post_di_user)!!!!!!!!!!!!!!!!!!!!!!  
             */

            /**
             * ritroniamo nel modello commentiamo l hook
             * e definiamo sopra dopo il define l hook e proviamo
             * a invocarlo qui dentro
             */
           
    }
    const funzione_di_eliminazione_fkProdotti_di_utente=async (nome_user)=>{
          
        //recupero user
      const instanza_user=await User.findOne({
        where:{
            username:nome_user
        }})  
        //meotdi utilita recupero post di user
        const lista_prodotti=await instanza_user.getProducts({raw:true})//plurale
            console.log("aaaaaaaaaaaaaaa--------------------->",lista_prodotti)
        //elimino instanza_user
       const resp= await instanza_user.destroy({
                                     where:{
                                             username:nome_user
                                        },
                                    miaOpzione:'zio'
                                    })

        console.log("eliminazione prodotti ",resp)
         
        User.afterDestroy(lista_prodotti)
        }

    /**creiamo anche un hook personalizzato non passandolo nell oggett opzioni del modello */
    // User.addHook('afterValidate', (user, options) => {
    //    // user.mood = 'happy';
    //    console.log("ti saluta pippo",user)
    //   });
          
      
    //   const usa_hook_personalizzato=async(nome)=>{
    //     const resp= await User.findOne({where:{username:nome}})
    //     console.log("vengo chiamato ma nn mi attivo perche nn viene fatta una validazione",resp)
    //     User.afterValidate(resp)
    //   }
    //   usa_hook_personalizzato('tom')
            //  User.destroy({
            //     where:{
            //         username:'alba'
            //             },
            //             force:true}) cosi elimina i riferimenti grazie all opzione force:true e all opzione onDelete:CASCADE
            //ma elimina ancke l user dalla base di date perdendo le informazioni delle tabelle paranoid



      /**qui utiliziamo i metodi di utilita sulla tabella orgine  */
        const riassegna_post=async (user_name)=>{
            
            const user1=await User.findOne({
                where:{
                    username:user_name
                },
            // raw:true
            })
            console.log("user: ",user1)
          
            const listaPost=await Post.findAll()
           // console.log("post -->",listaPost)
            console.log("name model post --->",Post.name)
            const tutti_i_post_di_user1=await user1.addPosts(listaPost)
            console.log("post di je 2 ",await user1.getPosts({raw:true}))
        }
        const riattivatom=async ()=>{
            await User.restore({
                where:{
                    username:'tom'
                        },})
           riassegna_post('tom')
        }
        
                        /**comportamento promise l ultima promessa è la prima a ritornare quindi 
                            avveni che veniva gestito prima l ultimo mettodo riassegna post poi ritorna in 
                            cerca e assegna e siccome li dentro ho il destroy venivano nuovamente rimossi
                            ATTENZIONE quindicommentato il primo metodo
                             */
                            const assegna_prodotti=async (user_name)=>{
            
                                const user1=await User.findOne({
                                    where:{
                                        username:user_name
                                    },
                                // raw:true
                                })
                                console.log("user: ",user1)
                              
                                const listaProdotti=await Product.findAll()
                               // console.log("post -->",listaPost)
                           
                                const tutti_i_post_di_user1=await user1.addProducts(listaProdotti)
                                console.log("post di prodotti  ",await user1.getProducts({raw:true}))
                            }
                            const riattivatom_prodotti=async ()=>{
                                await User.restore({
                                    where:{
                                        username:'tom'
                                            },})
                             assegna_prodotti('tom')
                            }

                           
      /* METODO CHE CI HA FATTO SCOPRIRE L USO DEGLI HOOK                      
        const elimana_utente_elimina_suoi_post=async(user)=>{
            await User.sync({alter:true})
            /* ho dvuto fare il restore perche user ha paranoid:true nelle opzioni
            await User.restore({
                where:{
                    username:user
                        },})
                        
                       
            const user1=await User.findOne({
                where:{
                    username:user
                },
            // raw:true
            })
            
            console.log("user: ",user1)
            console.log("eliminazione ",user)
            /**user è paranoid senza opzione paranoid false non mi elimina in cascade 
             * 
           const resp= await User.destroy({where:{username:user}})
           console.log("numero tuple eliminate ",resp)
         
           
        
          const resp= await User.destroy({where:{username:user},paranoid:false})
            console.log("numero tuple eliminate ",resp)
              anche con paranoid false non agisce sulla chiave esterna della tabella figlia
          Elimina zio ma nn i suoi id in post su fk 
        }
        */
     //   elimana_utente_elimina_suoi_post('zio')

    //riattivatom()
    // riattivatom_prodotti()
  // funzione_di_eliminazione_su_tabelle_paranoid_con_hook_afterDsitroy('tom')
       funzione_di_eliminazione_fkProdotti_di_utente('tom')


    /**
     * METODI DI UTILITA DELLA TABELLA FIGLIA
     */
    
    const cambia_utente_a_post=async(id_post,nuovo_utente)=>{
       const post=await  Post.findOne({
                                        where:{
                                            id:id_post
                                        }
                                    })
        const instanza_nuovo_utente= await User.findOne({
                                                where:{
                                                    username:nuovo_utente
                                                }
                                            })
        post.setUser(instanza_nuovo_utente).then(resp=>{
            console.log("XXXXXXXX--->",resp)
        })
    }
    //cambia_utente_a_post(1,'mike')
module.exports =conn