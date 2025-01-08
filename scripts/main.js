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
				[{size : [] }],
				[{color : [] }],
				[{align: [] }],
				["bold", "italic","underline", "strike"],// formattazione
				["code-block"], // blocco codice
				[{list: "ordered"}, {list: "bullet"}], // liste  ...
			],
		},
	} );

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
			localStorage.setItem("data-nof2", JSON.stringify(books));
			getLocalStorageUsage();
		}
	});
}


// gestione al caricamento della pagina
document.addEventListener("DOMContentLoaded", ()=> {
	setQuillEditor();
	inizializza();
	getLocalStorageUsage();
});
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
				selectedNota = nota;
				notaSelezionata.innerText = nota.titolo;
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
	}
}


const salvaNotebooks = ()=> {
	localStorage.setItem("data-nof2", JSON.stringify(books));
}

const cancellaNotebook = (index)=> {
	if( confirm("Il Book e tutto le note verranno cancellate !!! "))  {
		books.splice(index, 1);
		localStorage.setItem("data-nof2", JSON.stringify(books));
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
			localStorage.setItem("data-nof2", JSON.stringify(books));
		}
	}
}


function getLocalStorageUsage() {
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
		progressBar.style.backgroundColor = "red";
	} else {
		progressBar.style.backgroundColor = "green";
	}
	progressBar.value = usedPercentage;

	console.log(`Spazio usato: ${usedSpace} bytes (${usedPercentage.toFixed(2)}%)`);
}

exportBtn.addEventListener("click", ()=> {
	exportLocalStorage();
});

const exportLocalStorage = ()=> {
	const data = {...localStorage };

	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], {type:"application/json"});
	
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "data-nof2.json";
	a.click();
	URL.revokeObjectURL(url);
}

importBtn.addEventListener("change", ()=>{
	importFileData();
})

const importFileData = (event)=> {
	const file = event.target.files[0];
	const reader = new FileReader();

	reader.onload = (e) => {
		try {
			const data = JSON.parse(e.target.result);
			for (const [key, value] of Object.entries(data)) {
				localStorage.setItem(key, value);
			}
			alert("Dati importti con succeso !!!");
			location.reload();
		} catch (err) {
			console.log("errore caricamento file...");
			alert("Errore caricamento file");
		}
	};
	reader.readAsText(file);

}

