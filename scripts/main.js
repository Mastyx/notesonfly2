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
	if(!selectedNotebook){
		alert("Nessun notebook e stato selezionato");
		return;
	}
	const titoloNota = prompt("Inserisci il titolo della nota");
	if (titoloNota) {
		const newNota = new Nota(titoloNota, "");
		selectedNotebook.notes.push(newNota);
		console.log("Nota Creata nel book : ", selectedNotebook.titolo);
		updateNote();
	}
});


// aggiornamento gli elementi notebook 
const updateNotebook = ()=> {
	elenco_ol_Books.innerText = "";
	
	books.forEach( (book, index) => {
		const elemento_book = document.createElement("li");
		elemento_book.id= "elemento-book";
		elemento_book.innerText = book.titolo;
		elemento_book.addEventListener("click", ()=>{
			selectedNotebook = book;
			notebookSelezionato.innerText = book.titolo;
			selectedNota = null;
			notaSelezionata.innerText = "Nessuna Nota Selezionata";
			contenutoNota.value = "Nessun contenuto";
			updateNote();
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

// aggiorniamo gli elementi note 
const updateNote = ()=> {
	elenco_ol_Note.innerText = "";
	if (selectedNotebook) {
		selectedNotebook.notes.forEach((nota, index) => {
			const elemNota = document.createElement("li");
			elemNota.textContent = nota.titolo;
			elemNota.addEventListener("click", ()=> {
				selectedNota = nota;
				notaSelezionata.innerText = nota.titolo;
				quill.enable(true);
				quill.setContents(nota.testo || "");
			});
			elenco_ol_Note.appendChild(elemNota);
		});
	}
}

