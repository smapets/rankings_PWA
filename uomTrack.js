let btn = document.querySelector("#btn");
btn.innerHTML = "Add  uomTrack class";
btn.classList.add("button");
btn.addEventListener("click", toggleClass); //when the user chooses to add or remove the class to the table, the following code will run
function toggleClass(evt) {
  let table = document.getElementById("table");
  if (!table.classList.contains("uomTrack")) {
    let ths = Array.from(document.querySelectorAll("th"));
    ths.map(th => {
      th.classList.add("sortBy"); //style the clickable columns
      th.classList.remove("hidden"); //remove the filter on the thead (if any), the moment you add the uomTrack.js
    });
    // when the user chooses to add the class to the table
    table.classList.add("uomTrack"); // the class uomTrack will be assigned to the table
    addLibrary(); // the main code will run
    evt.target.innerHTML = "Remove uomTrack class";
  } else {
    // when the user chooses to remove the class from the table
    storeData();
    let done = convInpTableToTable(); //check if it is possible to convert the input table to a regular table
    if (done) {
      let ths = Array.from(document.querySelectorAll("th"));
      ths.map(th => {
        th.classList.remove("sortBy"); //remove style  from the clickable columns
      });
      evt.target.innerHTML = "Add uomTrack class";
    }
  }
}

function addLibrary() {
  //main function
  let rows = Array.from(document.querySelectorAll("tbody tr"));
  let ths = Array.from(document.querySelectorAll("th"));
  convTableToInpTable(rows); //convert the table to a table with input cells
  let thead = document.querySelector("thead"); //set event listeners for the column headers, in order to sort
  thead.addEventListener("click", function(evt) {
    ths.map(th => {
      th.classList.remove("selected"); //remove all the css style that still lingers on the thead, from the previous sort
    });
    let criterium = evt.target.innerHTML; // when the users clicks on an element of thead, will use that as a criterium to sort
    sort(criterium); //sort the table  and render it
    let tds = Array.from(document.querySelectorAll(`[data-th="${criterium}"]`)); //select the column used to sort with
    tds.map(td => {
      td.classList.add("selected"); //apply css style.
      setTimeout(() => {
        td.classList.remove("selected"); //remove the css style after 1.3 seconds
      }, 1300);
    });
  });

  table.addEventListener("input", evt => {
    //set up event listeners for the user to edit the cells, if he wishes
    editCells();
  });
  table.addEventListener("click", evt => {
    // set up event listeners for the user to copy or delete  a row, if he wishes
    if (evt.target.classList.contains("fa-paste")) {
      copyRow(evt);
    } else if (evt.target.classList.contains("fa-trash-alt")) {
      deleteRow(evt);
    }
  });
  setFooter(); //set the footer info , this function will also run every time the users copies/deletes  a row, or edits a cell, in order to update the footer
}

