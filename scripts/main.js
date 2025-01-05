import Nota from "./Nota.js";
import Notebook from "./Notebook.js";


const elenco_ol_Books = document.getElementById("elenco-notebooks");
const elenco_ol_Note = document.getElementById("elenco-note");
const btnAggiungiNotebook = document.getElementById("add-book");
const btnAggiungiNota = document.getElementById("add-nota");
const notebookSelezionato = document.getElementById("notebook-selezionato");
const notaSelezionata = document.getElementById("nota-selezionata");
const contenutoNota = document.getElementById("contenuto-nota");


//variabili 
let books = [];
let selectedNotebook = null;
let selectedNota = null;

let quill ;

// settaggio del editor quill 
const setQuillEditor = ()=> {
	quill = new Quill("#contenuto-nota",{
		theme : "snow",
		modules : {
			toolbar : [
				["bold", "italic","underline", "strike"],// formattazione
				["code-block"], // blocco codice
				[{list: "ordered"}, {list: "bullet"}], // liste  ...
			],
		},
	} );
}


// gestione al caricamento della pagina
document.addEventListener("DOMContentLoaded", ()=> {
	// richiamaiamo la funzione per settaggio di quill
	setQuillEditor();
});


//crea un nuovo notebook 
btnAggiungiNotebook.addEventListener("click", ()=>{	
	const titolo = prompt("Inserisci il nome del Notebook");
	if (titolo) {
		books.push(new Notebook(titolo));
		console.log("NUovo notebook creato : " + titolo);
	}
	updateNotebook();

});

// crea una nuova nota 
btnAggiungiNota.addEventListener("click", ()=>{
});


// aggiornamento della schermata con gli oggetti attivi
const updateNotebook = ()=> {
	elenco_ol_Books.innerText = "";
	
	books.forEach( (book, index) => {
		const elemento_book = document.createElement("li");
		elemento_book.id= "elemento-book";
		elemento_book.innerText = book.titolo;
		elemento_book.addEventListener("click", ()=>{
			selectedNotebook = book;
			notebookSelezionato.innerText = book.titolo;
		});
		const cancella = document.createElement("div");
		cancella.innerHTML = "<i class='bx bxs-trash'></i>";
		cancella.id = "cancella-book";
		cancella.addEventListener("click", ()=>{
			console.log("Elemento cancellato : " + book.titolo);
			
		});

		elemento_book.appendChild(cancella);
		elenco_ol_Books.appendChild(elemento_book);
	});
}


