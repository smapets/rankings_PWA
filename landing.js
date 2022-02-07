let btnAddRow = document.querySelector(".addRow");
let btnloadTable = document.querySelector(".loadTable");
btnAddRow.addEventListener("click", addRow);
btnloadTable.addEventListener("click", collectFilters);
function addRow() {
  let row = document.querySelector("tr");
  let tbody = document.querySelector("tbody");
  let newRow = row.cloneNode(true);
  tbody.appendChild(newRow);
}
//redirect the website from the table configuration
//to the main table
function collectFilters() {
  let filters = document.querySelectorAll("select");
  filters = Array.from(filters);
  let values = filters.map(f => f.value);
  localStorage.setItem("filters", JSON.stringify(values));
  window.location.href = "./landing.html";
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(registration => {
      console.log("Sw registered");
      console.log(registration);
    })
    .catch(err => {
      console.log("Sw registration Failed");
      console.log(err);
    });
}
