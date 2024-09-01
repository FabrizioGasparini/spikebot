import json
import math

with open('partite.json', 'r') as partite:
    set_vinti = 0
    set_persi = 0

    tie_break = 0
    
    squadra = "VBSM U19M"
    girone = "71218"

    for partita in json.loads(partite.read()):
        split_char = '-'
        
        if partita["girone"] == girone:
            if partita["sqcasa"] == squadra:
                set_vinti += int(partita["risultato"].split(split_char)[0])
                set_persi += int(partita["risultato"].split(split_char)[1])

                if partita["risultato"] == "3-2" or partita["risultato"] == "2-3":
                    tie_break += 1
            elif partita["sqtras"] == squadra:
                set_vinti += int(partita["risultato"].split(split_char)[1])
                set_persi += int(partita["risultato"].split(split_char)[0])

                if partita["risultato"] == "3-2" or partita["risultato"] == "2-3":
                    tie_break += 1

    print(f'{set_vinti} - {set_persi}')
    print(f'{tie_break}')