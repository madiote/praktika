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
*A543: 256,910 = 281,1428
*A427: 256,807
*A426: 333,807
*/

let testJSON = [
    {
        room: "A543",
        cords: [281,256]
    },
    {
        room: "A427",
        cords: [384,256]
    },
    {
        room: "A426",
        cords: [384,333]
    },
    {
        room: "A425",
        cords: [384,383]
    },
];

console.log(testJSON[1].room);
//Dijkstra
let mappper = {A543:{A427:103},A427:{A543:103, A426:77},A426:{A427:77,A425:60},A425:{A426:60}},
graph = new Graph(mappper);

let arr1 = graph.findShortestPath('A543','A425');
console.log(graph.findShortestPath('A426','A543'));
console.log(arr1);

let pointA = new L.latLng([281,256]);
let pointB = new L.latLng([384,256]);
let pointC = new L.latLng([384,333]);
let pointD = new L.latLng([384,393]);

let pointList = [pointA, pointB, pointC];

function findCords(array, json){
    let points = [];

    for(let i = 0; i < array.length; i++){
        let temp = array[i];
        for(let i = 0; i < Object.keys(json).length; i++){
            if(temp == json[i].room){
                points.push(new L.latLng(json[i].cords));
            }
        }
    }

    return points;
}
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
let test = findCords(arr1, testJSON);
console.log(test);
drawNav(test);