import requests
import json

URL_BASE = 'https://www.spikevolley.it'

def getCampionati():
    for campionato in json.loads(open('campionati.json', 'r').read()):
        response = requests.post(f'{URL_BASE}/livescore/read/giornate.php', data=json.dumps({"commettee": "99934", "campionato": campionato["id"]}))
        if response.status_code == 201:
            data = response.json()
            with open('partite.json', 'r') as file:
                output = json.loads(file.read())
                for partita in data:
                    output.append(partita)


            with open('partite.json', 'w') as file:
                file.write(json.dumps(output))

getCampionati()