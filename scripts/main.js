import Nota from "./Nota.js";
import Notebook from "./Notebook.js";

const books  = [];
const notes = [];

// elementi dom
const addBook = document.getElementById("add-book");
const sezioneBooks = document.getElementById("elenco-notebooks");
const addNota = document.getElementById("aggiungi-nota");
const notebookSelezionato = document.getElementById("notebook-selezionato");


let selectedBook = null;
let selectedNota = null;

// all evento caricamento pagina
document.addEventListener("DOMContentLoaded", ()=>{
	aggiornaBooks();
});

// gestisce evento click nuovo notebook
addBook.addEventListener("click", ()=>{
	nuovoNotebook();
});
// aggiungi-nota evento click 
addNota.addEventListener("click", ()=>{
	nuovaNota();
});



//crea nuovo notebooks 
const nuovoNotebook = ()=> {
	const nomeNuovoBook = prompt("Inserisci il nome del book");
	if (nomeNuovoBook) {
		books.push(new Notebook(nomeNuovoBook));
		//crea la nota aggiungendola al array books 
		aggiornaBooks();
	}
}

const nuovaNota = ()=> {
	
}


const aggiornaBooks = ()=>{
	sezioneBooks.innerText = "";
	// aggiorniamo gli elementi della sezione books
	// ricreando il menu books
	books.forEach(book => {
		const li_book = document.createElement("li");
		li_book.id = "elementobook";
		li_book.innerText = book.nome;
		li_book.addEventListener("click", ()=>{
			notebookSelezionato.textContent = book.nome;
		});
		sezioneBooks.appendChild(li_book);
	});
};



// se creiamo una costante che riceve il notebook selezionato 
// e poi al click della nuova nota 
// controlliamo se e stato selezionato un notebook 
// se si 
// allora aggiungiamo al notebook.notes l'elemento nota 
//
// in seguito aggiornomo la vita delle note
