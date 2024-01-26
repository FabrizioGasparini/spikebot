import requests
import json

SCOMMESSE_URL = "https://www.ilmenu.cloud/livescore/read/game.php"
TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU0YWRmYjQzNmI5ZTE5N2UyZTExMDZhZjJjODQyMjg0ZTQ5ODZhZmYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1Njg4NzAxNDkxODEtZTd0bWNwY2c4MDkyYW82NXB1cWRhaGQya2JtMThvY3UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1Njg4NzAxNDkxODEtYjdldW02MmoxZm5wOTRlNmkxa2I5Z3ByOWV2OG5lMG8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ2MDc5NTIxMjExMTAwODkyOTciLCJlbWFpbCI6Im1ha2VyZmFmZmFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJGYWJyaXppbyBHYXNwYXJpbmkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS1FudTduQXZtZEFfYlR4Q0FadWhWNFBwd29pdWJoLXowMUR1NHhjOXdRNzc0PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkZhYnJpemlvIiwiZmFtaWx5X25hbWUiOiJHYXNwYXJpbmkiLCJsb2NhbGUiOiJpdCIsImlhdCI6MTcwMTYzMzk4NSwiZXhwIjoxNzAxNjM3NTg1fQ.DaLblU4EnPk4iY_WMgyWD1CkFEITZtc0W3xL6sSo7a3X3RX-9tgC3rCac0GFB-7vi5oSSgY5IUS7N2zbp5KIeKJqxgQdrUUSo7-UHcbNiMYeAh8fjbls1R1Aq4PP6P38u2aRpo77ZTioZGEJB0yvikrflMjS7rgt4dnOK8AJKs8-QlCeqWOFaw4A6Dmln-pRlOZPZ8e0qnnwGI_1-ZzolfcD-YGojQklYi1MRbNThsrS7n5DuWBScfoLqiX8AcyInUXU_4wn8owOONyaUf59VUt9v-ZIzGoEIYM8mZJwjt-MeTWd414QKl2Xw6LP7G0WgzdEdwpn2OUnbYStbjEEUw"

# Dati da inviare nel corpo della richiesta, inclusivo del token

def get_data():
    url = "https://www.ilmenu.cloud/livescore/read/game.php"
    
    body = json.dumps({
        "token": TOKEN
    })

    
    data = {"gara": "", "girone": "", "commettee": "", "sqcasa": "", "sqtras": ""}

    response = requests.post(url, data=body)

    if response.status_code == 201:
        try:
            gara = response.json()[0]

            data["gara"] = gara["gara"]
            data["girone"] = gara["girone"]
            data["commettee"] = gara["commettee"]

            data["sqcasa"] = gara["sqcasa"]
            data["sqtras"] = gara["sqtras"]
            data["risultato"] = gara["risultato"]
            
        except json.decoder.JSONDecodeError:
            print("Errore nella decodifica JSON: Dati non validi")
    else:
        print(f"Errore nella richiesta API: {response.status_code}")

    return data

def get_partita_andata(data_gara):
    url = "https://www.spikevolley.it/livescore/read/giornate.php"

    body = json.dumps({ 
        "campionato": data_gara["girone"],
        "commettee": data_gara["commettee"]
    })

    response = requests.post(url, data=body)

    data = {}

    if response.status_code == 201:
        try:
            gare = response.json()

            for gara in gare:
                if gara["sqcasa"] == data_gara["sqtras"] and gara["sqtras"] == data_gara["sqcasa"]:
                    if gara["risultato"] != "-":
                        data["gara"] = gara["gara"]
                        data["risultato"] = gara["risultato"]
                        data["parziali"] = gara["parziali"]

            
        except json.decoder.JSONDecodeError:
            print("Errore nella decodifica JSON: Dati non validi")
    else:
        print(f"Errore nella richiesta API: {response.status_code}")

    return data

