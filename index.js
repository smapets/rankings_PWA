const button = document.getElementById("btn");

button.addEventListener("click", appendScript);
//get the parameters against which the table can be filtered
let storedFilters = JSON.parse(localStorage.getItem("filters"));

let ths = Array.from(document.querySelectorAll("th"));
let tds = Array.from(document.querySelectorAll("tbody td"));

function appendScript() {
  let edit_script = document.createElement("script");
  edit_script.src = "uomTrack.js";
  edit_script.type = "text/javascript";
  document.head.appendChild(edit_script);
  button.removeEventListener("click", appendScript);
}
//filter the table against the storedFilters
ths.map(th => {
  if (!storedFilters.includes(th.getAttribute("data-th"))) th.remove();
});
tds.map(td => {
  if (!storedFilters.includes(td.getAttribute("data-th"))) td.remove();
});
//create a container to store all the buttons for the filters
let filterContainer = document.createElement("div");
filterContainer.setAttribute("class", "flex-container filter-container");
button.insertAdjacentElement("afterend", filterContainer); //insert it after script button
//insert a filters text as a button, style it as the rest of the buttons
//but disable it and apply noHover effect
let filterTitle = document.createElement("button");
filterTitle.innerHTML = "Filters:";
filterTitle.setAttribute("disabled", "disabled");
filterTitle.setAttribute("class", "filterButton noHover");
filterContainer.appendChild(filterTitle);
//insert a button, for every filter
storedFilters.map(f => {
  let filterButton = document.createElement("button");
  filterButton.setAttribute("class", "filterButton");
  filterButton.innerHTML = f;
  filterButton.addEventListener("click", filterDisplay);
  filterContainer.appendChild(filterButton);
});
//insert a button, to remove all filters
let filterButton = document.createElement("button");
filterButton.setAttribute("class", "filterButton");
filterButton.innerHTML = "Show all";
filterButton.addEventListener("click", filterDisplay);
filterContainer.appendChild(filterButton);

//run filterDisplay function every time the user
//clicks on a filter button
function filterDisplay(evt) {
  let tds = Array.from(document.querySelectorAll("tbody td"));
  let ths = Array.from(document.querySelectorAll("th"));
  let ps = Array.from(document.querySelectorAll("p"));
  let value = evt.target.innerHTML;
  ths.map(th => {
    th.classList.remove("hidden");
    if (th.getAttribute("data-th") != value && value != "Show all") {
      //hide all th elements  whose data-th value is not equal with the value passed from the filterButton
      //unless the filterButton is the Show all button
      th.classList.add("hidden");
    }
  });
  tds.map(td => {
    td.classList.remove("hidden");
    if (td.getAttribute("data-th") != value && value != "Show all") {
      //hide all td elements  whose data-th value is not equal with the value passed from the filterButton
      //unless the filterButton is the Show all button
      td.classList.add("hidden");
    }
  });
  ps.map(p => {
    p.classList.remove("hidden");
    //hide all icons  unless the filterButton is the Show all button
    if (value != "Show all") {
      p.classList.add("hidden");
    }
  });
}
//store all the data from the table in localStorage once the user clicks "Remove uomTrack class"
function storeData() {
  let ths = Array.from(document.querySelectorAll("th"));
  let tds = Array.from(document.querySelectorAll("tbody td"));
  let dataToStore = [];
  ths.map(th => {
    let column = tds.filter(
      //keep the table cells of a certain column and filter the rest
      td => th.getAttribute("data-th") === td.getAttribute("data-th")
    );
    column = column.map(c => c.getAttribute("value"));
    column.push(th.getAttribute("data-th"));
    dataToStore.push(column);
  });
  console.log(dataToStore);
  localStorage.setItem("data", JSON.stringify(dataToStore));
}
