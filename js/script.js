const SCOMMESSE_URL = "https://www.ilmenu.cloud/livescore/read/game.php";
const TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU0YWRmYjQzNmI5ZTE5N2UyZTExMDZhZjJjODQyMjg0ZTQ5ODZhZmYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1Njg4NzAxNDkxODEtZTd0bWNwY2c4MDkyYW82NXB1cWRhaGQya2JtMThvY3UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1Njg4NzAxNDkxODEtYjdldW02MmoxZm5wOTRlNmkxa2I5Z3ByOWV2OG5lMG8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ2MDc5NTIxMjExMTAwODkyOTciLCJlbWFpbCI6Im1ha2VyZmFmZmFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJGYWJyaXppbyBHYXNwYXJpbmkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS1FudTduQXZtZEFfYlR4Q0FadWhWNFBwd29pdWJoLXowMUR1NHhjOXdRNzc0PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkZhYnJpemlvIiwiZmFtaWx5X25hbWUiOiJHYXNwYXJpbmkiLCJsb2NhbGUiOiJpdCIsImlhdCI6MTcwMTYzMzk4NSwiZXhwIjoxNzAxNjM3NTg1fQ.DaLblU4EnPk4iY_WMgyWD1CkFEITZtc0W3xL6sSo7a3X3RX-9tgC3rCac0GFB-7vi5oSSgY5IUS7N2zbp5KIeKJqxgQdrUUSo7-UHcbNiMYeAh8fjbls1R1Aq4PP6P38u2aRpo77ZTioZGEJB0yvikrflMjS7rgt4dnOK8AJKs8-QlCeqWOFaw4A6Dmln-pRlOZPZ8e0qnnwGI_1-ZzolfcD-YGojQklYi1MRbNThsrS7n5DuWBScfoLqiX8AcyInUXU_4wn8owOONyaUf59VUt9v-ZIzGoEIYM8mZJwjt-MeTWd414QKl2Xw6LP7G0WgzdEdwpn2OUnbYStbjEEUw";

async function get_data() {
    const url = "https://www.ilmenu.cloud/livescore/read/game.php";
    const body = JSON.stringify({
        "token": TOKEN
    });

    const response = await fetch(url, {
        method: 'POST',
        body: body
    });
    if (response.status === 201) {
        try {
            const gara = (await response.json())[0];
            const data = {
                "gara": gara["gara"],
                "girone": gara["girone"],
                "commettee": gara["commettee"],
                "sqcasa": gara["sqcasa"],
                "sqtras": gara["sqtras"],
                "risultato": gara["risultato"],
                "logosqcasa": gara["logo1"],
                "logosqtras": gara["logo2"],
                "campionato": gara["nome"],
                "categoria": gara["title"],
                "data": gara["data"]
            };
            return data;
        } catch (error) {
            console.log("Errore nella decodifica JSON: Dati non validi");
        }
    } else {
        console.log(`Errore nella richiesta API: ${response.status}`);
    }
}

async function get_partita_andata(data_gara) {
    const url = "https://www.spikevolley.it/livescore/read/giornate.php";
    const body = JSON.stringify({
        "campionato": data_gara["girone"],
        "commettee": data_gara["commettee"]
    });
    const response = await fetch(url, {
        method: 'POST',
        body: body
    });
    if (response.status === 201) {
        try {
            const gare = await response.json();
            for (const gara of gare) {
                if (gara["sqcasa"] === data_gara["sqtras"] && gara["sqtras"] === data_gara["sqcasa"]) {
                    if (gara["risultato"] !== "-") {
                        const data = {};
                        data["gara"] = gara["gara"];
                        data["risultato"] = gara["risultato"].replace("-", "/");
                        data["parziali"] = gara["parziali"];
                        return data;
                    }
                }
            }
        } catch (error) {
            console.log("Errore nella decodifica JSON: Dati non validi");
        }
    } else {
        console.log(`Errore nella richiesta API: ${response.status}`);
    }

    return null;
}

