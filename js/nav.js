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

let marker2 = new L.circle([0,0], {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 1,
    radius: 20
});

let startingPoint;
let endPoint;
let stairPoint = "Trepp_401";
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
            map.removeLayer(marker2);

            lastStart = startingPoint;
            lastEnd = endPoint;

            startingPoint = pA.value;
            endPoint = pB.value;

            let startBuilding;
            let endBuilding;
            let isSameFloor = false;
            let endIsOnCurrent = false;
            let startIsOnCurrent = false;
            let isStartLocked = false;
            let isEndLocked = false;
            let isMareUsed = false;
            let areBothMare = false;

            startBuilding = checkBuilding(startingPoint);
            endBuilding = checkBuilding(endPoint);
            isSameFloor = compareFloor(startingPoint, endPoint);
            endIsOnCurrent = checkFloor(endPoint);
            startIsOnCurrent = checkFloor(startingPoint);
            isStartLocked = checkIfInSpecial(startingPoint);
            isEndLocked = checkIfInSpecial(endPoint);
            isMareUsed = checkIfUsesMare(startBuilding, endBuilding);
            areBothMare = checkIfBothUseMare(startBuilding, endBuilding);

            //Floor checking
            if (!isSameFloor && !isMareUsed) {
                if(isStartLocked || isEndLocked){
                    if(isEndLocked){
                        if(currentFloor != 4 && currentFloor != 5 && startIsOnCurrent){
                            let stairs = [];
                            stairs = filterStairs(json);
                            let id = findNearestEle(stairs);
                            dijkstra = graph.findShortestPath(startingPoint, stairs[id]);
                            stairPoint = stairs[id];
                        }else if(currentFloor != 4 && currentFloor != 5 && !startIsOnCurrent){
                            
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
                                dijkstra = graph.findShortestPath(newStairPoint, "Trepp_404");
                                let dijkstra2 = graph.findShortestPath("LTrep_405", endPoint);
                                let temp = findCords(dijkstra2, json);
                                drawNavSpecial(temp);
                            }
                        }else if(currentFloor == 5){
                            dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                        }
                    }else if(isStartLocked){
                        if (currentFloor != 4 && currentFloor != 5 && endIsOnCurrent) {
                            let temp = stairPoint;
                            let newStairPoint;

                            newStairPoint = changeStairLevel(temp);
                            dijkstra = graph.findShortestPath(endPoint, newStairPoint);
                        } else if (currentFloor != 4 && currentFloor != 5 && !endIsOnCurrent) {
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
                            dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
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
            } else if (isSameFloor && !isMareUsed) {
                if (!isEndLocked && !isStartLocked) {
                    let room1 = checkFloor(startingPoint);
                    let room2 = checkFloor(endPoint);
                    if(room1 && room2){
                        dijkstra = graph.findShortestPath(startingPoint, endPoint);
                    }
                } else if (isEndLocked && isStartLocked) {
                    let room1 = checkFloor(startingPoint);
                    let room2 = checkFloor(endPoint);
                    if(room1 && room2){
                        dijkstra = graph.findShortestPath(startingPoint, endPoint);
                    }
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
            }else if(isMareUsed){
                if(isSameFloor){
                    if(areBothMare){
                        dijkstra = graph.findShortestPath(startingPoint, endPoint);
                    }else{
                        if(isStartLocked || isEndLocked){
                            if(isStartLocked){
                                if (currentFloor == 4) {
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

                                    let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                    dijkstra = graph.findShortestPath(newMareStairPoint, endPoint);
                                }else if(currentFloor == 5){
                                    dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                                }
                            }else if(isEndLocked){
                                if (currentFloor == 4) {
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
                                    let dijkstra2 = graph.findShortestPath("LTrep_405", endPoint);
                                    let temp = findCords(dijkstra2, json);
                                    drawNavSpecial(temp);

                                    let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                    dijkstra = graph.findShortestPath(startingPoint, newMareStairPoint);
                                }else if(currentFloor == 5){
                                    dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                                }
                            }
                        }else{
                            if(endBuilding == "Mare"){
                                let stairs = [];
                                stairs = filterStairs(json);
                                let id = findNearestEle(stairs);
                                dijkstra = graph.findShortestPath(startingPoint, stairs[id]);
                                stairPoint = stairs[id];
    
                                let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                let dijkstra2 = graph.findShortestPath(newMareStairPoint, endPoint);
                                let newCords = findCords(dijkstra2, json);
                                drawNavSpecial(newCords);
                            }else if(endBuilding != "Mare"){
                                stairPoint = "Trepp_401";
                                let newStairPoint = changeStairLevel(stairPoint);
                                dijkstra = graph.findShortestPath(startingPoint, newStairPoint);
    
                                let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                let dijkstra2 = graph.findShortestPath(startingPoint, newMareStairPoint);
                                let newCords = findCords(dijkstra2, json);
                                drawNavSpecial(newCords);
                            }
                        }
                    }
                }else if(!isSameFloor){
                    if(areBothMare){
                        if(startIsOnCurrent){
                            let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                            dijkstra = graph.findShortestPath(startingPoint, newMareStairPoint);
                        }else if(endIsOnCurrent){
                            let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                            dijkstra = graph.findShortestPath(newMareStairPoint, endPoint);
                        }else if(!startIsOnCurrent && !endIsOnCurrent){
                            let newMareStairPoint = changeStairLevelMare("TreppMare_201");

                            let sCords;
                            for (let i = 0; i < Object.keys(json).length; i++) {
                                if (json[i].point == newMareStairPoint) {
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
                    }else if(!areBothMare){
                        if(startIsOnCurrent){
                            if(startBuilding != "Mare"){
                                if(isStartLocked){
                                    if (currentFloor == 4) {
                                        let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                        dijkstra = graph.findShortestPath(startingPoint, newMareStairPoint);

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


                                        for (let i = 0; i < Object.keys(json).length; i++) {
                                            if (json[i].point == newMareStairPoint) {
                                                sCords = json[i].cords;
                                            }
                                        }

                                        marker2 = L.circle(sCords, {
                                            color: 'red',
                                            fillColor: 'red',
                                            fillOpacity: 1,
                                            radius: 20
                                        }).addTo(map);
    
                                        stairPoint = "Trepp_404";
                                        let dijkstra2 = graph.findShortestPath("LTrep_405", startingPoint);
                                        let temp = findCords(dijkstra2, json);
                                        drawNavSpecial(temp);
                                    }
                                }else if(currentFloor != 2){
                                    let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                    let sCords;

                                    for (let i = 0; i < Object.keys(json).length; i++) {
                                        if (json[i].point == newMareStairPoint) {
                                            sCords = json[i].cords;
                                        }
                                    }

                                    marker2 = L.circle(sCords, {
                                        color: 'red',
                                        fillColor: 'red',
                                        fillOpacity: 1,
                                        radius: 20
                                    }).addTo(map);

                                    let stairs = [];
                                    stairs = filterStairs(json);
                                    let id = findNearestEle(stairs);
                                    dijkstra = graph.findShortestPath(startingPoint, stairs[id]);

                                    stairPoint = stairs[id];
                                }else if(currentFloor == 2){
                                    dijkstra = graph.findShortestPath(startingPoint, "TreppMare_201");
                                }
                            }else if(startBuilding == "Mare"){
                                if(isStartLocked){
                                    if (currentFloor == 4) {
                                        let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                        dijkstra = graph.findShortestPath(newMareStairPoint, startingPoint);

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
                                        let dijkstra2 = graph.findShortestPath("LTrep_405", endPoint);
                                        let temp = findCords(dijkstra2, json);
                                        drawNavSpecial(temp);
                                    }else if(currentFloor == 5){
                                        dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                                    }
                                }else if(isEndLocked){
                                    if (currentFloor == 4) {
                                        let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                        dijkstra = graph.findShortestPath(newMareStairPoint, startingPoint);

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
                                        let dijkstra2 = graph.findShortestPath("LTrep_405", endPoint);
                                        let temp = findCords(dijkstra2, json);
                                        drawNavSpecial(temp);
                                    }else if(currentFloor == 5){
                                        let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                        dijkstra = graph.findShortestPath(startingPoint, newMareStairPoint);

                                        dijkstra2 = graph.findShortestPath("Trepp_504", "LTrep_505");
                                        let temp = findCords(dijkstra2, json);
                                        drawNavSpecial(temp);
                                    }
                                }
                                else if(currentFloor != 2){
                                    let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                    dijkstra = graph.findShortestPath(startingPoint, newMareStairPoint);
                                }else{
                                    let stairs = [];
                                    stairs = filterStairs(json);
                                    let id = findNearestEle(stairs);
                                    dijkstra = graph.findShortestPath(startingPoint, stairs[id]);

                                    stairPoint = stairs[id];
                                }
                            }
                        }else if(endIsOnCurrent){
                            if(endBuilding != "Mare"){
                                if(currentFloor != 2){
                                    if(isEndLocked){
                                        if (currentFloor == 4) {
                                            let newMareStairPoint = changeStairLevelMare("TreppMare_201");
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

                                            for (let i = 0; i < Object.keys(json).length; i++) {
                                                if (json[i].point == newMareStairPoint) {
                                                    sCords = json[i].cords;
                                                }
                                            }
        
                                            marker2 = L.circle(sCords, {
                                                color: 'red',
                                                fillColor: 'red',
                                                fillOpacity: 1,
                                                radius: 20
                                            }).addTo(map);
        
                                            stairPoint = "Trepp_404";
                                            let dijkstra2 = graph.findShortestPath("LTrep_405", endPoint);
                                            let temp = findCords(dijkstra2, json);
                                            drawNavSpecial(temp);
                                        }
                                    }else{
                                        dijkstra = graph.findShortestPath(stairPoint, endPoint);
                                    }
                                }else if(currentFloor == 2){
                                    dijkstra = graph.findShortestPath("TreppMare_201", endPoint);
                                }
                            }else if(endBuilding == "Mare"){
                                if(isStartLocked){
                                    let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                    dijkstra2 = graph.findShortestPath(newMareStairPoint, endPoint);
                                    let temp = findCords(dijkstra2, json);
                                    drawNavSpecial(temp);

                                    dijkstra = graph.findShortestPath("Trepp_504", "LTrep_505");
                                }else if(currentFloor != 2){
                                    let newMareStairPoint = changeStairLevelMare("TreppMare_201");
                                    dijkstra = graph.findShortestPath(newMareStairPoint, endPoint);
                                }else{
                                    let newStairPoint = changeStairLevel(stairPoint);
                                    dijkstra = graph.findShortestPath(newStairPoint, endPoint);
                                }
                            }
                        }else if(!endIsOnCurrent && !startIsOnCurrent){
                            if(currentFloor == 2){
                                let newStairPoint = changeStairLevel(stairPoint);
                                dijkstra = graph.findShortestPath(newStairPoint, "TreppMare_201");
                            }else{
                                let newMareStairPoint = changeStairLevelMare("TreppMare_201");

                                let sCords;
                                for (let i = 0; i < Object.keys(json).length; i++) {
                                    if (json[i].point == newMareStairPoint) {
                                        sCords = json[i].cords;
                                    }
                                }

                                marker = L.circle(sCords, {
                                    color: 'red',
                                    fillColor: 'red',
                                    fillOpacity: 1,
                                    radius: 20
                                }).addTo(map);

                                let newStairPoint = changeStairLevel(stairPoint);
    
                                for (let i = 0; i < Object.keys(json).length; i++) {
                                    if (json[i].point == newStairPoint) {
                                        sCords = json[i].cords;
                                    }
                                }
    
                                marker2 = L.circle(sCords, {
                                    color: 'red',
                                    fillColor: 'red',
                                    fillOpacity: 1,
                                    radius: 20
                                }).addTo(map);                                
                            }
                        }
                    }
                }
            }
            if (dijkstra != null) {
                let temp = findCords(dijkstra, json);
                drawNav(temp);
            }
        }
    }else{
        map.removeLayer(path);
        map.removeLayer(path2);
        map.removeLayer(marker);
        map.removeLayer(marker2);
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
/*
function changeFloor(floor){
    currentFloor = floor;
}*/

//changes stair floor
function changeStairLevel(currentStair){
    let temp = currentStair;
    let newStairPoint;

    if(temp.includes("Trepp_")){
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
        let diff;

        if(stairId.charAt(0) > currentFloor){
            diff = stairId.charAt(0) - currentFloor;
            newStairPoint = "Lift_"+(Number.parseInt(stairId)-(diff*100));

        }else if(stairId.charAt(0) < currentFloor){
            diff = currentFloor - stairId.charAt(0);
            newStairPoint = "Lift_"+(Number.parseInt(stairId)+(diff*100));

        }
    }

    return newStairPoint;
}

function changeStairLevelMare(currentStair){
    let temp = currentStair;
    let newStairPoint;

    if(temp.includes("TreppMare_")){
        let stairId = temp.charAt(10) + temp.charAt(11) + temp.charAt(12);
        let diff;

        if(stairId.charAt(0) > currentFloor){
            diff = stairId.charAt(0) - currentFloor;
            newStairPoint = "TreppMare_"+(Number.parseInt(stairId)-(diff*100));
        }else if(stairId.charAt(0) < currentFloor){
            diff = currentFloor - stairId.charAt(0);
            newStairPoint = "TreppMare_"+(Number.parseInt(stairId)+(diff*100));
        }else if(stairId.charAt(0) == currentFloor){
            newStairPoint = temp;
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

        if (stair.includes("Trepp_") || stair.includes("Lift")) {
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

function checkIfUsesMare(start, end){
    if(start == "Mare" || end == "Mare"){
        return true;
    }else{
        return false;
    }
}

function checkIfBothUseMare(start, end){
    if(start == "Mare" && end == "Mare"){
        return true;
    }else{
        return false;
    }
}