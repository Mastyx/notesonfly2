const CLIENT_ID = "386225138212-pr7juka0pdvo3jcd7770tiomojgeehkd.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file";
let accessToken = "";
let authClient = null;

export function initAuth() {
    if (!authClient) {
        authClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (response) => {
                if (response.error) {
                    console.error("Errore autenticazione:", response);
                    alert("Errore autenticazione");
                    return;
                }
                accessToken = response.access_token;
                console.log("Access Token:", accessToken);

                // Cambia colore del pulsante di autenticazione
                const connectButton = document.getElementById("connect-drive");
                if (connectButton) {
                    connectButton.style.backgroundColor = "green";
                    connectButton.innerText = "Collegato a Drive";
                }

                alert("Autenticazione completata!");
            }
        });
    }

    authClient.requestAccessToken();
}

export function saveJsonToDrive(jsonData, fileName) {
    if (!accessToken) {
        alert("Devi prima collegarti a Google Drive!");
        return;
    }

    fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and trashed=false`, {
        method: "GET",
        headers: new Headers({ Authorization: "Bearer " + accessToken }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.files.length > 0) {
            const fileId = data.files[0].id;
            updateFile(fileId, jsonData);
        } else {
            createFile(jsonData, fileName);
        }
    })
    .catch(error => {
        console.error("Errore durante la ricerca del file:", error);
        alert("Errore durante la ricerca del file!");
    });
}

function createFile(jsonData, fileName) {
    const metadata = {
        name: fileName,
        mimeType: "application/json"
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("File caricato:", data);
        alert("File caricato con successo!");
    })
    .catch(error => {
        console.error("Errore nel caricamento:", error);
        alert("Errore nel caricamento!");
    });
}

function updateFile(fileId, jsonData) {
    const metadata = {
        mimeType: "application/json"
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));

    fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("File aggiornato:", data);
        alert("File aggiornato con successo!");
    })
    .catch(error => {
        console.error("Errore nell'aggiornamento:", error);
        alert("Errore nell'aggiornamento!");
    });
}