def get_classifica(data_gara):
    url = "https://www.spikevolley.it/livescore/read/giornate.php"

    body = json.dumps({ 
        "campionato": data_gara["girone"],
        "commettee": data_gara["commettee"]
    })

    response = requests.post(url, data=body)

    data = {"sqcasa": {"garevinte":0, "gareperse":0, "gare": 0, "garecasa": 0, "garetras": 0, "garevintecasa": 0, "garevintetras": 0, "punticasa": 0, "puntitras":0, "punti": 0}, "sqtras": {"garevinte":0, "gareperse":0, "gare": 0, "garecasa": 0, "garetras": 0, "garevintecasa": 0, "garevintetras": 0, "punticasa": 0, "puntitras":0, "punti": 0}}

    if response.status_code == 201:
        try:
            gare = response.json()

            for gara in gare:
                risultato = gara["risultato"]
                if risultato != "-":
                    if data_gara["sqcasa"] == gara["sqcasa"]:
                        risultato: str = gara["risultato"]

                        set_sqcasa = int(risultato.split("-")[0])
                        set_sqtras = int(risultato.split("-")[1])

                        if set_sqcasa > set_sqtras:
                            data["sqcasa"]["garevinte"] += 1
                            data["sqcasa"]["garevintecasa"] += 1
                            if set_sqtras < 2:
                                data["sqcasa"]["punti"] += 3
                                data["sqcasa"]["punticasa"] += 3
                            else:
                                data["sqcasa"]["punti"] += 2
                                data["sqcasa"]["punticasa"] += 2
                        else:
                            data["sqcasa"]["gareperse"] += 1
                            if set_sqcasa == 2:
                                data["sqcasa"]["punti"] += 1
                                data["sqcasa"]["punticasa"] += 1

                        data["sqcasa"]["gare"] += 1
                        data["sqcasa"]["garecasa"] += 1

                    if data_gara["sqcasa"] == gara["sqtras"]:
                        risultato: str = gara["risultato"]

                        set_sqcasa = int(risultato.split("-")[1])
                        set_sqtras = int(risultato.split("-")[0])

                        if set_sqcasa > set_sqtras:
                            data["sqcasa"]["garevinte"] += 1
                            data["sqcasa"]["garevintetras"] += 1
                            if set_sqtras < 2:
                                data["sqcasa"]["punti"] += 3
                                data["sqcasa"]["puntitras"] += 3
                            else:
                                data["sqcasa"]["punti"] += 2
                                data["sqcasa"]["puntitras"] += 2
                        else:
                            data["sqcasa"]["gareperse"] += 1
                            if set_sqcasa == 2:
                                data["sqcasa"]["punti"] += 1
                                data["sqcasa"]["puntitras"] += 1

                        data["sqcasa"]["gare"] += 1
                        data["sqcasa"]["garetras"] += 1

                    if data_gara["sqtras"] == gara["sqcasa"]:
                        risultato: str = gara["risultato"]

                        set_sqtras = int(risultato.split("-")[0])
                        set_sqcasa = int(risultato.split("-")[1])
                

                        if set_sqtras > set_sqcasa:
                            data["sqtras"]["garevinte"] += 1
                            data["sqtras"]["garevintecasa"] += 1
                            if set_sqcasa < 2:
                                data["sqtras"]["punti"] += 3
                                data["sqtras"]["punticasa"] += 3
                            else:
                                data["sqtras"]["punti"] += 2
                                data["sqtras"]["punticasa"] += 2
                        else:
                            data["sqtras"]["gareperse"] += 1
                            if set_sqtras == 2:
                                data["sqtras"]["punti"] += 1
                                data["sqtras"]["punticasa"] += 1

                        data["sqtras"]["gare"] += 1
                        data["sqtras"]["garecasa"] += 1

                    if data_gara["sqtras"] == gara["sqtras"]:
                        risultato: str = gara["risultato"]

                        set_sqtras = int(risultato.split("-")[1])
                        set_sqcasa = int(risultato.split("-")[0])
                

                        if set_sqtras > set_sqcasa:
                            data["sqtras"]["garevintetras"] += 1
                            data["sqtras"]["garevinte"] += 1
                            if set_sqcasa < 2:
                                data["sqtras"]["punti"] += 3
                                data["sqtras"]["puntitras"] += 3
                            else:
                                data["sqtras"]["punti"] += 2
                                data["sqtras"]["puntitras"] += 2
                        else:
                            data["sqtras"]["gareperse"] += 1
                            if set_sqtras == 2:
                                data["sqtras"]["punti"] += 1
                                data["sqtras"]["puntitras"] += 1

                        data["sqtras"]["gare"] += 1
                        data["sqtras"]["garetras"] += 1
            
        except json.decoder.JSONDecodeError:
            print("Errore nella decodifica JSON: Dati non validi")
    else:
        print(f"Errore nella richiesta API: {response.status_code}")

    return data


