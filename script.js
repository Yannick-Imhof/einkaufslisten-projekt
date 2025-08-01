//==========================
// Auflistung der Konstanten
//==========================
const ItemInput = document.getElementById("item-input");
const ItemButton = document.getElementById("item-btn");
const ItemList = document.getElementById("item-list");
const ItemTemplate = document.getElementById("item-template");

// Brauchen wir, um zu wissen welches Element gezogen wird
let draggedItemId = null;

// Leeres Array für Artikel
let items = [];

// Prüft ob beim Laden der Seiteschon etwas im Locale Storage gespeichert ist
window.addEventListener("DOMContentLoaded", () =>{
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
        items = JSON.parse(saved);
        renderItems();
    }
});

// Neuen Artikel erstellen und zur Liste hinzufügen, wenn der Button geklickt wird
ItemButton.addEventListener("click", () => {
    const name = ItemInput.value.trim();
    if (!name) return;

    /* Erstelle ein neues Item mit einer eindeutigen ID basierend auf die aktuelle Zeit, toString ändert 
    die Zeit in ein String um für eine einzigartige ID, falls zwei Artikel den gleichen Namen haben */
    const newItem = {
        id: Date.now().toString(),
        name: name,
        image: ""
    };
    items.push(newItem);
    saveToLocalStorage();
    renderItems();
    ItemInput.value = ""
});