async function get_recent_wl(data_gara, squadra) {
    const url = "https://www.spikevolley.it/livescore/read/giornate.php";
    const body = JSON.stringify({
        "campionato": data_gara["girone"],
        "commettee": data_gara["commettee"]
    });
    const response = await fetch(url, {
        method: 'POST',
        body: body
    });

    const data = {"partite": [], "partitecasa": [], "partitetras": []}
    if (response.status === 201) {
        try {
            const gare = JSON.parse(await response.text()).reverse()
            for (const gara of gare) {
                if (gara["sqcasa"] == squadra || gara["sqtras"] == squadra) {
                    risultato = gara["risultato"]
                    if (risultato != "-") {
                        const set_sqcasa = parseInt(risultato.split("-")[0]);
                        const set_sqtras = parseInt(risultato.split("-")[1]);

                        if (gara["sqcasa"] === squadra)
                        {
                            if (set_sqcasa > set_sqtras)
                            {
                                data["partite"].push("V")
                                data["partitecasa"].push("V")
                            }
                            else
                            {
                                data["partite"].push("P")
                                data["partitecasa"].push("P")
                            }
                        }
                        else if (gara["sqtras"] === squadra)
                        {
                            if (set_sqcasa > set_sqtras)
                            {
                                data["partite"].push("P")
                                data["partitetras"].push("P")
                            }
                            else
                            {
                                data["partite"].push("V")
                                data["partitetras"].push("V")
                            }
                        }

                    }
                }
            }            
        } catch (error) {
            console.log(`Errore nella decodifica JSON: Dati non validi (${error})`);
        }
    } else {
        console.log(`Errore nella richiesta API: ${response.status}`);
    }

    return data;
}

async function get_voti(data) {
    const url = "https://www.spikevolley.it/livescore/read/scommesse.php";
    const body = JSON.stringify({
        "idGara": data["gara"],
        "token": TOKEN
    });
    const response = await fetch(url, {
        method: 'POST',
        body: body
    });

    if (response.status === 201) {
        const success = await response.json()

        return success
    }
}