evaluation = 0 # evaluation > 0 --> Squadra in Casa || evaluation < 0 --> Squadra in Trasferta
max_evaluation = 78

# {"gara": "", "girone": "", "commettee": "", "sqcasa": "", "sqtras": "", "risultato": ""}
#data = {"gara": "71219_753_9", "girone": "71219", "commettee": "99934", "sqcasa": "VOLLEY SCANDIANO", "sqtras": "GS VVF 17 GOLD", "risultato": "-"} 
data = get_data()

andata = get_partita_andata(data)

punti_andata = 0
set_andata = 0

valuta_andata = False
if(andata != {}):
    valuta_andata = input("Valutare PARTITA andata? (S: sì | N: no): ")
    if valuta_andata.lower() == "s":
        valuta_andata = True

if(valuta_andata == True):
    risultato: str = andata["risultato"]
    set_sqcasa = int(risultato.split("-")[1])
    set_sqtras = int(risultato.split("-")[0])

    set_andata = round((set_sqcasa - set_sqtras) * 0.5, 2)

    parziali: str = andata["parziali"]
    punti = parziali.split(' ')

    punti_andata_sqcasa = 0
    punti_andata_sqtras = 0

    for punto in punti:
        if len(punto) > 3:
            char = "-"
            if "/" in punto:
                char = "/"
                
            punti_andata_sqcasa += int(punto.split(char)[1])
            punti_andata_sqtras += int(punto.split(char)[0])

    punti_andata = round((punti_andata_sqcasa - punti_andata_sqtras) * 0.1, 2)

classifica = get_classifica(data)

gare_sqcasa = classifica["sqcasa"]["gare"]
gare_sqtras = classifica["sqtras"]["gare"]

punti_sqcasa = classifica["sqcasa"]["punti"]
punti_sqtras = classifica["sqtras"]["punti"]


if gare_sqcasa != 0:
    rapp_punti_gare_sqcasa = round((punti_sqcasa / gare_sqcasa), 2)
else:
    rapp_punti_gare_sqcasa = punti_sqcasa

if gare_sqtras != 0:
    rapp_punti_gare_sqtras = round((punti_sqtras / gare_sqtras), 2)
else:
    rapp_punti_gare_sqtras = punti_sqtras

rapp_punti_gare = round((rapp_punti_gare_sqcasa - rapp_punti_gare_sqtras), 2)

punticasa_sqcasa = classifica["sqcasa"]["punticasa"]
puntitras_sqtras = classifica["sqtras"]["puntitras"]

garecasa_sqcasa = classifica["sqcasa"]["garecasa"]
garetras_sqtras = classifica["sqtras"]["garetras"]


if garecasa_sqcasa != 0:
    rapp_punti_sqcasa = round((punticasa_sqcasa / garecasa_sqcasa), 2)
else:
    rapp_punti_sqcasa = punticasa_sqcasa

if garetras_sqtras != 0:
    rapp_punti_sqtras = round((puntitras_sqtras / garetras_sqtras), 2)
else:
    rapp_punti_sqtras = puntitras_sqtras


rapp_punti = round((rapp_punti_sqcasa - rapp_punti_sqtras), 2)


evaluation += rapp_punti_gare
evaluation += rapp_punti
if(valuta_andata):
    evaluation += punti_andata
    evaluation += set_andata

evaluation = round(evaluation, 2)

sqcasa_vincente = evaluation > 0


