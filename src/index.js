/*jshint esversion:6*/
let map = L.map('map', {
    crs: L.CRS.Simple,
});

let path = new L.Polyline([0,0], {
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
let stairPoint = "Lift_502";
let currentFloor = 4;
let bounds = [[0, 0], [1191, 1684]];
let image = L.imageOverlay('./assets/a-4.jpg', bounds).addTo(map);
map.fitBounds(bounds);

let myControl = L.control({position: 'topright'});
myControl.onAdd = function(map) {
    this._div = L.DomUtil.create('div', myControl);
    this._div.innerHTML = '<input type = "text" id = "PointA"/>' + '<input type = "text" id = "PointB"/>' + '<br>' + '<button type="button" id="search">Otsi tee</button>'
    return this._div;
};

myControl.addTo(map);

$('#search').on('click', ()=> buttonPress(testJSON));
//Routing
//let mappper = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}}
/*
*A543: 256,910 = 281,1428
*A427: 256,807
*A426: 333,807
*/

let testJSON = [
    {
        point: "A431",
        cords: [231,256]  
    },
    {
        point: "Point_408",
        cords: [231,206]
    },
    {
        point: "Lift_401",
        cords: [181,206]
    },
    {
        point: "Trepp_402",
        cords: [331, 206]
    },
    {
        point: "A543",
        cords: [281,256]
    },
    {
        point: "A427",
        cords: [384,256]
    },
    {
        point: "A426",
        cords: [384,333]
    },
    {
        point: "A425",
        cords: [384,383]
    },
    {
        point: "A424",
        cords: [384, 433]
    },
    {
        point: "A423",
        cords: [384, 513]
    },
    {
        point: "A428",
        cords: [384, 513]
    },
    {
        point: "A429",
        cords: [384, 513]
    },
    {
        point: "A406",
        cords: [384, 577]
    },
    {
        point: "A439",
        cords: [384, 677]
    },
    {
        point: "A422",
        cords: [384, 757]
    },
    {
        point: "A421",
        cords: [384, 877]
    },
    {
        point: "A433",
        cords: [384, 897]
    },
    {
        point: "A434",
        cords: [384, 1007]
    },
    {
        point: "Point_401",
        cords: [384, 1070]
    },
    {
        point: "Point_402",
        cords: [354, 1150]
    },
    {
        point: "A403",
        cords: [404, 1150]
    },
    {
        point: "A402",
        cords: [464, 1150]
    },
    {
        point: "Point_403",
        cords: [664, 1125]
    },
    {
        point: "Point_404",
        cords: [744, 1125]
    },
    {
        point: "Point_405",
        cords: [744, 985]
    },
    {
        point: "A435",
        cords: [744, 950]
    },
    {
        point: "Point_406",
        cords: [850, 985]
    },
    {
        point: "Trepp_401",
        cords: [950, 985]
    },
    {
        point: "A438",
        cords: [455, 577]
    },
    {
        point: "A440",
        cords: [505, 577]
    },
    {
        point: "A445",
        cords: [575, 577]
    },
    {
        point: "Point_407",
        cords: [680, 577]
    },
    {
        point: "S427",
        cords: [850, 577]
    },
    {
        point: "S428",
        cords: [850, 627]
    },
    {
        point: "S417",
        cords: [850, 627]
    },
    {
        point: "S416",
        cords: [850, 757]
    },
    {
        point: "S415",
        cords: [850, 857]
    },
    {
        point: "Point_409",
        cords: [680, 500]
    },
    {
        point: "A447",
        cords: [635, 450]
    },
    {
        point: "S402",
        cords: [850, 1085]
    },
    {
        point: "S412",
        cords: [850, 1185]
    },
    {
        point: "S403",
        cords: [850, 1340]
    },
    {
        point: "S408",
        cords: [850, 1460]
    },
    {
        point: "S409",
        cords: [800, 1460]
    },
    {
        point: "S410",
        cords: [800, 1390]
    },
    {
        point: "A413",
        cords: [640, 1460]
    },
    {
        point: "A414",
        cords: [640, 1460]
    },
    {
        point: "A412",
        cords: [600, 1460]
    },
    {
        point: "A415",
        cords: [600, 1460]
    },
    {
        point: "A416",
        cords: [550, 1460]
    },
    {
        point: "A411",
        cords: [480, 1460]
    },
    {
        point: "S4100",
        cords: [430, 1460]
    },
    {
        point: "Point_410",
        cords: [330, 1460]
    },
    {
        point: "Trepp_403",
        cords: [330, 1540]
    },
    {
        point: "Trepp_404",
        cords: [334, 1007]
    },
    {
        point: "Point_411",
        cords: [744, 1055]
    },
    {
        point: "Lift_402",
        cords: [694, 1055]
    }
];

console.log(testJSON[1].point);

//Dijkstra
let mappper = {
    A431:{A543:50,Point_408:50},
    Point_408:{A431:50, Lift_401:50, Trepp_402:100},
    Lift_401:{Point_408:50},
    Trepp_402:{Point_408:100},
    A543:{A427:103, A431:50},
    A427:{A543:103, A426:77},
    A426:{A427:77,A425:60},
    A425:{A426:60, A424:50},
    A424:{A425:50, A423:80},
    A423:{A424:80, A428:1, A406:50},
    A428:{A423:1, A429:1},
    A429:{A428:1},
    A406:{A423:50, A439:100, A438:71},
    A439:{A406:50, A422:80},
    A422:{A439:80, A421:100},
    A421:{A422:100, A433:20},
    A433:{A421:20, A434:60},
    A434:{A433:60, Point_401:63, Trepp_404:50},
    Point_401:{A434:63, Point_402:100},
    Point_402:{Point_401:100, A403:20},
    A403:{Point_402:20,A402:50},
    A402:{A403:60, Point_403:220},
    Point_403:{A402:220, Point_404:80},
    Point_404:{Point_403:80, Point_411:70},
    Point_405:{Point_411:70, A435:50, Point_406:100},
    A435:{Point_405:50},
    Point_406:{Point_405:100, Trepp_401:100, S415:128, S402:150},
    Trepp_401:{Point_406:100},
    A438:{A406:71, A440:50},
    A440:{A438:50, A445:70},
    A445:{A440:70,Point_407:100},
    Point_407:{A445:105, S427:200, Point_409:50},
    Point_409:{Point_407:50, A447:50},
    A447:{Point_409:50},
    S427:{Point_407:170, S428:50},
    S428:{S427:50, S417:1, S416:130},
    S417:{S428:1},
    S416:{S428:130, S415:100},
    S415:{S416:100, Point_406:128},
    S402:{Point_406:100, S412:100},
    S412:{S402:100, S403:155},
    S403:{S412:155, S408:100},
    S408:{S403:50, S409:50},
    S409:{S410:70, S408:50, A413:160},
    S410:{S409:70},
    A413:{S409:160, A414:0, A412:40},
    A414:{A413:0},
    A412:{A413:40, A415:0, A416:50},
    A415:{A412:0},
    A416:{A412:50, A411:70},
    A411:{A416:70, S4100:50, A417:0},
    A417:{A411:0},
    S4100:{A411:50, Point_410:100},
    Point_410:{S4100:100, Trepp_403:80},
    Trepp_403:{Point_410:80},
    Trepp_404:{A434:50},
    Point_411:{Point_405:70,Point_404:70,Lift_402:50},
    Lift_402:{Point_411:50}},
    graph = new Graph(mappper);

//Nupu vajutuse tarvis
function buttonPress(json) {
    let pA = document.getElementById('PointA');
    let pB = document.getElementById('PointB');

    if (pA.value != "" && pB.value != "") {
        map.removeLayer(path);
        map.removeLayer(marker);

        marker = L.circle([0, 0], {
            color: 'red',
            fillColor: 'red',
            fillOpacity: 1,
            radius: 20
        });

        let isSameFloor = false;
        let endIsOnCurrent = false;
        let startIsOnCurrent = false;

        let dijkstra;

        if (pA.value != startingPoint && pB.value != startingPoint) {
            startingPoint = pA.value;
            endPoint = pB.value;
            console.log("Töötab!");
        }

        isSameFloor = compareFloor(startingPoint, endPoint);
        endIsOnCurrent = checkFloor(endPoint);
        startIsOnCurrent = checkFloor(startingPoint);

        console.log(startIsOnCurrent);

        /* *
         * TODO: Hiljem kui on mitu JSONi on vaja lisada ka jsoni valimine
         * navigeerimise jaoks kasutades korruse kontrolli
         */

        //Korruse kontroll
        if (!isSameFloor && startIsOnCurrent) {
            //Kui algus ja lõpp pole samal korrusel aga praegune korrus on algusega sama
            let stairs = [];
            for (let i = 0; i < Object.keys(json).length; i++) {
                let stair = json[i].point;

                if (stair.includes("Trepp") || stair.includes("Lift")) {
                    stairs.push(json[i].point);
                }
            }

            //Lähim lift/trepp
            console.log(stairs);

            /*let shortestId;
            let shortestWay = 10000000;
            for(let i = 0; i < stairs.length; i++){
                let temp = graph.findShortestPath(startingPoint,stairs[i]);
                if(temp.length < shortestWay){
                    shortestId = i;
                    shortestWay = temp.length;
                }
            }*/
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

        } else if (isSameFloor) {
            //Kui algus ja lõpp asuvad samal korrusel
            dijkstra = graph.findShortestPath(startingPoint, endPoint);
        }

        if (dijkstra != null) {
            let temp = findCords(dijkstra, testJSON);
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