async function get_classifica(data_gara) {
    const url = "https://www.spikevolley.it/livescore/read/giornate.php";
    const body = JSON.stringify({
        "campionato": data_gara["girone"],
        "commettee": data_gara["commettee"]
    });
    const response = await fetch(url, {
        method: 'POST',
        body: body
    });
    const data = {
        "sqcasa": {
            "garevinte": 0,
            "gareperse": 0,
            "gare": 0,
            "garecasa": 0,
            "garetras": 0,
            "garevintecasa": 0,
            "garevintetras": 0,
            "punticasa": 0,
            "puntitras": 0,
            "punti": 0
        },
        "sqtras": {
            "garevinte": 0,
            "gareperse": 0,
            "gare": 0,
            "garecasa": 0,
            "garetras": 0,
            "garevintecasa": 0,
            "garevintetras": 0,
            "punticasa": 0,
            "puntitras": 0,
            "punti": 0
        }
    };
    if (response.status === 201) {
        try {
            const gare = await response.json();
            for (const gara of gare) {
                const risultato = gara["risultato"];
                if (risultato !== "-") {
                    if (data_gara["sqcasa"] === gara["sqcasa"]) {
                        const set_sqcasa = parseInt(risultato.split("-")[0]);
                        const set_sqtras = parseInt(risultato.split("-")[1]);
                        if (set_sqcasa > set_sqtras) {
                            if (set_sqtras < 2) {
                                data["sqcasa"]["punti"] += 3;
                                data["sqcasa"]["punticasa"] += 3;
                                data["sqcasa"]["garevinte"] += 1;
                            } else {
                                data["sqcasa"]["punti"] += 2;
                                data["sqcasa"]["punticasa"] += 2;
                                data["sqcasa"]["garevinte"] += 1;
                            }
                            data["sqcasa"]["garevintecasa"] += 1;
                        } else {
                            if (set_sqcasa === 2) {
                                data["sqcasa"]["punti"] += 1;
                                data["sqcasa"]["punticasa"] += 1;
                            }
                            data["sqcasa"]["gareperse"] += 1;
                        }
                        data["sqcasa"]["gare"] += 1;
                        data["sqcasa"]["garecasa"] += 1;
                    }
                    if (data_gara["sqcasa"] === gara["sqtras"]) {
                        const set_sqcasa = parseInt(risultato.split("-")[1]);
                        const set_sqtras = parseInt(risultato.split("-")[0]);
                        if (set_sqcasa > set_sqtras) {
                            if (set_sqtras < 2) {
                                data["sqcasa"]["punti"] += 3;
                                data["sqcasa"]["puntitras"] += 3;
                                data["sqcasa"]["garevinte"] += 1;
                            } else {
                                data["sqcasa"]["punti"] += 2;
                                data["sqcasa"]["puntitras"] += 2;
                                data["sqcasa"]["garevinte"] += 1;
                            }
                            data["sqcasa"]["garevintetras"] += 1;
                        } else {
                            if (set_sqcasa === 2) {
                                data["sqcasa"]["punti"] += 1;
                                data["sqcasa"]["puntitras"] += 1;
                            }
                            data["sqcasa"]["gareperse"] += 1;
                        }
                        data["sqcasa"]["gare"] += 1;
                        data["sqcasa"]["garetras"] += 1;
                    }
                    if (data_gara["sqtras"] === gara["sqcasa"]) {
                        const set_sqtras = parseInt(risultato.split("-")[0]);
                        const set_sqcasa = parseInt(risultato.split("-")[1]);
                        if (set_sqtras > set_sqcasa) {
                            if (set_sqcasa < 2) {
                                data["sqtras"]["punti"] += 3;
                                data["sqtras"]["punticasa"] += 3;
                                data["sqtras"]["garevinte"] += 1;
                            } else {
                                data["sqtras"]["punti"] += 2;
                                data["sqtras"]["punticasa"] += 2;
                                data["sqtras"]["garevinte"] += 1;
                            }
                            data["sqtras"]["garevintecasa"] += 1;
                        } else {
                            if (set_sqtras === 2) {
                                data["sqtras"]["punti"] += 1;
                                data["sqtras"]["punticasa"] += 1;
                            }
                            data["sqtras"]["gareperse"] += 1;
                        }
                        data["sqtras"]["gare"] += 1;
                        data["sqtras"]["garecasa"] += 1;
                    }
                    if (data_gara["sqtras"] === gara["sqtras"]) {
                        const set_sqtras = parseInt(risultato.split("-")[1]);
                        const set_sqcasa = parseInt(risultato.split("-")[0]);
                        if (set_sqtras > set_sqcasa) {
                            if (set_sqcasa < 2) {
                                data["sqtras"]["punti"] += 3;
                                data["sqtras"]["puntitras"] += 3;
                                data["sqtras"]["garevinte"] += 1;
                            } else {
                                data["sqtras"]["punti"] += 2;
                                data["sqtras"]["puntitras"] += 2;
                                data["sqtras"]["garevinte"] += 1;
                            }
                            data["sqtras"]["garevintetras"] += 1;
                        } else {
                            if (set_sqtras === 2) {
                                data["sqtras"]["punti"] += 1;
                                data["sqtras"]["puntitras"] += 1;
                            }
                            data["sqtras"]["gareperse"] += 1;
                        }
                        data["sqtras"]["gare"] += 1;
                        data["sqtras"]["garetras"] += 1;
                    }
                }
            }
        } catch (error) {
            console.log("Errore nella decodifica JSON: Dati non validi");
        }
    } else {
        console.log(`Errore nella richiesta API: ${response.status}`);
    }
    return data;
}

function setup_progress_bar(progress, casa, tras)
{
    const perc_casa = Math.round((casa / (casa + tras) * 100))
    const perc_tras = 100 - (perc_casa)

    progress.querySelector(".home").innerText = casa 
    progress.querySelector(".away").innerText = tras

    progress.querySelector(".home-label").innerText = perc_casa + "%"
    progress.querySelector(".home-label").style.flex = perc_casa / 100

    progress.querySelector(".away-label").innerText = perc_tras + "%"
    progress.querySelector(".away-label").style.flex = perc_tras / 100


    progress.querySelector(".progress").style.backgroundSize = `${perc_casa}% 100%, 100% 100%`
}