//---------------------------------------------- Helper Functions----------------------------------------------------//
function convTableToInpTable(rows) {
  //convert the non-editable table to an input table
  rows.map(r => {
    //for every row, get all the cells and store them in an array
    let cells = Array.from(r.cells);
    cells.map(c => {
      let data_th = c.getAttribute("data-th"); //in every row, set an input element and two icons, one for delete and one for copy
      let value = c.innerHTML;
      c.innerHTML = `<input type="text" name="${data_th}" placeholder="${value}" value="${value}">`;
      c.setAttribute("value", value);
    });
    r.innerHTML += `<p><i class='fas fa-paste'></i>&nbsp;<i class='far fa-trash-alt'></i>&nbsp;</p>`;
  });
}
function convInpTableToTable() {
  //convert the input table to a non-editable table
  let rows = Array.from(document.querySelectorAll("tbody tr")); //get all the rows
  if (rows.length === 0) {
    alert("you must have at least one row in the table!");
    return false;
  }
  rows.map(r => {
    //iterate over the rows and delete the icons for copy and delete row
    let p = r.querySelector("p");
    p.remove();
    let cells = Array.from(r.cells);
    cells.map(c => {
      let data_th = c.getAttribute("data-th"); //iterate over the cells and set the innerHTML of the td element to be the current value of the cell
      let value = c.getAttribute("value");
      c.innerHTML = value;
      c.setAttribute("value", value);
    });
  });
  let tbl = document.querySelector("table");
  tbl.classList.remove("uomTrack");
  let cloneTable = tbl.cloneNode(true); //clone the table in order to erase all lingering event listeners
  tbl.parentNode.replaceChild(cloneTable, tbl);
  return true;
}
function sort(criterium) {
  let rows = Array.from(document.querySelectorAll("tbody tr")); //get from the start the info for all rows, since the user may  have edited it
  let rowObjArr = getObjectsInArr(rows); //store the info of every row as an object: with (key, value) pairs = the (data_th,value) pairs of each cell. return an array of such objects
  //sort the array of objects (each object corresponds essentially to a row)
  if (criterium === "Ethnicity" || criterium === "Name") {
    rowObjArr.sort((a, b) => (a[criterium] > b[criterium] ? 1 : -1)); //sort with this function when sorting characters
  } else {
    rowObjArr.sort((a, b) => {
      return a[criterium] - b[criterium]; //sort with this function when sorting numbers
    });
    renderTable(rowObjArr, rows); //render the sorted table
    return [rowObjArr, rows];
  }
}

function getObjectsInArr(rows) {
  //store the info of every row as an object: with (key, value) pairs = the (data_th,value) pairs of each cell. return an array of such objects
  let rowObjArr = [];
  rows.map(r => {
    let rObj = {};
    let cells = r.cells;
    cells = Array.from(cells);
    cells.map(c => {
      let data_th = c.getAttribute("data-th");
      let value = c.getAttribute("value");
      rObj[data_th] = value;
    });
    rowObjArr.push(rObj);
  });
  return rowObjArr;
}
function renderTable(rowObjArr, rows) {
  //will accept as input the sorted!! object array (where every objects is essentially a row)
  //render the table after every new sort
  rows.map((r, i) => {
    r.remove(); //for every row: first remove said row
    let newRow = document.createElement("tr"); //then create new row
    table.querySelector("tbody").append(newRow); //append new row to the table
    Object.entries(rowObjArr[i]).map(c => {
      //convert every row object of key, value pairs  {c_k:c_v, c_k:c_v}  into an array [  c[k,v],c[k,v],c[k,v]   ] in order to iterate over the cells
      let data_th = c[0]; //store the key, value pairs  for every cell
      let value = c[1];
      let newCell = document.createElement("td"); //set a new cell for every object entry
      newCell.setAttribute(`data-th`, data_th); //set the attrubutes for the new cell
      newCell.setAttribute(`value`, value);
      newCell.innerHTML = `<input type="text" name="${data_th}" placeholder="${value}" value="${value}" >`;
      newRow.append(newCell); //append new cell to the new row
    });
    newRow.innerHTML += `<p><i class='fas fa-paste'></i>&nbsp;<i class='far fa-trash-alt'></i>&nbsp;</p>`; //append icons to the new row
  });
}
function editCells() {
  table.addEventListener("keyup", validateInput); //set up an event listener that evaluates the user input as the user types, based on regex
  table.addEventListener("focusout", feedback); //set up an event listener that either provides feedback in the case of incorrect input, or assumes the user input
}

