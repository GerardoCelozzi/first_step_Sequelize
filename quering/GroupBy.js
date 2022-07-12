/**
 * Con la parola chiave DISTINCT, abbiamo visto la forma più semplice di aggregazione:
 *  quella che distingue le righe uguali riportandole quindi una sola volta. L’esempio ivi riportato è, infatti, 
 *  riscrivibile utilizzando la clausola GROUP BY; in altre parole, le seguenti due istruzioni sono equivalenti:

---> SELECT DISTINCT surname FROM Person

---> SELECT surname FROM Person GROUP BY surname


Se le eseguiamo nel nostro database di esempio, otteniamo dunque gli stessi risultati. 
La clausola GROUP BY serve a specificare quali sono i campi su cui effettuare i raggruppamenti:
 il motore di query, per ogni riga esaminerà tali campi(colonne) e la classificherà nel gruppo corrispondente.
  Si possono specificare calcoli da effettuare per ogni gruppo. 
  Ad esempio la query seguente restituisce, per ogni gruppo (surname), il numero di occorrenze trovate, 
  cioè quante persone hanno quel cognome:

  --->  SELECT surname, COUNT(*) FROM Person
        GROUP BY surname <---

 In questo caso il motore raggruppa le righe in base al cognome, e per ogni gruppo effettua il conteggio di quanti elementi
  sono presenti nel gruppo.

Da quanto detto, possiamo desumere una naturale limitazione di SQL: se viene specificata una clausola GROUP BY, 
allora nella clausola SELECT deve esserci:

o un campo specificato nella clausola GROUP BY;
oppure una funzione di aggregazione.
Questo perché quando il motore aggrega le righe deve sapere come comportarsi per ogni campo da restituire.

 */
const alter={alter:true}
const sincronizza=async(model)=>{
    return await model.sync(alter)
}
/**input
 * lista di attributi visto che l operazione di raggrupamento deve operare almeno su un attributo
 * considerando un singolo attributo su di esso costriuiamo un array nidificato
 * exs :
 *    ---->  opzioni_metodo:{
 *                          attributes:[
 *                                      'username',
 *                                      [query_di_funzioni_di_aggregazione_su_attributo_iesimo,'alias']
 *                                      ],
 *                          group: 'username'
 *           }<----
 * atraverso questo oggetto la query crea gruppi per ogni username
 * quindi ogni valore di username genera insieme_username 
 *  per ogni insieme_username per tutti   i valori dell attributo i_esimo 
 * agisce con la funzione di aggregazione che produce il risultato del calcolo da associare a insieme_username
 * ogni insieme_username corrisponde a una riga nel risultato
 * che è formattato
 * con righe di tipo 
 * username:valore,alias:risultato_operazione
 */
/**
 * quanto scritto di seguito è sbagliato osservazione corretta dopo la funzione
 * credo senza la prop group la funzione di aggregazione considera tutti i valori su attributo i-esimo
 * ritornando se:
 * abbiamo anche un altro attributo nel filtro
 * tutti gli oggetti della tabella con {username:valore:alias:''risultato_const}
 * altrimenti se abbiuamo nella lista di attributi solo la funzione di aggrgazione
 * ritorna una sola tupla con il risultato {alias:valore} vedere file aggregazioni_funzioni_sql_sui_dati funzione: aggregazione
 */

/**TEST LISTA DI ATTRIBUTI SENZA PROP GROUP CON QUERY DI AGGREGAZIONE */

    const no_group_by=async(model,instanza_conn,array_Attributi,operazione,colonna,alias,colonna_raggrupamento=null,valore_limit=null)=>{
        await sincronizza(model)
        const lista_attributi=array_Attributi
        const query_aggregazione=[instanza_conn.fn(operazione,instanza_conn.col(colonna)),alias]
        lista_attributi.push(query_aggregazione)
        
        const opzioni={
            attributes:lista_attributi,
            limit:valore_limit,
            group:colonna_raggrupamento
        }

        return await model.findAll(opzioni)

    }
    /**
     * osservazione fatta soppra riguardante i dati incoerenti e sbagliata perche senza valorizzare la prop group
     * per il raggrupamenti questa query non mi ritorna tutta la lista ma bensi 
     * considera la prima tupla e il valore in essa con raggrupamento principale
     * quindi mi ritorna sempre e solo una sola tupla
     */

module.exports={no_group_by}