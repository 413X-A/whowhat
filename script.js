const attributesList = [
    // Stimmung / Emotionen
    "Ängstlich", "Aufgeregt", "Dankbar", "Eifersüchtig", "Einsam",
    "Erleichtert", "Fröhlich", "Gelassen", "Genervt", "Glücklich",
    "Motiviert", "Nervös", "Reizbar", "Traurig", "Verliebt",
    "Wütend", "Zufrieden", "Zweifelnd",

    // Körperliche Symptome
    "Appetitlos", "Atemnot", "Bauchschmerzen", "Benommenheit",
    "Blähungen", "Durchfall", "Erkältungssymptome", "Erschöpft",
    "Fieber", "Frieren", "Halsschmerzen", "Heißhunger",
    "Hitzewallungen", "Husten", "Juckreiz", "Kopfschmerzen",
    "Krankheitsgefühl", "Magenschmerzen", "Migräne", "Muskelkater",
    "Nasenbluten", "Nackenschmerzen", "Rückenschmerzen",
    "Schwindel", "Übelkeit", "Verdauungsprobleme", "Verstopfung",

    // Schlaf & Energie
    "Albträume", "Energiegeladen", "Früh aufgewacht",
    "Gut geschlafen", "Mittagschlaf gemacht", "Müde",
    "Schlaflosigkeit", "Schwer aus dem Bett gekommen",
    "Spät eingeschlafen",

    // Ernährung & Verdauung
    "Appetit gesteigert", "Gesunde Ernährung", "Junkfood gegessen",
    "Kein Hunger", "Überessen",

    // Aktivität & Bewegung
    "Gespaziert", "Haushalt gemacht", "Lange gesessen",
    "Sport gemacht", "Training ausgelassen", "Viel gestanden",

    // Soziales & Beziehungen
    "Allein gefühlt", "Besuch gehabt", "Familie getroffen",
    "Freunde getroffen", "Gesellschaft genossen",
    "Gesellschaft gemieden", "Geschlechtsverkehr",
    "Streit gehabt", "Unterstützung erhalten",

    // Arbeit & Produktivität
    "Arbeiten gewesen", "Etwas Neues gelernt", "Konzentriert",
    "Kreativ", "Prokrastiniert", "Stress", "Viel geschafft",
    "Wenig geschafft",

    // Gesundheit & Pflege
    "Arzttermin gehabt", "Medikamente genommen", "Physiotherapie",
    "Sauna besucht", "Viel getrunken", "Vitamin eingenommen",

    // Wetter & Umwelt
    "Heißes Wetter", "Kalter Tag", "Regen", "Schnee", "Windig",

    // Besondere Ereignisse
    "Ausflug gemacht", "Besonderes Essen", "Einkaufen gewesen",
    "Feier besucht", "Fernsehen geschaut", "Geburtstag gefeiert",
    "Kino besucht", "Musik gehört", "Neues Hobby begonnen",
    "Spiele gespielt"
];


let currentUser = sessionStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "login.html";
}
document.getElementById("userDisplay").textContent = "Eingeloggt als: " + currentUser;

let userKey = "user_" + currentUser;
let userData = JSON.parse(localStorage.getItem(userKey)) || {};

const datePicker = document.getElementById("datePicker");
const ratingContainer = document.getElementById("ratingButtons");
const attributesContainer = document.getElementById("attributeButtons");
const notesInput = document.getElementById("notes");

datePicker.value = new Date().toISOString().split("T")[0];

function getDayData(date) {
    if (!userData[date]) {
        userData[date] = { rating: null, attributes: {}, notes: "" };
        attributesList.forEach(attr => {
            userData[date].attributes[attr] = false;
        });
    }
    return userData[date];
}

function saveData() {
    localStorage.setItem(userKey, JSON.stringify(userData));
}

function loadDay(date) {
    let dayData = getDayData(date);

    // Bewertung 1-12, nur 1 aktiv
    ratingContainer.innerHTML = "";
    for (let i = 1; i <= 12; i++) {
        let btn = document.createElement("button");
        btn.textContent = i;
        btn.className = (dayData.rating === i) ? "active" : "inactive";
        btn.onclick = () => {
            dayData.rating = i;
            saveData();
            loadDay(date);
        };
        ratingContainer.appendChild(btn);
    }

    // Attribute, mehrere aktiv möglich
    attributesContainer.innerHTML = "";
    attributesList.forEach(attr => {
        let btn = document.createElement("button");
        btn.textContent = attr;
        btn.className = dayData.attributes[attr] ? "active" : "inactive";
        btn.onclick = () => {
            dayData.attributes[attr] = !dayData.attributes[attr];
            saveData();
            loadDay(date);
        };
        attributesContainer.appendChild(btn);
    });

    notesInput.value = dayData.notes;
}

notesInput.addEventListener("input", () => {
    let date = datePicker.value;
    let dayData = getDayData(date);
    dayData.notes = notesInput.value;
    saveData();
});

datePicker.addEventListener("change", () => {
    loadDay(datePicker.value);
});

loadDay(datePicker.value);
