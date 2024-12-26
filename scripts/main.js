import Nota from "./Nota.js";
import Notebook from "./Notebook.js";





const book1 = new Notebook('book1');

const nota1 = new Nota("nota1", "nel mezzo del cammin");
const nota2 = new Nota("nota2", "testo della nota 2");


book1.notes.push(nota1);
book1.notes.push(nota2);

book1.notes.forEach( nota => {
	console.log(nota.titolo + " | " + nota.testo);
});

