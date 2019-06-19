/*jshint esversion:6*/

let path = new L.Polyline([0,0], {
    color: 'red',
    weight: 20,
    opacity: 0,
    smoothFactor: 1
});

let path2 = new L.Polyline([0,0], {
    color: 'red',
    weight: 20,
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
let bounds = [[0, 0], [5000, 5000]];

let roomCords = null;
let lastStart;
let lastEnd;

$.ajax({
    dataType: "json",
    async: false,
    url: "./json/network.json",
    'success': function (json) {
        roomCords = json;
    }
});

levelControl.addEventListener("levelchange",function(){
    buttonPress(roomCords);
    changeMap();
});

console.log(getCurrentFloor());
//Main navigation logic
function buttonPress(json) {
    let pA = document.getElementById('from');
    let pB = document.getElementById('to');

    if (getCurrentFloor() != null) {
        if (pA.value != "" && pB.value != "") {

            let navJSON = null;
            let dijkstra;

            currentFloor = getCurrentFloor();

            $.ajax({
                dataType: "json",
                async: false,
                url: "./json/pathing.json",
                'success': function (json) {
                    navJSON = json;
                }
            });

            let graph = new Graph(navJSON);

            map.removeLayer(path);
            map.removeLayer(path2);
            map.removeLayer(marker);

            lastStart = startingPoint;
            lastEnd = endPoint;

            console.log("Algus enne: " + lastStart + ", Lõpp enne: " + lastEnd);


            startingPoint = pA.value;
            endPoint = pB.value;

            /*if (lastStart != startingPoint && lastEnd != endPoint) {
                stairPoint = "";
            }*/
            console.log("Algus nüüd: " + startingPoint + ", Lõpp nüüd: " + endPoint);

            let startBuilding;
            let endBuilding;
            let isSameFloor = false;
            let endIsOnCurrent = false;
            let startIsOnCurrent = false;
            let isStartLocked = false;
            let isEndLocked = false;

            startBuilding = checkBuilding(startingPoint);
            endBuilding = checkBuilding(endPoint);
            isSameFloor = compareFloor(startingPoint, endPoint);
            endIsOnCurrent = checkFloor(endPoint);
            startIsOnCurrent = checkFloor(startingPoint);
            isStartLocked = checkIfInSpecial(startingPoint);
            isEndLocked = checkIfInSpecial(endPoint);

            //Floor checking
            if (!isSameFloor) {
                if(isStartLocked || isEndLocked){
                    if(isEndLocked){
                        if(currentFloor != 4 && currentFloor != 5 && startIsOnCurrent){
                            let stairs = [];
                            stairs = filterStairs(json);
                            let id = findNearestEle(stairs);
                            dijkstra = graph.findShortestPath(startingPoint, stairs[id]);
                            stairPoint = stairs[id];
                        }else if(currentFloor != 4 && currentFloor != 5 && !startIsOnCurrent){
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
                        }else if(currentFloor == 4){
                            let newS = stairPoint;
                            let newStairPoint;

                            newStairPoint = changeStairLevel(newS);

                            if(newStairPoint == "Trepp_404"){
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

                                let dijkstra2 = graph.findShortestPath("LTrep_405", endPoint);
                                let temp = findCords(dijkstra2, json);
                                drawNavSpecial(temp);
                            }else if(newStairPoint != "Trepp_404"){
                                
                                console.log("questionmark");
                                dijkstra = graph.findShortestPath(newStairPoint, "Trepp_404");
                                let dijkstra2 = graph.findShortestPath("LTrep_405", endPoint);
                                let temp = findCords(dijkstra2, json);
                                drawNavSpecial(temp);
                            }
                        }else if(currentFloor == 5){
                            console.log("questionmark2");
                            dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                            console.log(dijkstra);
                        }
                    }else if(isStartLocked){
                        if (currentFloor != 4 && currentFloor != 5 && endIsOnCurrent) {
                            let temp = stairPoint;
                            console.log(temp);
                            let newStairPoint;

                            newStairPoint = changeStairLevel(temp);
                            dijkstra = graph.findShortestPath(endPoint, newStairPoint);
                        } else if (currentFloor != 4 && currentFloor != 5 && !endIsOnCurrent) {
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
                        } else if (currentFloor == 4) {
                            let sCords;
                            for (let i = 0; i < Object.keys(json).length; i++) {
                                if (json[i].point == "Trepp_404") {
                                    sCords = json[i].cords;
                                }
                            }

                            marker = L.circle(sCords, {
                                color: 'red',
                                fillColor: 'red',
                                fillOpacity: 1,
                                radius: 20
                            }).addTo(map);

                            stairPoint = "Trepp_404";
                            let dijkstra2 = graph.findShortestPath("LTrep_405", startingPoint);
                            let temp = findCords(dijkstra2, json);
                            drawNavSpecial(temp);
                        } else if (currentFloor == 5) {
                            console.log("questionmark2");
                            dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                            console.log(dijkstra);
                        }
                    }
                }else if (startIsOnCurrent) {
                    let stairs = [];
                    stairs = filterStairs(json);
                    let id = findNearestEle(stairs);
                    dijkstra = graph.findShortestPath(startingPoint, stairs[id]);

                    stairPoint = stairs[id];
                } else if (endIsOnCurrent) {
                    let temp = stairPoint;
                    let newStairPoint = changeStairLevel(temp);
                    dijkstra = graph.findShortestPath(newStairPoint, endPoint);
                } else if (!startIsOnCurrent && !endIsOnCurrent) {
                    let temp = stairPoint;
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
                }
            } else if (isSameFloor) {
                if (!isEndLocked && !isStartLocked) {
                    dijkstra = graph.findShortestPath(startingPoint, endPoint);
                } else if (isEndLocked && isStartLocked) {
                    dijkstra = graph.findShortestPath(startingPoint, endPoint);
                } else if (isEndLocked && !isStartLocked) {
                    if(currentFloor == 4){
                        dijkstra = graph.findShortestPath(startingPoint, "Trepp_404");
                        let dijkstra2 = graph.findShortestPath("LTrep_405", endPoint);
                        let temp = findCords(dijkstra2, json);
                        drawNavSpecial(temp);
                    }else if(currentFloor == 5){
                        dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                    }
                } else if (!isEndLocked && isStartLocked) {
                    if(currentFloor == 4){
                        dijkstra = graph.findShortestPath("Trepp_404", endPoint);
                        let dijkstra2 = graph.findShortestPath(startingPoint, "LTrep_405");
                        let temp = findCords(dijkstra2, json);
                        drawNavSpecial(temp);
                    }else if(currentFloor == 5){
                        dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                    }
                }
            }
            if (dijkstra != null) {
                let temp = findCords(dijkstra, json);
                drawNav(temp);
            }
        }
    }
}

//Both check floors
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

//Finds elevator/stair
function findNearestEle(stairs){
    let navJSON = null;

    $.ajax({
        dataType: "json",
        async: false, // Makes sure to wait for load
        url: "./json/pathing.json",
        'success': function (json) {
            navJSON = json;
            console.log(json);
        }
    });

    let graph = new Graph(navJSON);
    
    let shortestId;
    let shortestWay = 10000000;
    for (let i = 0; i < stairs.length; i++) {
        let toStair = graph.findShortestPath(startingPoint, stairs[i]);
        if (toStair.length < shortestWay) {
            shortestId = i;
            shortestWay = toStair.length;
        }
    }

    return shortestId;
}
//change floor
function changeFloor(floor){
    currentFloor = floor;
}
//changes stair floor
function changeStairLevel(currentStair){
    let temp = currentStair;
    let newStairPoint;

    if(temp.includes("Trepp")){
        let stairId = temp.charAt(6) + temp.charAt(7) + temp.charAt(8);
        let diff;

        if(stairId.charAt(0) > currentFloor){
            diff = stairId.charAt(0) - currentFloor;
            newStairPoint = "Trepp_"+(Number.parseInt(stairId)-(diff*100));

        }else if(stairId.charAt(0) < currentFloor){
            diff = currentFloor - stairId.charAt(0);
            newStairPoint = "Trepp_"+(Number.parseInt(stairId)+(diff*100));

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

    return newStairPoint;
}

//Coordinates for dijkstra
function findCords(array, json){
    let points = [];
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

//draws on map
function drawNav(array){
    path = new L.Polyline(array, {
        color: 'red',
        weight: 20,
        opacity: 1,
        smoothFactor: 1
    });

    path.addTo(map);
}

function drawNavSpecial(array){
    path2 = new L.Polyline(array, {
        color: 'red',
        weight: 20,
        opacity: 1,
        smoothFactor: 1
    });

    path2.addTo(map);
}

//Filters all stairs
function filterStairs(json){
    let stairs = [];
    for (let i = 0; i < Object.keys(json).length; i++) {
        let stair = json[i].point;

        if (stair.includes("Trepp") || stair.includes("Lift")) {
            if(stair.charAt(6) == currentFloor){
                stairs.push(json[i].point);
            }
        }
    }

    return stairs;
}

//Checks if a point is in the locked corridor
function checkIfInSpecial(point){
    let isSpecial = false;
    let special = ["A410", "A411", "A412", "A413", "A414", "A415", "A416", "A417"];
    for(let i = 0; i < special.length; i++){
        if(point.includes(special[i])){
            isSpecial = true;
        }
    }

    return isSpecial;
}
function checkBuilding(point) {
    let building;
    let check = point.charAt(0);

    switch (check) {
        case "A":
            building = "Astra";
            break;
        case "T":
            building = "Terra";
            break;
        case "M":
            building = "Mare";
            break;
        case "S":
            building = "Silva";
            break;
    }

    return building;
}

function getCurrentFloor(){
    let cFloor = indoorLayer.getLevel();

    return cFloor;
}

function changeMap(){
    let picFloor = getCurrentFloor();
    map.removeLayer(overlayImage);

    overlayImage = L.imageOverlay("./images/TLU_"+ picFloor +".jpg", imageBounds).addTo(map);
}