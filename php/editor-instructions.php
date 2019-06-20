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
    <h2>Koridorihaldur</h2>
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
        <li>Trepp_NNN, näiteks Trepp_402 - kirjeldab Astra majas olevat treppi, mida kasutatakse, kui see on lähim moodus ühelt korruselt
            teise liikumiseks</li>
        <li>LTrep_NNN, näiteks LTrep_405 - kirjeldab lukustatud treppi</li>
        <li>TreppMare_NNN, näiteks TreppMare_201 - kirjeldab Mare majas olevat treppi</li>
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
    <p>Haldusakna objektide nupud:</p>
    <ol>
        <li>3+3 punktiga nupp - sikutades saab objekte ümber järjestada</li>
        <li>Akna kujuga nupp - sisaldab alammenüüsid</li>
        <ol>
            <li>Tüüp - automaatne, massiiv, objekt või string, üldjuhul pole soovitatav muuta</li>
            <li>Sorteerimine - võimaldab objekte ümber sorteerida, pole soovitatav kasutada</li>
            <li>Filtreerimine - võimaldab objekte manipuleerida JMESPath abil, ainult edasijõudnutele</li>
            <li>Insert - võimaldab uut objekti lisada ja tüüpi valida, lihtsam on kasutada duplikeerimise valikut</li>
            <li>Duplikeeri - kloonib objekti ja selle alamharusid, mõistlik kasutada uute ruumide lisamisel</li>
            <li>Eemalda - eemaldab objekti ja selle alamharud</li>
        </ol>
        <li>Nool paremale või alla - laienda või pane kokku objekti alamharu</li>
    </ol>
    <p>Alumised tööriistad:</p>
    <ol>
        <li>Salvesta - salvestab muudetud faili serverisse</li>
        <li>Laadi originaal - laadib serverist esialgse faili (nt "network-default.json"), salvestades KIRJUTATAKSE
            VALITUD FAIL ÜLE (nt "network.json")</li>
        <li>Vahemaa kalkulaator - sisestades 2 ruumi nime annab tööriist nende vahemaa koordinaadiühikutes, mida saab
            sisestada sisestada navigatsiooni "pathing" faili</li>
    </ol>
    <h3>Ruumi lisamine</h3>
    <ol>
        <li>Lisa ruum ruumihalduse jaotisest</li>
        <li>Koridorihaldusest laadi koordinaadid "network"</li>
        <li>Laienda haru "array" ning keri viimase numbrini</li>
        <li>Vajuta akna kujuga nupule, vali Duplicate</li>
        <li>Laienda tekkinud number</li>
        <li>Määra ruumi nimi (point) ja ukse koordinaadid (cords)</li>
        <li>Koordinaadid võid leida kaardi pealt, aktiveerides all vasakul nurgas olevast nupust koordinaatide kopeerimisrežiimi ning seejärel kleepides need enda soovitud sihtkohta</li>
        <li>Salvesta fail vastava nupuga</li>
        <li>Laadi navigatsioon "pathing"</li>
        <li>Laienda haru "object" ning keri viimase numbrini</li>
        <li>Vajuta akna kujuga nupule, vali Duplicate</li>
        <li>Laienda tekkinud number</li>
        <li>Uuenda objekti nimi ruumi nimele vastavaks</li>
        <li>Objekti harudeks määra ruumile lähimad ruumid ning nende kaugused (kasutades kalkulaatorit)</li>
        <li>Kui lähimaid ruume on juurde vaja, duplikeeri viimast lähimat ruumi ja uuenda väärtusi vastavalt</li>
        <li>Salvesta fail vastava nupuga</li>
    </ol>
    <h3>Ruumi eemaldamine</h3>
    <ol>
        <li>Eemalda ruum ruumihalduse jaotisest</li>
        <li>Koridorihaldusest laadi koordinaadid "network"</li>
        <li>Laienda haru "array" ning keri soovitud ruumini</li>
        <li>Vajuta akna kujuga nupule, vali Remove</li>
        <li>Salvesta fail vastava nupuga</li>
        <li>Laadi navigatsioon "pathing"</li>
        <li>Laienda haru "object" ning keri soovitud ruumini</li>
        <li>Vajuta akna kujuga nupule, vali Remove</li>
        <li>Salvesta fail vastava nupuga</li>
    </ol>
    <h3>Originaalfaili laadimine</h3>
    <ol>
        <li>Vajuta nuppu Laadi originaal</li>
        <li>Vajadusel muuda</li>
        <li>Salvesta, soovitud fail kirjutatakse üle (koordinaadid või navigatsioon)</li>
    </ol>
    <h3>Vahemaa kalkulaator</h3>
    <ol>
        <li>Sisesta esimesse kasti esimese ruumi nimi</li>
        <li>Sisesta teise kasti teise ruumi nimi</li>
        <li>Vajuta Arvuta vahemaa, kuvatakse kaugus kahe ruumi vahel</li>
        <li>Sisesta saadud arv navigatsiooni ruumi alamharusse (vt juhist)</li>
    </ol>
</body>

</html>
