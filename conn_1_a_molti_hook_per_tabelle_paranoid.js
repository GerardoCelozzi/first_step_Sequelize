const { Sequelize, DataTypes } = require('sequelize');//il modulo di ritorno è una funzione di costruzione (metodo costruttore di un oggetto)
                                                  //convezione lettara maiuscola

/**
 * importiamo le nostre personalizzazioni
 */
/**per tabella users lasciamo che id e nome tabella siano creati da sequelize */
const{oggetto_colonne_users,oggetto_opzioni_users}=require('./models/users')

//rimettiamo l hook nel modello user 



const oggetto_opzioni={
  host: 'localhost',
  dialect: 'mysql' ,
  //logging: (...msg) => console.log(msg),
}


const conn = new Sequelize('sequelize_sync_intables', 'root', '', oggetto_opzioni);
const User=conn.define('user',oggetto_colonne_users,oggetto_opzioni_users)
//afterConnect: {params: 2},
conn.addHook('afterConnect', () => {
    console.log("ci siamo connessi potrei eliminare l invocazione del metodo autenticate")
  });

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
User.hasMany(Product,{onDelete:'CASCADE',
hooks: true,
foreignKey: "userId"})
Product.belongsTo(User,{onDelete:'CASCADE',
 as: 'User',
 foreignKey: "userId"})
 User.hasMany(Post,{onDelete:'CASCADE',
                        hooks: true,
                        foreignKey: "userId"})  
    Post.belongsTo(User,{onDelete:'CASCADE',
                         as: 'User',
                         foreignKey: "userId"})

 conn.sync({alter:true}).then(resp=>{
    console.log("sinc")
})

  User.addHook('afterDestroy',(instance,options)=>{
  
    if(options.miaOpzione==='zia'){
        instance.getPosts().then(posts=> instance.removePosts(posts)); // Softdelete on product table
         console.log('after destroy: destroyed POST')
    }
    else{
        instance.getProducts().then(pro=> instance.removeProducts(pro)); // Softdelete on product table
        console.log('after destroy: destroyed PRODUCTS')
    }
    
}) 

      const elimina_utente_con_post=async (nome_user)=>{
          
        //recupero user
      const instanza_user=await User.findOne({
        where:{
            username:nome_user
        }})  
        //meotdi utilita recupero post di user
        const molti_post_di_user=await instanza_user.getPosts({raw:true})//plurale
        console.log("eliminazione--->",molti_post_di_user)

        //elimino instanza_user
        await instanza_user.destroy({
                                     where:{
                                             username:nome_user
                                        },
                                    miaOpzione:'zia'
                                    })
        
        User.afterDestroy(molti_post_di_user)       
}

const elimina_utente_con_prodotti=async (nome_user)=>{
          
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
     
   const resp2=await User.afterDestroy(lista_prodotti)
   console.log("dopo atrtivazioen hook--->",resp2)
    }

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
    const riattivatom_post=async ()=>{
        await User.restore({
            where:{
                username:'tom'
                    },})
       riassegna_post('tom')
    }
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

    //riattivatom_prodotti()
 //  riattivatom_post()
  //  elimina_utente_con_post('tom')//elimina prodotti
 //elimina_utente_con_prodotti('tom')


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
 //cambia_utente_a_post(1,'mario')
module.exports=conn