partita = null

async function setup(data) {
    const team_home = document.getElementById('home')
    const team_away = document.getElementById('away')
    
    // INFO SQUADRE
    team_home.querySelector('.name').innerText = data["sqcasa"]
    team_home.querySelector(".logo").style.backgroundImage = `url('${data["logo1"]}')`
    
    team_away.querySelector('.name').innerText = data["sqtras"]
    team_away.querySelector(".logo").style.backgroundImage = `url('${data["logo2"]}')`

    // SCONTRO DIRETTO
    andata = await get_partita_andata(data)
    const scontro_diretto = document.getElementById('scontro-diretto')
    
    if (andata != null) {
        risultato_andata = andata["risultato"]
        if (risultato_andata.includes("-")) risultato_andata = risultato_andata.split("-")
        else risultato_andata = risultato_andata.split("/")
    }
    scontro_diretto.innerText = andata != null ? (risultato_andata[1] + " / " + risultato_andata[0]) : '/'
    
    // INFO PARTITA
    
    const orario = document.getElementById('orario')
    const campionato = document.getElementById('campionato')
    const categoria = document.getElementById('categoria')

    var orario_text = data["data"].split(" ")[1].split(":")
    orario_text.pop()
    orario_text = orario_text[0] + ":" + orario_text[1]

    var campionato_text = await get_campionati_from_id(data["commettee"])
    campionato_text = campionato_text.replace("COMITATO", "C.")
    campionato_text = campionato_text.replace("TERRITORIALE", "T.")
    campionato_text = campionato_text.replace("REGIONALE", "R.")

    var categoria_text = await get_categoria_from_id(data["commettee"], data["girone"])
    categoria_text = categoria_text.replace("Under ", "U")
    categoria_text = categoria_text.replace("Prima", "1°")
    categoria_text = categoria_text.replace("Seconda", "2°")
    categoria_text = categoria_text.replace("Terza", "3°")
    categoria_text = categoria_text.replace("Interregionale", "I. ")

    categoria_text = categoria_text.replace(" Femminile", "F")
    categoria_text = categoria_text.replace(" Maschile", "M")

    orario.innerText = orario_text
    campionato.innerText = campionato_text
    categoria.innerText = categoria_text

    // PARTITE RECENTI
    recenti_home_data = await get_recent_wl(data, data["sqcasa"])
    recenti_away_data = await get_recent_wl(data, data["sqtras"])

    const recenti_home = team_home.querySelector('.recent')
    const recenti_home_only = team_home.querySelector('.recent.home')

    recenti_home.innerHTML = ''
    for (let index = 0; index < 5; index++) {
        var risultato = recenti_home_data["partite"][index];
        
        var partita = document.createElement('h1')
        
        partita.className = risultato == "V" ? "win" : "loss";
        partita.innerText = risultato;
        
        recenti_home.append(partita)
        
        recenti_home_only.innerHTML = ''
        if (index < recenti_home_data["partitecasa"].length) {
            risultato = recenti_home_data["partitecasa"][index];
            
            partita = document.createElement('h1')
        
            partita.className = risultato == "V" ? "win" : "loss";
            partita.innerText = risultato;
            
            recenti_home_only.append(partita)
        }
    }

    const recenti_away = team_away.querySelector('.recent')
    const recenti_away_only = team_away.querySelector('.recent.away')

    recenti_away.innerHTML = ''
    for (let index = 0; index < 5; index++) {
        var risultato = recenti_away_data["partite"][index];
        
        var partita = document.createElement('h1')
        
        partita.className = risultato == "V" ? "win" : "loss";
        partita.innerText = risultato;
        
        recenti_away.append(partita)
        
        recenti_away_only.innerHTML = ''
        if (index < recenti_away_data["partitetras"].length) {
            risultato = recenti_away_data["partitetras"][index];
            
            partita = document.createElement('h1')
            
            partita.className = risultato == "V" ? "win" : "loss";
            partita.innerText = risultato;
            
            recenti_away_only.append(partita)
        }
    }
    
    
    // DATI PRINCIPALI
    const dati = document.getElementById('data')
    classfica = await get_classifica(data)
    voti_data = await get_voti(data)


    const casa = classfica["sqcasa"]
    const tras = classfica["sqtras"]

    // ** PARTITE **
    const partite_casa = parseInt(casa['gare'])
    const partite_tras = parseInt(tras['gare'])

    const partite_casa_casa = parseInt(casa['garecasa'])
    const partite_tras_tras = parseInt(tras['garetras'])

    const partite_vinte_casa_casa = parseInt(casa['garevintecasa'])
    const partite_vinte_tras_tras = parseInt(tras['garevintetras'])
    
    // ** PUNTI **
    const punti_casa = parseInt(casa['punti'])
    const punti_tras = parseInt(tras['punti'])

    const punti_casa_casa = parseInt(classfica['sqcasa']['punticasa'])
    const punti_casa_tras = parseInt(classfica['sqtras']['punticasa'])
    
    const punti_tras_casa = parseInt(classfica['sqcasa']['puntitras'])
    const punti_tras_tras = parseInt(classfica['sqtras']['puntitras'])

    
    // == VOTAZIONE UTENTI ==
    const voti_pb = dati.querySelector('.voti')
    
    const voti_casa = parseInt(voti_data[0]['casa'])
    const voti_tras = parseInt(voti_data[0]['trasferta'])
    setup_progress_bar(dati, voti_casa, voti_tras)
    
    // == PARITE GIOCATE ==
    const partite_pb = dati.querySelector('.partite')
    setup_progress_bar(partite_pb, partite_casa, partite_tras)

    // == PARITE VINTE/GIOCATE ==
    const partite_vinte_pb = dati.querySelector('.partite-vinte-giocate')
    
    const partite_vinte_casa = Math.round(parseInt(casa['garevinte']) / partite_casa * 100) / 100
    const partite_vinte_tras = Math.round(parseInt(tras['garevinte']) / partite_tras * 100) / 100
    setup_progress_bar(partite_vinte_pb, partite_vinte_casa, partite_vinte_tras)

    // == RAPP PARITE VINTE CASA/TRAS ==
    const partite_vinte_casa_trasferta = dati.querySelector('.partite-vinte-casa-trasfera')
    
    const rapp_partite_vinte_casa_casa = Math.round(partite_vinte_casa_casa / partite_casa_casa * 100) / 100
    const rapp_partite_vinte_tras_tras = Math.round(partite_vinte_tras_tras / partite_tras_tras * 100) / 100

    setup_progress_bar(partite_vinte_casa_trasferta, rapp_partite_vinte_casa_casa, rapp_partite_vinte_tras_tras)
    
    // == PUNTI CLASSIFICA ==
    const punti_pb = dati.querySelector('.punti')
    setup_progress_bar(punti_pb, punti_casa, punti_tras)

    // == RAPP PUNTI/PARTITE ==
    const punti_casa_pb = dati.querySelector('.rapp-punti-partite')
    
    const rapp_punti_partite_casa = Math.round(punti_casa / partite_casa * 100) / 100
    const rapp_punti_partite_tras = Math.round(punti_tras / partite_tras * 100) / 100
    setup_progress_bar(punti_casa_pb, rapp_punti_partite_casa, rapp_punti_partite_tras)

    // == RAPP PUNTI CASA/TRAS ==
    const punti_casa_tras_pb = dati.querySelector('.rapp-punti-casa-tras')
    
    const rapp_punti_casa_tras_casa = Math.round(punti_casa_casa / partite_casa_casa * 100) / 100
    const rapp_punti_casa_tras_tras = Math.round(punti_tras_tras / partite_tras_tras * 100) / 100
    
    setup_progress_bar(punti_casa_tras_pb, rapp_punti_casa_tras_casa, rapp_punti_casa_tras_tras)
    
    const valutazione_pb = document.getElementById('valutazione-pb')
    
    var eval = 0
    var eval_casa = 0
    var eval_tras = 0
    
    eval_casa += rapp_punti_partite_casa;
    eval_tras += rapp_punti_partite_tras;
    
    eval_casa += rapp_punti_casa_tras_casa
    eval_tras += rapp_punti_casa_tras_tras

    eval_casa = Math.round(eval_casa * 100) / 100
    eval_tras = Math.round(eval_tras * 100) / 100
    
    setup_progress_bar(valutazione_pb, eval_casa, eval_tras)

    eval = Math.round((eval_casa - eval_tras) * 100) / 100

    const eval_team = document.getElementById('eval-team')
    const eval_score = document.getElementById('eval-score')

    if (eval > 0) eval_team.innerText = data["sqcasa"]
    else eval_team.innerText = data["sqtras"]
    
    eval_score.innerText = "+ " + eval

    const vote_home_btn = document.getElementById('vote-home')
    const vote_away_btn = document.getElementById('vote-away')

    vote_home_btn.innerText = data["sqcasa"]
    vote_away_btn.innerText = data["sqtras"]

    vote_home_btn.onclick = function (e) {
        e.stopPropagation();
        vote(1, data["gara"])
    }

    vote_away_btn.onclick = function (e) {
        e.stopPropagation();
        vote(2, data["gara"])
    }
}

