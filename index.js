const express = require('express')
// const oggetto_connessione_db=require('./conn')
//const oggetto_connessione_db=require('./conn_test_metodi')
//const oggetto_connessione_db=require('./conn_query_dirette_al_db_associazione_1a_1')
//const oggetto_connessione_db=require('./1_a_molti_primi_test')
//const oggetto_connessione_db=require('./conn_1_a_molti_hook_per_tabelle_paranoid')
const oggetto_connessione_db=require('./conn_molti_a_molti')
const bodyParser = require('body-parser');
const app = express()


app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
var cors = require('cors');
app.use(cors());
const port =process.env.PORT_GESTIONALE || 5000 








//con il THEN (usiamo questo a scope interno)

//callback gestione autenticazione connessione
const succes_promise=(success)=>{
    console.log("connessione avvenuta",success)
}
const reject_promise=(reject)=>{
    console.log("nessuna conessione",reject)
}
oggetto_connessione_db.authenticate().then(succes_promise).catch(reject_promise)
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}...`)
 
})

//gestione errori
app.on('error di gestione errori',(err)=>{console.log(err)})