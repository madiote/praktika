/*jshint esversion:6*/
$('#Cords').on('click', ()=> loadJson("network.json"));
$('#Path').on('click', ()=> loadJson("pathing.json"));
$('#Save').on('click', ()=> saveToFile(activeFile));
$('#Default').on('click', ()=> loadDefaultSettings());

let container = document.getElementById("jsoneditor");
let options = {};
let editor = new JSONEditor(container, options);

let activeFile;

// set json
function loadJson(fileName){
    activeFile = fileName;
    console.log(fileName);
    let input = null;

    $.ajax({
        dataType: "json",
        async: false,
        url: "./json/" + fileName,
        'success': function (json) {
            input = json;
        }
    });

    editor.set(input);
}

function saveToFile(file){
    let output = null;
    output = editor.get();
    console.log(output);

    $.post("./php/upload.php", {json : JSON.stringify(output), path : file});
}

function loadDefaultSettings(){
    let file = activeFile.split(".")[0];
    console.log(file);
    let input = null;

    $.ajax({
        dataType: "json",
        async: false,
        url: "./json/" + file + "-default.json",
        'success': function (json) {
            input = json;
        }
    });

    editor.set(input);
}

//Kalkulaator
$('#calc').on('click', ()=> calculator());
$('#calc-room').on('click', ()=> calculatorRoom());

let cord1;
let cord2;

function calculator(){
    console.log("2");
    cord1 = $('#cord1').val();
    cord2 = $('#cord2').val();

    let arr1 = cord1.split(',');
    let arr2 = cord2.split(',');

    if(arr1.length > 2 || arr2.length > 2 || arr1.length < 2 || arr2.length < 2){
        $("#result").html("Puudulikud andmed!");
    }else{
        let X = Math.abs(arr1[0] - arr2[0]);
        let Y = Math.abs(arr1[1] - arr2[1]);
    
        let D = Math.sqrt((Math.pow(X, 2) + (Math.pow(Y, 2))));
        let roundedD = Math.round(D * 100) / 100;
        $("#result").html("Vahemaa on: " + roundedD);
    }
}

function calculatorRoom(){
    console.log("1");
    cord1 = $('#cord1').val();
    cord2 = $('#cord2').val();

    let A;
    let B;

    let roomCords = null;
    $.ajax({
        dataType: "json",
        async: false,
        url: "./json/network.json",
        'success': function (json) {
            roomCords = json;
        }
    });

    for(let i = 0; i < roomCords.length; i++){
        if(roomCords[i].point == cord1){
            A = roomCords[i].cords;
        }else if(roomCords[i].point == cord2){
            B = roomCords[i].cords;
        }
    }

    if(A.length > 2 || B.length > 2 || A.length < 2 || B.length < 2){
        $("#result").html("Puudulikud andmed!");
    }else{
        let X = Math.abs(A[0] - B[0]);
        let Y = Math.abs(A[1] - B[1]);
    
        let D = Math.sqrt((Math.pow(X, 2) + (Math.pow(Y, 2))));
        let roundedD = Math.round(D * 100) / 100;
        $("#result").html("Vahemaa on: " + roundedD);
    }
}