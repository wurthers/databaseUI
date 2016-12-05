
document.addEventListener("DOMContentLoaded", loadTable);
document.addEventListener("DOMContentLoaded", bindButtons);

function loadTable(event) {

	var req = new XMLHttpRequest();
	req.open("GET", "http://localhost:3000", true);

	req.addEventListener('load', function(){
    
    	if(req.status >= 200 && req.status < 400){
			var tableData = JSON.parse(req.response);
			updateTable(tableData);

		}
	});

	req.send(null);
}


function bindButtons() {

	var submit = document.getElementById("submitRow");
	var reset = document.getElementById("resetTable");

	submit.addEventListener('click', function(event){

		var req = new XMLHttpRequest();
		var longUrl = "http://localhost:3000/insert?";

		longUrl += "name=" + document.getElementById("name").value;
		longUrl += "&reps=" + document.getElementById("reps").value;
		longUrl += "&weight=" + document.getElementById("weight").value;
		longUrl += "&date=" + document.getElementById("date").value;

		if (document.getElementById("lbs").checked)
			longUrl += "&lbs=1";

		else
			longUrl += "&lbs=0";


		req.open("GET", longUrl, true);

		req.addEventListener('load', function(){
			if (req.status >= 200 && req.status < 400){
				loadTable();
			}
		});

		req.send(null);
		event.preventDefault();

	});

	reset.addEventListener('click', function(){
		var req = new XMLHttpRequest();
		req.open("GET", "http://localhost:3000/reset-table", true);

		req.addEventListener('load', function(){
			if (req.status >= 200 && req.status < 400){
				loadTable();
			}
		});

		req.send(null);

	});
}



function updateTable(tableData) {

	var table = document.getElementById("workouts");
	var numRows = table.lastChild.id || 0;

	if (tableData.length == 0){
		while (table.childNodes.length > 2)	//Accounting for implicit tbody element
			table.removeChild(table.lastChild);
	}

	if (tableData.length > numRows) {
		while (table.lastChild.id > numRows)
			table.removeChild.lastChild
	}

	for (i = numRows; i < tableData.length; i++){

		var object = tableData[i];
		console.log(object);

		var newRow = document.createElement("tr");
		newRow.id = object.id;
		
		var name = document.createElement("td");
		var reps = document.createElement("td");
		var weight = document.createElement("td");
		var date = document.createElement("td");
		var id = document.createElement("td");

		name.textContent = object.name;
		reps.textContent = object.reps;
		weight.textContent = object.weight;
		date.textContent = object.date;

		if (object.lbs == 1){
			weight.textContent += " lbs";
		}

		else{
			weight.textContent += " kg";
		}

		var buttons = document.createElement("td");
		var deleteUpdate = document.createElement("form");

		var hiddenId = document.createElement("input");
		hiddenId.type = "hidden";
		hiddenId.value = object.id;

		var deleteButton = document.createElement("input");
		deleteButton.type = "button";
		deleteButton.value = "Delete";

		var updateButton = document.createElement("input");
		updateButton.type = "button";
		updateButton.value = "Update";

		deleteUpdate.appendChild(hiddenId);
		deleteUpdate.appendChild(updateButton);
		deleteUpdate.appendChild(deleteButton);


		deleteButton.addEventListener('click', function(){
			var req = new XMLHttpRequest();
			req.open("GET", "http://localhost:3000/delete?id=" + object.id, true);

			req.addEventListener('load', function(){
				if (req.status >= 200 && req.status < 400){
					loadTable();
				}
			});

			req.send(null);

		});


		newRow.appendChild(name);
		newRow.appendChild(reps);
		newRow.appendChild(weight);
		newRow.appendChild(date);

		newRow.appendChild(buttons);
		buttons.appendChild(deleteUpdate);

		table.appendChild(newRow);
	
	}


}



// updateButton.addEventListener('click', function(event){
// 	var req = new XMLHttpRequest();

// 	var longUrl = "http://localhost:3000/update?id=" + object.id;
// 	longUrl += "&name=" + document.getElementById("name").value;
// 	longUrl += "&reps=" + document.getElementById("reps").value;
// 	longUrl += "&weight=" + document.getElementById("weight").value;
// 	longUrl += "&date=" + document.getElementById("date").value;
// 	longUrl += "&lbs=" + document.getElementById("lbs").value;

// 	req.open("GET", longUrl, true);

// 	req.addEventListener('load', function(){
// 		if (req.status >= 200 && req.status < 400){
// 			loadTable();
// 		}
// 	});

// 	req.send(null);

// });





