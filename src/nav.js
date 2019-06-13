/*jshint esversion:6*/
let map = L.map('map', {
    crs: L.CRS.Simple,
});

map.doubleClickZoom.disable(); 

let path = new L.Polyline([0,0], {
    color: 'red',
    weight: 10,
    opacity: 0,
    smoothFactor: 1
});

let path2 = new L.Polyline([0,0], {
    color: 'red',
    weight: 10,
    opacity: 0,
    smoothFactor: 1
});

let marker = new L.circle([0,0], {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 1,
    radius: 20
});

let startingPoint;
let endPoint;
let stairPoint;
let currentFloor = 4;
let bounds = [[0, 0], [1191, 1684]];
let image = L.imageOverlay('./assets/a-4.jpg', bounds).addTo(map);
let roomCords = null;
let lastStart;
let lastEnd;
map.fitBounds(bounds);

let myControl = L.control({position: 'topright'});
myControl.onAdd = function(map) {
    this._div = L.DomUtil.create('div', myControl);
    this._div.innerHTML = '<input type = "text" id = "PointA"/>' + '<input type = "text" id = "PointB"/>' + '<br>' + '<button type="button" id="search">Otsi tee</button>'
    return this._div;
};

myControl.addTo(map);

$.ajax({
    dataType: "json",
    async: false,
    url: "./src/network.json",
    'success': function (json) {
        roomCords = json;
        console.log(json);
    }
});

console.log(roomCords[1].cords);

$('#search').on('click', ()=> buttonPress(roomCords));

//Nupu vajutuse tarvis
function buttonPress(json) {
    let pA = document.getElementById('PointA');
    let pB = document.getElementById('PointB');

    if (pA.value != "" && pB.value != "") {
        
        let tempJSON = null;

        $.ajax({
            dataType: "json",
            async: false, 
            url: "./src/floor-"+currentFloor+".json",
            'success': function (json) {
                tempJSON = json;
                console.log(json);
            }
        });

        let graph = new Graph(tempJSON);

        map.removeLayer(path);
        map.removeLayer(path2);
        map.removeLayer(marker);

        lastStart = startingPoint;
        lastEnd = endPoint;

        startingPoint = pA.value;
        endPoint = pB.value;

        let isSameFloor = false;
        let endIsOnCurrent = false;
        let startIsOnCurrent = false;
        let isStartSpecial = false;
        let isEndSpecial = false;

        let dijkstra;

        isSameFloor = compareFloor(startingPoint, endPoint);
        endIsOnCurrent = checkFloor(endPoint);
        startIsOnCurrent = checkFloor(startingPoint);
        isStartSpecial = checkIfInSpecial(startingPoint);
        isEndSpecial = checkIfInSpecial(endPoint);

        /* *
         * TODO: Hiljem kui on mitu JSONi on vaja lisada ka jsoni valimine
         * navigeerimise jaoks kasutades korruse kontrolli
         */

        //Korruse kontroll
        if (!isSameFloor && startIsOnCurrent) {
            //Kui algus ja lõpp pole samal korrusel aga praegune korrus on algusega sama
            let stairs = [];
            stairs = filterStairs(json);

            //Lähim lift/trepp
            let id = findNearestELe(stairs);
            dijkstra = graph.findShortestPath(startingPoint, stairs[id]);

            stairPoint = stairs[id];
            console.log(stairPoint);

        } else if (!isSameFloor && endIsOnCurrent) {
            //Kui algus ja lõpp pole samal korrusel aga praegune korrus on algusega sama
            let temp = stairPoint;
            let newStairPoint = changeStairLevel(temp);

            console.log(newStairPoint);
            dijkstra = graph.findShortestPath(newStairPoint, endPoint);

        } else if (!isSameFloor && !startIsOnCurrent && !endIsOnCurrent) {
            //Kui praegune korrus on algus ja lõpp korruse vahel
            let temp = stairPoint;
            console.log(temp);
            let newStairPoint;

            newStairPoint = changeStairLevel(temp);

            let sCords;
            for (let i = 0; i < Object.keys(json).length; i++) {
                if (json[i].point == newStairPoint) {
                    sCords = json[i].cords;
                }
            }

            marker = L.circle(sCords, {
                color: 'red',
                fillColor: 'red',
                fillOpacity: 1,
                radius: 20
            }).addTo(map);

        } else if (isSameFloor && !isEndSpecial && !isStartSpecial) {
            //Kui algus ja lõpp asuvad samal korrusel
            console.log("I'm in");
            dijkstra = graph.findShortestPath(startingPoint, endPoint);
        } else if (isEndSpecial && !isStartSpecial){
            if(currentFloor == 4){
                dijkstra = graph.findShortestPath(startingPoint, "Trepp_404");
                let dijkstra2 = graph.findShortestPath("Trepp_403",endPoint);
                let temp = findCords(dijkstra2, json);
                drawNavSpecial(temp);
            }
        } else if (!isEndSpecial && isStartSpecial){
            if(currentFloor == 4){
                dijkstra = graph.findShortestPath("Trepp_404", endPoint);
                let dijkstra2 = graph.findShortestPath(startingPoint,"Trepp_403");
                let temp = findCords(dijkstra2, json);
                drawNavSpecial(temp);
            }
        } else if (isSameFloor && isEndSpecial && isStartSpecial){
            dijkstra = graph.findShortestPath(startingPoint, endPoint);
        }

        if (dijkstra != null) {
            let temp = findCords(dijkstra, json);
            drawNav(temp);
            console.log(temp);
        }
    }
}