print("\n============================================================\n")
if sqcasa_vincente:
    print(f"{data['sqcasa']} ha maggiore probabilità di VITTORIA: {abs(evaluation)}")
    print()
    print(f"== Valutazione Classifica ==")
    print(f"\tValutazione Punti Totali: {rapp_punti_gare} (C: {rapp_punti_gare_sqcasa} | T: {rapp_punti_gare_sqtras})")
    print(f"\tValutazione Punti Casa-Trasferta: {rapp_punti} (C: {rapp_punti_sqcasa} | T: {rapp_punti_sqtras})")

    if(valuta_andata == True):
        print()
        print(f"== Valutazione Gara Andata ==")
        print(f"\tValutazione Set: {set_andata} (C: {set_sqcasa} | T: {set_sqtras})")
        print(f"\tValutazione Punti: {punti_andata} (C: {punti_andata_sqcasa} | T: {punti_andata_sqtras})")

    print()
    print(f"== Valutazione Finale ==")

    print(f"\t** {abs(evaluation)} **")
    print()
else:
    print(f"{data['sqtras']} ha maggiore probabilità di VITTORIA: {abs(evaluation)}")
    print()
    print(f"== Valutazione Classifica ==")
    print(f"\tValutazione Punti: {-rapp_punti_gare} (T: {rapp_punti_gare_sqtras} | C: {rapp_punti_gare_sqcasa})")
    print(f"\tValutazione Rapporto Punti Classifica Casa-Trasferta: {-rapp_punti} (T: {rapp_punti_sqtras} | C: {rapp_punti_sqcasa})")

    if(andata != {} and valuta_andata == True):
        print()
        print(f"== Valutazione Gara Andata ==")
        print(f"\tValutazione Punti: {-set_andata} (T: {set_sqtras} | C: {set_sqcasa})")
        print(f"\tValutazione Set: {-punti_andata} (T: {punti_andata_sqtras} | C: {punti_andata_sqcasa})")

    print()
    print(f"== Valutazione Finale ==")

    print(f"\t** {abs(evaluation)} **")

# Punti => Punti Totali / Partite Giocate
# Fattore Campo Punti => Punti Casa / Partite Casa

print("\n============================================================\n")

def vota_vincitore(votazione):
    url = "https://www.spikevolley.it/livescore/create/scommesse.php"

    body = json.dumps({ 
        "idGara": votazione["idGara"],
        "casa": votazione["casa"],
        "trasferta": votazione["trasferta"],
        "token": TOKEN
    })

    response = requests.post(url, data=body)

    if response.status_code == 200:
        if str(response.json()["success"]).lower() == "false":
            print("\tERRORE durante la VOTAZIONE!")
        else:
            print(f"\t{data['sqcasa'] if votazione['casa'] == 1 else data['sqtras']} VOTATA con SUCCESSO!")


risultato = data["risultato"]
idGara = data["gara"]

if risultato != "-":
    set_sqcasa = int(risultato.split("-")[0])
    set_sqtras = int(risultato.split("-")[1])

    casa = 1 if set_sqcasa > set_sqtras else 0
    trasferta = 0 if set_sqcasa > set_sqtras else 1

    vincitore = {"idGara": idGara, "casa": casa, "trasferta": trasferta}

else:
    
    casa = 1 if evaluation > 0 else 0
    trasferta = 0 if evaluation > 0 else 1

    vincitore = {"idGara": idGara, "casa": casa, "trasferta": trasferta}


if evaluation == 0:
    print("Pareggio!")
    vota = input(f"VOTARE LA SQUADRA DI CASA ({data['sqcasa'] if vincitore['casa'] == 1 else data['sqtras']})? (S: sì | N: no): ")
else:
    vota = input(f"VOTARE {data['sqcasa'] if vincitore['casa'] == 1 else data['sqtras']} (Eval: {abs(evaluation)})? (S: sì | N: no): ")

if vota.lower() == "s":
    conferma = input("CONFERMARE? (S: sì | N: no): ")
    if conferma.lower() == "s":
        vota_vincitore(vincitore)
