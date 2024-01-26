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
    const data = {};
    if (response.status === 201) {
        try {
            const gare = await response.json();
            for (const gara of gare) {
                if (gara["sqcasa"] === data_gara["sqtras"] && gara["sqtras"] === data_gara["sqcasa"]) {
                    if (gara["risultato"] !== "-") {
                        data["gara"] = gara["gara"];
                        data["risultato"] = gara["risultato"];
                        data["parziali"] = gara["parziali"];
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

let evaluation = 0;
const max_evaluation = 78;

async function main() {
    const data = await get_data();
    const andata = await get_partita_andata(data);
    let punti_andata = 0;
    let set_andata = 0;
    let valuta_andata = false;
    if (Object.keys(andata).length !== 0) {
        valuta_andata = prompt("Valutare PARTITA andata? (S: sì | N: no): ");
        if (valuta_andata.toLowerCase() === "s") {
            valuta_andata = true;
        }
    }
    if (valuta_andata) {
        const risultato = andata["risultato"];
        const set_sqcasa = parseInt(risultato.split("-")[1]);
        const set_sqtras = parseInt(risultato.split("-")[0]);
        set_andata = Math.round((set_sqcasa - set_sqtras) * 0.5 * 100) / 100;
        const parziali = andata["parziali"];
        const punti = parziali.split(' ');
        let punti_andata_sqcasa = 0;
        let punti_andata_sqtras = 0;
        for (const punto of punti) {
            if (punto.length > 3) {
                let char = "-";
                if (punto.includes("/")) {
                    char = "/";
                }
                punti_andata_sqcasa += parseInt(punto.split(char)[1]);
                punti_andata_sqtras += parseInt(punto.split(char)[0]);
            }
        }
        punti_andata = Math.round((punti_andata_sqcasa - punti_andata_sqtras) * 0.1 * 100) / 100;
    }
    const classifica = await get_classifica(data);
    const gare_sqcasa = classifica["sqcasa"]["gare"];
    const gare_sqtras = classifica["sqtras"]["gare"];
    const punti_sqcasa = classifica["sqcasa"]["punti"];
    const punti_sqtras = classifica["sqtras"]["punti"];
    const rapp_punti_gare_sqcasa = gare_sqcasa !== 0 ? Math.round((punti_sqcasa / gare_sqcasa) * 100) / 100 : punti_sqcasa;
    const rapp_punti_gare_sqtras = gare_sqtras !== 0 ? Math.round((punti_sqtras / gare_sqtras) * 100) / 100 : punti_sqtras;
    const rapp_punti_gare = Math.round((rapp_punti_gare_sqcasa - rapp_punti_gare_sqtras) * 100) / 100;
    const punticasa_sqcasa = classifica["sqcasa"]["punticasa"];
    const puntitras_sqtras = classifica["sqtras"]["puntitras"];
    const garecasa_sqcasa = classifica["sqcasa"]["garecasa"];
    const garetras_sqtras = classifica["sqtras"]["garetras"];
    const rapp_punti_sqcasa = garecasa_sqcasa !== 0 ? Math.round((punticasa_sqcasa / garecasa_sqcasa) * 100) / 100 : punticasa_sqcasa;
    const rapp_punti_sqtras = garetras_sqtras !== 0 ? Math.round((puntitras_sqtras / garetras_sqtras) * 100) / 100 : puntitras_sqtras;
    const rapp_punti = Math.round((rapp_punti_sqcasa - rapp_punti_sqtras) * 100) / 100;
    evaluation += rapp_punti_gare;
    evaluation += rapp_punti;
    if (valuta_andata) {
        evaluation += punti_andata;
        evaluation += set_andata;
    }
    evaluation = Math.round(evaluation * 100) / 100;
    const sqcasa_vincente = evaluation > 0;
    console.log("\n============================================================\n");
    if (sqcasa_vincente) {
        console.log(`${data['sqcasa']} ha maggiore probabilità di VITTORIA: ${Math.abs(evaluation)}`);
        console.log();
        console.log("== Valutazione Classifica ==");
        console.log(`\tValutazione Punti Totali: ${rapp_punti_gare} (C: ${rapp_punti_gare_sqcasa} | T: ${rapp_punti_gare_sqtras})`);
        console.log(`\tValutazione Punti Casa-Trasferta: ${rapp_punti} (C: ${rapp_punti_sqcasa} | T: ${rapp_punti_sqtras})`);
        if (valuta_andata) {
            console.log();
            console.log("== Valutazione Gara Andata ==");
            console.log(`\tValutazione Set: ${set_andata} (C: ${set_sqcasa} | T: ${set_sqtras})`);
            console.log(`\tValutazione Punti: ${punti_andata} (C: ${punti_andata_sqcasa} | T: ${punti_andata_sqtras})`);
        }
        console.log();
        console.log("== Valutazione Finale ==");
        console.log(`\t** ${Math.abs(evaluation)} **`);
        console.log();
    } else {
        console.log(`${data['sqtras']} ha maggiore probabilità di VITTORIA: ${Math.abs(evaluation)}`);
        console.log();
        console.log("== Valutazione Classifica ==");
        console.log(`\tValutazione Punti: ${-rapp_punti_gare} (T: ${rapp_punti_gare_sqtras} | C: ${rapp_punti_gare_sqcasa})`);
        console.log(`\tValutazione Rapporto Punti Classifica Casa-Trasferta: ${-rapp_punti} (T: ${rapp_punti_sqtras} | C: ${rapp_punti_sqcasa})`);
        if (Object.keys(andata).length !== 0 && valuta_andata) {
            console.log();
            console.log("== Valutazione Gara Andata ==");
            console.log(`\tValutazione Punti: ${-set_andata} (T: ${set_sqtras} | C: ${set_sqcasa})`);
            console.log(`\tValutazione Set: ${-punti_andata} (T: ${punti_andata_sqtras} | C: ${punti_andata_sqcasa})`);
        }
        console.log();
        console.log("== Valutazione Finale ==");
        console.log(`\t** ${Math.abs(evaluation)} **`);
    }
    console.log("\n============================================================\n");
    const risultato = data["risultato"];
    const idGara = data["gara"];
    let vincitore = {};
    if (risultato !== "-") {
        const set_sqcasa = parseInt(risultato.split("-")[0]);
        const set_sqtras = parseInt(risultato.split("-")[1]);
        const casa = set_sqcasa > set_sqtras ? 1 : 0;
        const trasferta = set_sqcasa > set_sqtras ? 0 : 1;
        vincitore = {"idGara": idGara, "casa": casa, "trasferta": trasferta};
    } else {
        const casa = evaluation > 0 ? 1 : 0;
        const trasferta = evaluation > 0 ? 0 : 1;
        vincitore = {"idGara": idGara, "casa": casa, "trasferta": trasferta};
    }
    if (evaluation === 0) {
        console.log("Pareggio!");
        const vota = prompt(`VOTARE LA SQUADRA DI CASA (${vincitore['casa'] == 1 ? data['sqcasa'] : data['sqtras']})? (S: sì | N: no): `);
        if (vota.toLowerCase() === "s") {
            const conferma = prompt("CONFERMARE? (S: sì | N: no): ");
            if (conferma.toLowerCase() === "s") {
                vota_vincitore(vincitore);
            }
        }
    } else {
        const vota = prompt(`VOTARE (${vincitore['casa'] == 1 ? data['sqcasa'] : data['sqtras']}) (Eval: ${Math.abs(evaluation)})? (S: sì | N: no): `);
        if (vota.toLowerCase() === "s") {
            const conferma = prompt("CONFERMARE? (S: sì | N: no): ");
            if (conferma.toLowerCase() === "s") {
                vota_vincitore(vincitore);
            }
        }
    }
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
        const success = response.json()["success"];
        if (success.toLowerCase() === "false") {
            console.log("\tERRORE durante la VOTAZIONE!");
        } else {
            if (votazione['casa'] == 1) console.log(`${data['sqcasa']} VOTATA con SUCCESSO!`);
            else console.log(`${data['sqtras']} VOTATA con SUCCESSO!`);
        }
    }
}

main();