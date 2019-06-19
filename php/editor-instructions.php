<?php ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <h2>Koridorihaldur</h2><br>
    <p>Koridorihalduri eesmärgiks on võimaldada kaardisüsteemil navigeerida ühest ruumist teise. Haldur aitab hallata
        kahte faili:</p>
    <ol>
        <li>Koordinaadid ehk network.json - kirjeldab ruumide "uksi", millest ning milleni navigatsioonisüsteem kasutaja
            suunab</li>
        <li>Navigatsioon ehk pathing.json - kirjeldab ruumide seoseid, ehk millised ruumid on üksteise lähedal, et oleks
            võimalik nende vahel navigeerida</li>
    </ol>
    <p>Ruume on 4 kirjapildiga:</p>
    <ol>
        <li>XNNN, näiteks A431 - kirjeldab hoones asuvat ruumi</li>
        <li>Point_NNN, näiteks Point_408 - kirjeldab koridori lõikepunkti, et navigatsioon liiguks ka ümber nurga</li>
        <li>Lift_NNN, näiteks Lift_401 - kirjeldab lifti, mida kasutatakse, kui see on lähim moodus ühelt korruselt
            teise liikumiseks</li>
        <li>Trepp_NNN, näiteks Trepp_402 - kirjeldab treppi, mida kasutatakse, kui see on lähim moodus ühelt korruselt
            teise liikumiseks</li>
    </ol>
    <p>Haldusaknas on tööriistaribal nupud:</p>
    <ol>
        <li>Laienda - "laiendab" kõik objektid, et kuvada iga objekti alamharu teave</li>
        <li>Pane kokku - "paneb objektid kokku", et peita nende alamharude teave</li>
        <li>Sorteeri - võimaldab objekte failis ümber sorteerida, soovitav on seda mitte kasutada ning säilitada
            esialgne järjestus</li>
        <li>Filtreeri - võimaldab objekte manipuleerida JMESPath abil, ainult edasijõudnutele</li>
        <li>Võta tagasi - võtab viimase muudatuse tagasi</li>
        <li>Tee uuesti - teostab viimati tagasi võetud muudatuse uuesti</li>
        <li>Otsingukast - leiab kasti sisestatud tekstile vastava objekti</li>
    </ol>
    <p>Alumised tööriistad:</p>
    <ol>
        <li>Salvesta - salvestab muudetud faili serverisse</li>
        <li>Laadi originaal - laadib serverist esialgse faili (nt "network-default.json"), salvestades KIRJUTATAKSE
            VALITUD FAIL ÜLE (nt "network.json")</li>
        <li>Vahemaa kalkulaator - sisestades 2 ruumi nime annab tööriist nende vahemaa koordinaadiühikutes, mida saab
            sisestada sisestada navigatsiooni "pathing" faili</li>
    </ol>
    <br>
    <h3>
</body>

</html>