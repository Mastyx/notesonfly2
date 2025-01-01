import Nota from "./Nota.js";
import Notebook from "./Notebook.js";

const books  = [];
const notes = [];

// elementi dom
const addBook = document.getElementById("add-book");
const sezioneBooks = document.getElementById("elenco-notebooks");
const addNota = document.getElementById("aggiungi-nota");

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
		aggiornaBooks();
	}
}

const nuovaNota = ()=> {
	 
}


const aggiornaBooks = ()=>{
	sezioneBooks.innerText = "";
	// aggiorniamo gli elementi della sezione books 
	books.forEach(book => {
		const elementobook = document.createElement("li");
		elementobook.id = "elementobook";
		elementobook.innerText = book.nome;
		sezioneBooks.appendChild(elementobook);
	});
};



// se creiamo una costante che riceve il notebook selezionato 
// e poi al click della nuova nota 
// controlliamo se e stato selezionato un notebook 
// se si 
// allora aggiungiamo al notebook.notes l'elemento nota 
//
// in seguito aggiornomo la vita delle note
