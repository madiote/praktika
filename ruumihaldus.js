/*jshint esversion:6*/

var blob = new Blob(["hello world"],{type: "text/plain"});

function download(blob, name) {
    var url = URL.createObjectURL(blob),
      anch = document.createElement("a");
    anch.href = url;
    anch.download = name;
    var ev = new MouseEvent("click",{});
    anch.dispatchEvent(ev);
}

function redirect(){
  // muuda nii et laed alla kogu info mis on kuvatud nagu ta oli selles todo kodutöös
  let classRoom = document.getElementById("addClassRoom").value;
  let classPeople = document.getElementById("addClassPeople").value;
  let classPurpose = document.getElementById("addClassPurpose").value;
  let data = classRoom +", "+ classPeople+", " + classPurpose;
  var blob = new Blob([data],{type: "text/plain"});

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;

  //console.log(data);
  if(classRoom != "" && classPeople != "" && classPurpose != ""){
    this.download(blob, ""+''+today+''+".txt");
    location.reload();
    alert("Laed alla tekstifaili sisuga "+data);
  }else if(classRoom == ""){
      alert("Sisesta ruumi nimi!");
  }else if(classPurpose == ""){
      alert("Sisesta ruumi eesmärk!");
  }else if(classPeople == ""){
      alert("Sisesta ruumiga seotud isikud!");
  }
}



/*$('submitAdd').on('click',function(){
  download(data,"text-file.txt");

});*/


window.onload = function(){
  let classRoom = document.getElementById("addClassRoom").value;
  let classPeople = document.getElementById("addClassPeople").value;
  let classPurpose = document.getElementById("addClassPurpose").value;
  let data = classRoom +", "+ classPeople+", " + classPurpose;
  var blob = new Blob([data],{type: "text/plain"});
  console.log("Vähemalt see töötab");






};
