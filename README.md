# TLÜ majakaart

Tallinna Ülikooli majakaart on veebirakendus, mis kuvab interaktiivselt ülikooli majaplaani korruse kaupa ning võimaldab navigeerida ühest ruumist teise. Ruumide vahel navigeerimine toimib nii samal korrusel, samas majas kui ka kogu linnakus; esimeses versioonis saab navigeerida vaid digitehnoloogiate instituudi ruumide vahel. Lisaks on võimalik vaadelda linnaku plaane korruse kaupa ning saada lisateavet ruumide nimetuse, kasutajate, eesmärgi, kohtade arvu ja telefoninumbrite kohta.

Projekt on loodud Digitehnoloogia Instituudile Tarkvaraarenduse praktika kursuse raames. Ekraanipildid ja dokumentatsioon asub `docs` kaustas.

## Projekti koosseis

* Karen
* Madis
* Erkki
* Gertin
* Kert

## Kasutatavad tehnoloogiad

* HTML5
* JavaScript (ES6) + teegid:
  * [jQuery](https://jquery.com/) 1.12.4 (ruumihaldus) ja 3.4.1 (kaart jm)
  * [jQuery UI 1.12.4](https://jquery.com/)
  * [jQuery Mobile 1.4.5](https://jquerymobile.com/)
  * [Leaflet 1.5.1](https://leafletjs.com/)
  * [Leaflet Indoor - 6a5f56b](https://github.com/avanc/leaflet-indoor)
  * [JavaScript implementation of Dijkstra - b96c8b1](https://github.com/andrewhayward/dijkstra)
  * [JSON Editor 6.0.0](https://github.com/josdejong/jsoneditor)
* CSS3
* PHP 5.6.40
* MySQL

## Paigaldusjuhised

1. Hangi veebiserver (või alamdomeen, alamleht, ...), mis toetab HTTPSi (soovitavalt automaatse suunamisega), PHP-d ning MySQLi
2. Klooni või laadi hoidla alla harust `master`, aseta veebiserverisse
3. Seadista `php/config.php` faili parameetreid andmebaasiga vastavaks
4. Kaart asub serveri avalehel (`index.html`), ruumihaldussüsteem on ligipääsetav lehelt `php/login.php`
5. Kaardil kuvatavaid ruume ja teekondi ruumi vahel hoitakse kaustas `json`, veendu et sinna saab PHP kirjutada

Kasutajate andmebaasitabel:
```
CREATE TABLE IF NOT EXISTS `Praktika_kasutajad` (`id` int(11) NOT NULL, `username` varchar(100) NOT NULL, `password` varchar(60) NOT NULL ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
ALTER TABLE `Praktika_kasutajad` ADD PRIMARY KEY (`id`);
ALTER TABLE `Praktika_kasutajad` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
```
Kasutajate loomine toimub haldusliideses `/php/ruumihaldus.php#addUsers`, millele ligipääsu saamiseks tuleb samuti sisse logida.
Esialgse kasutaja `root`/`Pa$$w0rd` loomiseks saab kirjutada

````
INSERT INTO `andmebaasi_nimi`.`Praktika_kasutajad` (`id`, `username`, `password`) VALUES (NULL, 'root' '$2y$12$362a1f514a0f0cc974451uOci0D0jgyQ9soSJ1uSdJDuTDXFU/Pju')
```
seejärel peale õigete kasutajate loomist saab esialgse eemaldada
```
DELETE FROM `andmebaasi_nimi`.`Praktika_kasutajad` WHERE `Praktika_kasutajad`.`username` = `root`
```