async function selections()
{
    const campionato_select = document.getElementById("campionato-select")
    const categoria_select = document.getElementById("categoria-select")

    campionati_data = await get_campionati()

    regioni = []

    campionati_data.forEach(element => {
        var option = document.createElement('option')
        option.value = element["id_new"]

        var campionato_text = element["nome"]
        campionato_text = campionato_text.replace("COMITATO", "C.")
        campionato_text = campionato_text.replace("TERRITORIALE", "T.")
        campionato_text = campionato_text.replace("REGIONALE", "R.")

        option.innerText = campionato_text;

        if (!regioni.includes(element["regione"]))
        {
            regioni.push(element["regione"])

            var group = document.createElement('optgroup')
            group.label = element["regione"]
            campionato_select.append(group)
        }

        campionato_select.append(option)
    });

    campionato_select.onchange = async function (e) {
        categorie = await get_categorie(campionato_select.value)

        categoria_select.innerHTML = ''

        categorie.forEach(element => {
            var option = document.createElement('option')
            option.value = element["id"]

            var categoria_text = element["title"]
            categoria_text = categoria_text.replace("Under ", "U")
            categoria_text = categoria_text.replace("Prima", "1°")
            categoria_text = categoria_text.replace("Seconda", "2°")
            categoria_text = categoria_text.replace("Terza", "3°")

            categoria_text = categoria_text.replace(" Femminile", "F")
            categoria_text = categoria_text.replace(" Maschile", "M")

            option.innerText = categoria_text;
            categoria_select.append(option)
        });

        categoria_select.value = categorie[0]["id"]
    }

    let triggerEvent = new Event("change")
    campionato_select.dispatchEvent(triggerEvent)
    
    const home_select = document.getElementById("home-select")
    const away_select = document.getElementById("away-select")

    categoria_select.onchange = async function (e) {
        squadre = await get_squadre(campionato_select.value, categoria_select.value)
        
        home_select.innerHTML = ''
        away_select.innerHTML = ''

        squadre.forEach(squadra => {
            var option = document.createElement('option')
            var option2 = document.createElement('option')
            
            option.value = squadra
            option2.value = squadra
            option.innerText = squadra
            option2.innerText = squadra

            home_select.append(option)
            away_select.append(option2)
        });
    }

    home_select.onchange = async function() {
        partita = await get_partita(campionato.value, categoria_select.value, home_select.value, away_select.value)
        console.log(partita)
        if (partita != null) setup(partita)
    }

    away_select.onchange = async function() {
        partita = await get_partita(campionato.value, categoria_select.value, home_select.value, away_select.value)
        if (partita != null) setup(partita)
    }
}

