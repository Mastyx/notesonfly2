class Nota {
	constructor(titolo, testo) {
		this.titolo = titolo || "Senza titolo";
		this.testo = testo || "";
		this.dataCreazione = this.formatDate(new Date());
		this.creaNota();
	}
	
	creaNota() {
		console.log("Nota Creata");
	}

		formatDate(date) {
			const formattedDate = date.toLocaleDateString('it-IT'); 
			const formattedTime = date.toLocaleTimeString('it-IT', 
				{ hour: '2-digit', minute: '2-digit', second: '2-digit' }); 			
			return `${formattedDate} ${formattedTime}`; // Combina data e ora
	}
}

export default Nota;
