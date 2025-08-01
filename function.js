//============================
// Funktion saveToLocalStorage
//============================
function saveToLocalStorage() {
    localStorage.setItem("shoppingList", JSON.stringify(items));
}

//===================== 
// Funktion renderItems
//=====================
function renderItems() {
    // Leert den Inhalt damit nichts zweimal angezeigt wird
    ItemList.innerHTML = "";

    // Geht jedes Item im Array durch und erstellt die Liste, Text des Artikels und Bild
    items.forEach(item => {

        const li = document.createElement("li");
        li.setAttribute("draggable", "true");
        li.dataset.id = item.id;

        const span = document.createElement("span");
        span.textContent = item.name;
        li.appendChild(span);
        
        // Zeigt die Checkbox im Html an
        const check = checkbox(item, span);
        li.appendChild(span);
        li.appendChild(check);

        // Zeigt den ImageBtn im Html an
        const imageMenu = createImageMenu(item);
        li.appendChild(imageMenu);

        // Erstellt den Delete-Btn 
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        li.appendChild(deleteBtn);
        
        addDeleteBtn(deleteBtn, item.id);

        // Drag and Drop wird aktiviert
        addDragAndDropListeners(li);

        ItemList.appendChild(li);
    });
}

//=========================
// Drag and Drop Funktionen
//=========================
function addDragAndDropListeners(li) {

    // Wird ausgeführt, wenn man ein Element zieht
    li.addEventListener("dragstart", (e) => {
        draggedItemId = li.dataset.id;
        li.classList.add("dragging");
    });

    // Wird ausgelöst, wenn ein anderes Element rüber gezogen wird
    li.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    
    // Wird ausgelöst, wenn das gezogene Element über einem anderen losgelassen wird
    li.addEventListener("drop", (e) => {
        if (!draggedItemId || draggedItemId === li.dataset.id)
            
    return;
        
        // Findet die Position des gezogenen Elements & wo es gedroppt wurde im Array
        const fromIndex = items.findIndex(item => item.id === draggedItemId);
        const toIndex = items.findIndex(item => item.id === li.dataset.id);
        
        // Verschiebt das gezogene Element im Array
        const moveditem = items.splice(fromIndex, 1)[0];
        items.splice(toIndex, 0, moveditem); 
        
        saveToLocalStorage();
        renderItems();
    });
    
    li.addEventListener("dragend", (e) => {
        draggedItemId = null; // Setzt die ID zurück
        li.classList.remove("dragging"); // Entfernt die CSS Klasse
    });
}

//====================
// Delete-Btn Funktion
//====================
function addDeleteBtn(button, itemId) {
    button.addEventListener("click", () => {
        items = items.filter(item => item.id !== itemId) // Filtert das entfernte Item aus dem Array heraus
        
        saveToLocalStorage();
        renderItems();
    });
}

// =================
// Checkbox Funktion
// =================
function checkbox(item, textSpan) {
    // Erstellt Checkbox als input
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked ? true : false; // Setzt die Checkbox auf "checked", wenn item.checked true ist, sonst auf false

    // Behebt den Fehler, wenn die Seite neugeladen wird und dann der Artikel nicht durchgestrichen ist
    textSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";

    // EventListener wenn Checkbox abgehackt ist dann wird der Text durchgestrichen
    checkbox.addEventListener("change", () => { 
        item.checked = checkbox.checked;
        textSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
        saveToLocalStorage(); 
    });

    // Gibt die fertige Checkbox zurück, damit sie ins Listenelement eingefügt werden kann
    return checkbox;
}

//=====================
// Funktion addImageBtn
//=====================
function createImageMenu(item) {
    // Div Element wird erstellt
    const wrapper = document.createElement("div");

    // Bilderknopf wird als Knopf definiert
    const imageBtn = document.createElement("button");
    imageBtn.textContent = "📷 Bild ansehen";

    // Menücontainer wird erstellt
    const menuContainer = document.createElement("div");
    menuContainer.classList.add("image-menu");
    menuContainer.style.display = "none";

    // Button-Logik
    imageBtn.addEventListener("click", () => {

        // Schliesst alle anderen Menüs
        document.querySelectorAll(".image-menu").forEach(menu => {
            if (menu !== menuContainer) {
                menu.style.display = "none";
            }
        });

        // Wenn das Menü sichtbar ist, dann block sonst none 
        const isVisible = menuContainer.style.display === "block";
        menuContainer.style.display = isVisible ? "none" : "block";
        
        // Verhindert beim hinzufügen eines Artikels die Öffnung des Bildermenüs vom ersten Artikel
        item.menuOpen = !isVisible;
    });

    // Input vorbereiten
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none"; // Input wird versteckt damit der Upload-Button die Funktion vom Input übernimmt

    // Upload-Button erstellen, für besseres Styling
    const uploadBtn = document.createElement("button");
    uploadBtn.classList.add("file-upload");
    uploadBtn.textContent = "📁 Bild auswählen";

    // Falls der Button gedrückt wird, dann wird der Input aktiviert -> Dateienansicht
    uploadBtn.addEventListener("click", () => {
        input.click();
    });

    menuContainer.appendChild(uploadBtn);
    menuContainer.appendChild(input);

    // Püft, ob das Item ein Bild hat
    if(item.image) {
        // Bildelement wird erstellt
        const img = document.createElement("img");
        img.src = item.image; // Das Bild wird aus dem gespeicherten Base64-Code geladen
        img.alt = "Artikelbild";
        img.classList.add("item-image");

        // Bild wird dann ins Menü hinzugefügt
        menuContainer.appendChild(img);

        // Der Bild entfern Knopf wird erstellt
        const deleteImgBtn = document.createElement("button");
        deleteImgBtn.textContent = "🗑️";
        deleteImgBtn.classList.add("img-delete-btn");

        // Der Knopf wird dann im Menücontainer eingefügt
        menuContainer.appendChild(deleteImgBtn);
        
        // Eventlistener fürs Löschen des Bildes
        deleteImgBtn.addEventListener("click", () => {
            item.image = null;
            saveToLocalStorage();
            renderItems();
        });

        // Grössere Anzeige des Bildes 
        img.addEventListener("click", (e) => {
            e.stopPropagation();

            const overlay = document.getElementById("image-overlay");
            const overlayImg = document.getElementById("overlay-image");

            overlayImg.src = img.src;
            overlay.classList.add("active");
        });
    }

    // Schliessen von vergrösserter Anzeige
    document.getElementById("close-overlay").addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("image-overlay").classList.remove("active");
    });

    // Datei einlesen und speichern als Base64String
    input.addEventListener("change", () => {

        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const base64String = e.target.result;
            item.image = base64String;

            saveToLocalStorage();
            renderItems(); // Wichtig, damit das Bild sichtbar wird
        };
        reader.readAsDataURL(file);
    });

    // Alles in Wrapper hinzufügen
    wrapper.appendChild(imageBtn);
    wrapper.appendChild(menuContainer);

    return wrapper;
}