//Need mõlemad tegelevad korruste kontrolliga
function compareFloor(pointA, pointB){
    if(pointA.charAt(1) == pointB.charAt(1)){
        return true;
    }else if(pointA.charAt(1) != pointB.charAt){
        return false;
    } 
}

function checkFloor(room){
    if(room.charAt(1) != currentFloor){
        return false;
    }else if(room.charAt(1) == currentFloor){
        return true;
    }
}

//Leiab lähima trepi/lifti
function findNearestELe(stairs){
    let tempJSON = null;

    $.ajax({
        dataType: "json",
        async: false, // Makes sure to wait for load
        url: "./src/floor-" + currentFloor + ".json",
        'success': function (json) {
            tempJSON = json;
            console.log(json);
        }
    });

    let graph = new Graph(tempJSON);
    
    let shortestId;
    let shortestWay = 10000000;
    for (let i = 0; i < stairs.length; i++) {
        let temp = graph.findShortestPath(startingPoint, stairs[i]);
        if (temp.length < shortestWay) {
            shortestId = i;
            shortestWay = temp.length;
        }
    }

    return shortestId;
}
//Muudab korrust
function changeFloor(floor){
    currentFloor = floor;
}
//Muudab trepi korrust
function changeStairLevel(currentStair){
    let temp = currentStair;
    let newStairPoint;

    console.log(temp);
    if(temp.includes("Trepp")){
        let stairId = temp.charAt(6) + temp.charAt(7) + temp.charAt(8);
        let diff;
        console.log(stairId.charAt(0));

        if(stairId.charAt(0) > currentFloor){
            diff = stairId.charAt(0) - currentFloor;
            newStairPoint = "Trepp_"+(Number.parseInt(stairId)-(diff*100));
            console.log("Yeet");

        }else if(stairId.charAt(0) < currentFloor){
            diff = currentFloor - stairId.charAt(0);
            newStairPoint = "Trepp_"+(Number.parseInt(stairId)+(diff*100));
            console.log("Yeet");

        }
    }else if(temp.includes("Lift")){
        let stairId = temp.charAt(5) + temp.charAt(6) + temp.charAt(7);
        console.log(stairId);
        let diff;

        if(stairId.charAt(0) > currentFloor){
            diff = stairId.charAt(0) - currentFloor;
            newStairPoint = "Lift_"+(Number.parseInt(stairId)-(diff*100));

        }else if(stairId.charAt(0) < currentFloor){
            diff = currentFloor - stairId.charAt(0);
            console.log(stairId + (diff*100));
            newStairPoint = "Lift_"+(Number.parseInt(stairId)+(diff*100));

        }
    }
    console.log("LIF ON:");
    console.log(newStairPoint);
    return newStairPoint;
}

//Kordinaadid dijkstra jaoks
function findCords(array, json){
    let points = [];
    console.log(array);
    for(let i = 0; i < array.length; i++){
        let temp = array[i];
        for(let i = 0; i < Object.keys(json).length; i++){
            if(temp == json[i].point){
                points.push(new L.latLng(json[i].cords));
            }
        }
    }
    return points;
}

//Joonistab kaardile
function drawNav(array){
    path = new L.Polyline(array, {
        color: 'red',
        weight: 10,
        opacity: 1,
        smoothFactor: 1
    });

    path.addTo(map);
}

function drawNavSpecial(array){
    path2 = new L.Polyline(array, {
        color: 'red',
        weight: 10,
        opacity: 1,
        smoothFactor: 1
    });

    path2.addTo(map);
}

//Otsib trepid
function filterStairs(json){
    let stairs = [];
    for (let i = 0; i < Object.keys(json).length; i++) {
        let stair = json[i].point;

        if (stair.includes("Trepp") || stair.includes("Lift")) {
            stairs.push(json[i].point);
        }
    }

    return stairs;
}

//Kontrollib kas sisestatud tuba asub selles halvas kohas
function checkIfInSpecial(point){
    let isSpecial = false;
    let special = ["A410", "A411", "A412", "A413", "A414", "A415", "A416", "A417"];
    for(let i = 0; i < special.length; i++){
        if(point.includes(special[i])){
            console.log(0);
            isSpecial = true;
        }
    }

    return isSpecial;
}