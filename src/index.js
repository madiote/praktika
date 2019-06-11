/*jshint esversion:6*/
let map = L.map('map', {
    crs: L.CRS.Simple,
});

let waypoints = [L.latLng(373, 578), L.latLng(373, 1000)];
let bounds = [[0, 0], [1191, 1684]];
let image = L.imageOverlay('./assets/a-4.jpg', bounds).addTo(map);
map.fitBounds(bounds);

let A406 = L.latLng([373, 578]);
let A421 = L.latLng([373, 900]);


//Routing
//let mappper = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}}
/*
*A543: 256,910
*A427: 256,807
*A426: 333,807
*/
let mappper = {A543:{A427:103},A427:{A543:103, A426:77},A426:{A427:77}},
graph = new Graph(mappper);

//console.log(graph.findShortestPath('a', 'b'));
let arr1 = graph.findShortestPath('A543','A426');
console.log(graph.findShortestPath('A426','A543'));
console.log(arr1);

let pointA = new L.latLng([910,256]);
let pointB = new L.latLng([807,256]);
let pointC = new L.latLng([807,333]);

let pointList = [pointA, pointB, pointC];

function drawNav(array){
    let len = array.length;

    for(let i = 1; i < len; i++){
        let cords = getCords(array, i);
        let path = new L.Polyline(cords, {
            color: 'red',
            weight: 3,
            opacity: 1,
            smoothFactor: 1
        });

        path.addTo(map);
    }
}

function getCords(array, arrPoint){
    let point1 = array[arrPoint-1];
    let point2 = array[arrPoint];
    let pointL = [point1, point2];
    return pointL;
}

drawNav(pointList);