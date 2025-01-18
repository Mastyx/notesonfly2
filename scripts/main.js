import Nota from "./Nota.js";
import Notebook from "./Notebook.js";


const elenco_ol_Books = document.getElementById("elenco-notebooks");
const elenco_ol_Note = document.getElementById("elenco-note");
const btnAggiungiNotebook = document.getElementById("add-book");
const btnAggiungiNota = document.getElementById("add-nota");
const notebookSelezionato = document.getElementById("notebook-selezionato");
const notaSelezionata = document.getElementById("nota-selezionata");
const contenutoNota = document.getElementById("contenuto-nota");
const exportBtn = document.getElementById("export");
const importBtn = document.getElementById("import")
const fileInput = document.getElementById("file-import");
//variabili 
let books = [];
let selectedNotebook = null;
let selectedNota = null;

let quill ;
// gestione al caricamento della pagina
document.addEventListener("DOMContentLoaded", ()=> {
	
	hljs.configure({ languages: ["javascript", "python", "html", "css"] }); // Specifica i linguaggi supportati (opzionale)
  hljs.highlightAll(); // Inizializza highlight.js
	setQuillEditor();
	inizializza();
	getLocalStorageUsage();
});

// dichiaro Delta per l'utilizzo della clipboard copia e incolla
const Delta = Quill.import('delta');
// settaggio del editor quill 

const setQuillEditor = ()=> {
	console.log("Veszione quill : ", Quill.version);

	quill = new Quill("#contenuto-nota",{
		theme : "snow",
		modules : {
			syntax : true,
			toolbar : [
				[{size : [] }],
				[{color : [] }],
				[{align: [] }],
				["bold", "italic","underline", "strike"],// formattazione
				["code-block"], // blocco codice
				[{list: "ordered"}, {list: "bullet"}], // liste  ...
			],
		},
	});
	// Sovrascrivi l'evento di incolla per accettare solo testo semplice
	const clipboard = quill.getModule('clipboard');
	clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
		const plainText = node.innerText || ''; // Estrai il testo semplice
		return new Delta().insert(plainText);  // Usa Delta per incollare solo testo semplice
	});
	// Imposta altezza fissa e overflow per l'editor
	const editorContainer = document.querySelector(".ql-editor");
	editorContainer.style.height = "100%";
	editorContainer.style.maxHeight = "100%";
	editorContainer.style.overflowY = "auto";
	editorContainer.style.overflowX = "hidden";
	
	//intercettiamo i cambiamenti del testo per salvarli nel localstorage
	quill.on("text-change", ()=> {
		if(selectedNota) {
			selectedNota.testo = quill.getContents();
			console.log("cambiamento...");
			salvaNotebooks();
			getLocalStorageUsage();
		}
	});

	quill.disable();
}


const inizializza = ()=>{
	// richiamaiamo la funzione per settaggio di quill
	const datiSalvati = JSON.parse(localStorage.getItem("data-nof2")) || [];
	books = datiSalvati.map(bookData => {
		const notebook = new Notebook(bookData.titolo);
		notebook.notes = bookData.notes.map(notaData => 
			new Nota(notaData.titolo, notaData.testo));
			return notebook;
	});
	updateNotebook();
}


//crea un nuovo notebook 
btnAggiungiNotebook.addEventListener("click", ()=>{	
	const titolo = prompt("Inserisci il nome del Notebook");
	if (titolo) {
		books.push(new Notebook(titolo));
		console.log("NUovo notebook creato : " + titolo);
	}
	salvaNotebooks();
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
		salvaNotebooks();
		updateNote();
	}
});