function validateInput(evt) {
  //an event listener that evaluates the user input  based on regex
  let data_th = evt.target.name;
  let pattern; //the regex pattern against which, the user input is going to be evaluated
  let info; //the final feedback in case of incorrect user input
  if (data_th === "Ethnicity" || data_th === "Name") {
    pattern = /^[a-zA-Z\-]+$/;
    info = "Please fill in a name";
  } else if (data_th === "Final Rank") {
    pattern = /^[1-9]\d*$/;
    info = "Please fill in a number greater than 0";
  } else if (data_th === "Age") {
    pattern = /^[1-9][0-9]$/;
    info =
      "Please fill in an age number greater than 10 and less than 100 years old ";
  } else {
    pattern = /^\d{1,2}\.\d{1,2}$/;
    info = "Please fill in a number with 1 or 2 integers and 1 or 2 decimals";
  }
  let newInput = evt.target.value;
  //test the user input against the appropriate regex pattern
  if (pattern.test(newInput)) {
    //if the test checks out, assume the user input and set it as value, both on the input as well as on the td element
    evt.target.classList.remove("invalid"); //remove the class invalid from the input element
    evt.srcElement.setAttribute("value", newInput);
    evt.srcElement.parentElement.setAttribute("value", newInput);
  } else {
    //if the test does not check out, apply the class invalid to the input element, and set the info as attribute
    evt.target.setAttribute("info", info);
    evt.target.classList.add("invalid");
  }
}
function feedback(evt) {
  //depending on if the input element has the class invalid, or not, provide appropriate feedback
  let inputElem = evt.target;
  if (inputElem.classList.contains("invalid")) {
    inputElem.classList.remove("invalid");
    let info = inputElem.getAttribute("info");
    alert(info);
    inputElem.value = evt.srcElement.getAttribute("value"); // if the user has given in an incorrect value, assume the latest valid value
  }
  setFooter();
}

function setFooter() {
  let time;
  if (storedFilters.includes("Final Time")) {
    time = "Final Time";
  } else if (storedFilters.includes("Personal Best")) {
    time = "Personal Best";
  } else if (storedFilters.includes("Semi-Final time")) {
    time = "Semi-Final time";
  }
  if (time == undefined) return;
  //function that sets the info on tfoot. Will run on initial table render (see line 44), after every edit that the user makes (s. line 158), and after every row delete or copy (lines 177,188)
  [rowObjArr, rows] = sort(time); //will sort based on the final time
  let bestTime = rowObjArr[0][time]; //get the first  and last element of the array, corresponding to the best and worst time
  let worstTime = rowObjArr.at(-1)[time];
  const reducer = (accumulator, curr) => accumulator + curr;
  let avgTime = rowObjArr.map(r => Number(r[time])).reduce(reducer); //iterate over all the  rows, and add the value of the "Final Time" key, in order to get the average time
  avgTime = avgTime / rows.length; //divide by the number of rows/athletes
  avgTime = Math.round((avgTime + Number.EPSILON) * 100) / 100; //round up to 2 decimals
  document.querySelector(
    "tfoot tr td"
  ).innerHTML = `Best time: ${bestTime}s&nbsp;&nbsp;Worst time:${worstTime}s&nbsp;&nbsp;Average time:${avgTime}s`; //pass the info to the tfoot
}

function copyRow(evt) {
  let newRow = evt.target.parentElement.parentElement.cloneNode(true); //copy the row
  createRow(newRow); //create a row based on the copied row
  setFooter();
}
function deleteRow(evt) {
  let delRow = evt.target.parentElement.parentElement;
  if (delRow.parentElement.childElementCount === 1) {
    //if the row to be deleted is the last element of the tbody element
    let newLineBtn = document.createElement("button"); //create a button to give to the user the option to reimport last deleted line
    newLineBtn.setAttribute(`type`, "button");
    newLineBtn.setAttribute(`name`, "newLineBtn");
    newLineBtn.innerHTML = "Reimport last deleted line";
    newLineBtn.addEventListener("click", evt => {
      createRow(delRow); //set up event listener to said button
      setFooter();
    });
    document.querySelector("tfoot tr td").innerHTML = "";
    document.querySelector("tfoot tr td").appendChild(newLineBtn); // append said button to the dom, replacing the footer info
    delRow.remove(); //remove row
  } else {
    delRow.remove();
    setFooter();
  }
}
function createRow(newRow) {
  table.querySelector("tbody").append(newRow);
}
