import Nota from "./Nota.js";
import Notebook from "./Notebook.js";

const books  = [];
const notes = [];

// elementi dom
const addBook = document.getElementById("add-book");
const sezioneBooks = document.getElementById("sezione-books");


// all evento caricamento pagina
document.addEventListener("DOMContentLoaded", ()=>{
	aggiornaBooks();
});

addBook.addEventListener("click", ()=>{
	const nomeNuovoBook = prompt("Inserisci il nome del book");
	if (nomeNuovoBook) {
		books.push(new Notebook(nomeNuovoBook));
		aggiornaBooks();
	}
});

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




