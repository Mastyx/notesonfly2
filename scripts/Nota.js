class Nota {
	constructor(titolo, testo) {
		this.titolo = titolo;
		this.testo = testo;
		this.dataCreazione = new Date();
		this.creaNota();
	}
	
	creaNota() {
		console.log("Nota Creata");
	}

	

}

export default Nota;