selections()

async function vote(team, gara)
{
    votazione = { "idGara": gara, "casa": team == 1 ? 1 : 0, "trasferta": team == 1 ? 0 : 1 }   
    risultato = await vota_vincitore(votazione)
}

async function vota_vincitore(votazione) {
    const url = "https://www.spikevolley.it/livescore/create/scommesse.php";
    const body = JSON.stringify({
        "idGara": votazione["idGara"],
        "casa": votazione["casa"],
        "trasferta": votazione["trasferta"],
        "token": TOKEN
    });

    const response = await fetch(url, {
        method: 'POST',
        body: body
    });
    if (response.status === 200) {
        const success = await response.json()
        if (success["success"] == false) {
            console.log("\tERRORE durante la VOTAZIONE!");
        } else {
            if (votazione['casa'] == 1) console.log(`"SQUADRA IN CASA" VOTATA con SUCCESSO!`);
            else console.log(`"SQUADRA IN TRASFERTA" VOTATA con SUCCESSO!`);
            setup(partita)
        }
    }
}
async function get_campionati() {
    const url = "https://www.spikevolley.it/livescore/read/comitati.php";
    
    const response = await fetch(url, {
        method: 'GET'
    });
    
    if (response.status === 201) {
        return await response.json();
    }
}

async function get_campionati_from_id(id) {
    const url = "https://www.spikevolley.it/livescore/read/comitati.php";
    
    const response = await fetch(url, {
        method: 'GET'
    });
    
    if (response.status === 201) {  
        data = await response.json();
        for (const campionato of data)
        {
            if (campionato["id_new"] == id)
            {
                console.log(campionato)
                return campionato["nome"]
            }    
        }
    }
}

