# TLÜ majakaart

Tallinna Ülikooli majakaart on veebirakendus, mis kuvab interaktiivselt ülikooli majaplaani korruse kaupa ning võimaldab navigeerida ühest ruumist teise. Ruumide vahel navigeerimine toimib nii samal korrusel, samas majas kui ka kogu linnakus; esimeses versioonis saab navigeerida vaid digitehnoloogiate instituudi ruumide vahel. Lisaks on võimalik vaadelda linnaku plaane korruse kaupa ning saada lisateavet ruumide nimetuse, kasutajate, eesmärgi, kohtade arvu ja telefoninumbrite kohta.

Projekt on loodud Digitehnoloogia Instituudile Tarkvaraarenduse praktika kursuse raames.

## Ekraanipildid

TODO

## Projekti koosseis

* Karen
* Madis
* Erkki
* Gertin
* Kert

## Kasutatavad tehnoloogiad

* HTML5
* JavaScript (ES6) + teegid:
  * [jQuery 1.12.4](https://jquery.com/)
  * [jQuery UI 1.12.4](https://jquery.com/)
  * [jQuery Mobile 1.4.5](https://jquerymobile.com/)
  * [Leaflet 1.5.1](https://leafletjs.com/)
  * [Leaflet Indoor - 6a5f56b](https://github.com/avanc/leaflet-indoor)
  * [JavaScript implementation of Dijkstra - b96c8b1](https://github.com/andrewhayward/dijkstra)
* CSS3

## Paigaldusjuhised

1. Hangi veebiserver (või alamdomeen, alamleht, ...), mis toetab HTTPSi (soovitavalt automaatse suunamisega) ning MySQLi
2. Klooni või laadi hoidla alla, aseta veebiserverisse
3. Seadista `php/config.php` faili parameetreid andmebaasiga vastavaks
4. Kaart asub serveri avalehel (`index.html`), ruumihaldussüsteem on ligipääsetav lehelt `php/login.php`