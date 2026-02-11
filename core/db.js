const DB_NAME = "EndlessDebuggerDB";

export function saveToDB(data) {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("history", { autoIncrement: true });
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("history", "readwrite");
      tx.objectStore("history").add(data);
      resolve();
    };
  });
}

export function loadHistory(container) {
  const request = indexedDB.open(DB_NAME, 1);

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction("history", "readonly");
    const store = tx.objectStore("history");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
      container.innerHTML = "";
      getAll.result.slice(-5).reverse().forEach(item => {
        const div = document.createElement("div");
        div.textContent = "Risk: " + item.overallRisk;
        container.appendChild(div);
      });
    };
  };
}