async function get_categorie(id_campionato) {
    const url = "https://www.spikevolley.it/livescore/read/campionati.php";

    const body = JSON.stringify({
        "comitato": id_campionato
    });

    const response = await fetch(url, {
        method: 'POST',
        body: body
    });

    if (response.status === 201) {
        return await response.json();
    }
}

async function get_categoria_from_id(id_campionato, id_categoria) {
    const url = "https://www.spikevolley.it/livescore/read/campionati.php";

    const body = JSON.stringify({
        "comitato": id_campionato
    });

    const response = await fetch(url, {
        method: 'POST',
        body: body
    });

    if (response.status === 201) {
        data = await response.json();
        for (const categoria of data)
        {
            if (categoria["id"] == id_categoria)
            {
                return categoria["title"]
            }    
        }
    }
}


async function get_squadre(commettee, campionato) {
    const url = "https://www.spikevolley.it/livescore/read/giornate.php";

    const body = JSON.stringify({
        "commettee": commettee,
        "campionato": campionato
    });

    
    const response = await fetch(url, {
        method: 'POST',
        body: body
    });
    
    squadre = []
    if (response.status === 201) {
        data = await response.json()

        data.forEach(squadra => {            
            let sqcasa = squadra["sqcasa"]
            let sqtras = squadra["sqtras"]

            if(!squadre.includes(sqcasa)) squadre.push(sqcasa)
            if(!squadre.includes(sqtras)) squadre.push(sqtras)

        });
    }
    return squadre
}

async function get_partita(commettee, campionato, casa, tras) {
    const url = "https://www.spikevolley.it/livescore/read/giornate.php";

    console.log("Richiesta")
    const body = JSON.stringify({
        "commettee": commettee,
        "campionato": campionato
    });

    
    const response = await fetch(url, {
        method: 'POST',
        body: body
    });
    
    if (response.status === 201) {
        gare = await response.json()

        for (const gara of gare) {           
            if (gara["sqcasa"] == casa && gara["sqtras"] == tras)
            {
                console.log("Partita Trovata")
                return gara
            }
        };
    }

    return null
}