// aggiornamento gli elementi notebook 
const updateNotebook = ()=> {
	elenco_ol_Books.innerHTML= "";
	books.forEach( (book, index) => {
		const elemento_book = document.createElement("li");
		elemento_book.id= "elemento-book";
		elemento_book.innerText = book.titolo;
		elemento_book.addEventListener("click", ()=>{
			document.querySelectorAll("#elenco-notebooks li").forEach((el)=> {
				el.classList.remove("selected");
			});
			elemento_book.classList.add("selected");
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
			cancellaNotebook(index);
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
			elemNota.id = "elemento-nota";
			elemNota.addEventListener("click", ()=> {
				document.querySelectorAll("#elenco-note li").forEach((el)=>{
					el.classList.remove("selected");
				});
				elemNota.classList.add("selected");
				selectedNota = nota;
				notaSelezionata.innerText = `${nota.titolo}`;
				notebookSelezionato.innerText = selectedNotebook.titolo;
				quill.enable( true );
				quill.setContents( nota.testo || "" );
			});
			const cancella = document.createElement("div");
			cancella.innerHTML = "<i class='bx bxs-trash'></i>";
			cancella.id = "cancella-nota";
			cancella.addEventListener("click", (e)=>{
				e.stopPropagation();
				cancellaNota(index);
				console.log("Elemento cancellato : " + nota.titolo);
			});
			elemNota.appendChild(cancella);
			elenco_ol_Note.appendChild(elemNota);
		});
	} else { quill.disable(); }
}


const salvaNotebooks = ()=> {
	console.log("salvataggio i local");
	localStorage.setItem("data-nof2", JSON.stringify(books));
}

const cancellaNotebook = (index)=> {
	if( confirm("Il Book e tutto le note verranno cancellate !!! "))  {
		books.splice(index, 1);
		salvaNotebooks();		
		location.reload();
	}
}

const cancellaNota = (index)=> {
	if (selectedNotebook) {
		if( confirm("La nota verra cancellata !!!") ) {
			selectedNotebook.notes.splice(index, 1);
			selectedNota = null;
			updateNote();
			notebookSelezionato.innerText = " - - - ";
			notaSelezionata.innerText = " - - - ";
			salvaNotebooks();
		}
	}
}


function getLocalStorageUsage() {
	// calcola la percentuale rimasta libera di 5MB  
	const MAX_LOCAL_STORAGE = 5 * 1024 * 1024; // 5MB in bytes
	let usedSpace = 0;

	for (let key in localStorage) {
			if (localStorage.hasOwnProperty(key)) {
					usedSpace += (localStorage[key].length + key.length) * 2; // Ogni carattere UTF-16 occupa 2 byte
			}
	}

	const usedPercentage = (usedSpace / MAX_LOCAL_STORAGE) * 100;
	const progressBar = document.getElementById("storage-usage-bar");
	if (usedPercentage > 80 ) {
		progressBar.style.background = "blue";
	} else {
		progressBar.style.backgroundColor = "green";
	}
	progressBar.value = usedPercentage;

	console.log(`Spazio usato: ${usedSpace} bytes (${usedPercentage.toFixed(2)}%)`);
}


//intercetta il click sul div export 
exportBtn.addEventListener("click", ()=> {
	exportLocalStorage();
});
const exportLocalStorage = ()=> {
	// scarica tutte i notebook e le note in un file json
	const fileName = prompt("Dai un nome al file (senza estensione) : ");
	if(!fileName) {
		alert("Salvataggio annullato, nome non fornito");
		return;
	}

	const data = JSON.stringify(books, null, 2);
	const blob = new Blob([data], {type:"application/json"});
	
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${fileName}.json`;
	a.click();
	URL.revokeObjectURL(url);
}

// intercetta il click sul div import 
importBtn.addEventListener("click", ()=>{
	// simula il click su fileInput per 
	// richiamare la finestra di input 
	fileInput.click(); 
});
fileInput.addEventListener("change", (event)=>{
	// carica il file json
	const file = event.target.files[0];
	if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
					try {
							const data = JSON.parse(e.target.result); // Leggi il file JSON
							
							if (Array.isArray(data)) {
									books = data; // Sovrascrivi il tuo array `books` con i dati importati
									selectedNotebook = null; // Resetta il notebook selezionato
									selectedNota = null; // Resetta la nota selezionata
									notebookSelezionato.innerText = "Nessun Notebook Selezionato";
									notaSelezionata.innerText = "Nessuna Nota Selezionata";
									quill.setText(""); // Pulisci l'editor Quill
									updateNotebook(); // Aggiorna la UI
									elenco_ol_Note.innerText = "";
							} else {
									alert("Il file non contiene dati validi.");
							}
					} catch (err) {
							console.error("Errore durante l'importazione del file:", err);
							alert("Errore nel file JSON selezionato.");
					}
			};
			reader.readAsText(file);
	}
});

