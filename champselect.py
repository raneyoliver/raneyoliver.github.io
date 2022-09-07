from asyncio.windows_events import NULL
from email.mime import image
from lcu_driver import Connector
import json
import requests

req_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://developer.riotgames.com",
    "X-Riot-Token": "RGAPI-01fb97bd-731d-4f83-85a6-da99fe519d04"
}

f_summoners = "C:\\Users\\Oliver\\Documents\\PythonProjects\\raneyoliver.github.io\\src\\stats\\summoners.txt"
f_stats = "C:\\Users\\Oliver\\Documents\\PythonProjects\\raneyoliver.github.io\\src\\stats\\stats.txt"
f_image_names = "C:\\Users\\Oliver\\Documents\\PythonProjects\\raneyoliver.github.io\\src\\stats\\image_names.txt"
f_champions = "C:\\Users\\Oliver\\Documents\\PythonProjects\\raneyoliver.github.io\\src\\stats\\champions.txt"
f_positions = "C:\\Users\\Oliver\\Documents\\PythonProjects\\raneyoliver.github.io\\src\\stats\\positions.txt"

def fix_name(n):
    split = n.find("'")
    if not split == -1:
        n = n[:split] + str.lower(n[split + 1:])    # Cho'Gath -> Chogath
        
        if n == "Kogmaw":
            n = "KogMaw"
        elif n == "Reksai":
            n = "RekSai"
    else:                                           # edge cases
        if n == "LeBlanc":
            n = "Leblanc"
        elif n == "Nunu & Willump":
            n = "Nunu"
        elif n == "Renata Glasc":
            n = "Renata"
        elif n == "Master Yi":
            n = "MasterYi"
        elif n == "Jarvan IV":
            n = "JarvanIV"
        elif n == "Tahm Kench":
            n = "TahmKench"
        elif n == "Wukong":
            n = "MonkeyKing"
        elif n == "Dr. Mundo":
            n = "DrMundo"
        elif n == "Aurelion Sol":
            n = "AurelionSol"
        elif n == "Miss Fortune":
            n = "MissFortune"

    return n

#file = "C:\\Users\\Oliver\\Documents\\PythonProjects\\raneyoliver.github.io\\src\\description.txt"
#previous_players = ["-1", "-1", "-1", "-1", "-1"]
prev_description = ""
connector = Connector()

# fired when LCU API is ready to be used
@connector.ready
async def connect(connection):
    print('LCU API is ready to be used.')


# fired when League Client is closed (or disconnected from websocket)
@connector.close
async def disconnect(_):
    print('The client have been closed!')
    await connector.stop()

summoner_ids = []
display_names = [""] * 10
ranks = [""] * 10
games_played = [""] * 10
winrates = [-1.0] * 10
champion_names = [""] * 10
pos = [""] * 10


async def start(connection):
    # Get Summoner IDs and positions
    session_info = await connection.request('get', f'/lol-champ-select/v1/session/')
    data = await session_info.json()    
    my_team = data['myTeam']
    for i in range(len(my_team)):
        summoner = my_team[i]
        summoner_ids.append(summoner['summonerId'])
        pos[i] = summoner['assignedPosition']

        # Get Stats
        if summoner_ids[i] == 0:    # No Summoner in slot i
            continue

        # Get Display Names and PUUIDs (lol-summoner/v1/summoners/id)
        puuid_info = await connection.request('get', f'/lol-summoner/v1/summoners/{summoner_ids[i]}')
        data = await puuid_info.json()
        display_names[i] = data['displayName']

        # Get Ranks, Winrates, Games Played (lol-ranked/v1/ranked-stats/puuid)
        encrypted_info = requests.get(f'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{display_names[i]}', headers=req_headers)
        data = json.loads(encrypted_info.text)
        encrypted_summoner_id = data["id"]

        ranked_info = requests.get(f'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{encrypted_summoner_id}', headers=req_headers)
        data = json.loads(ranked_info.text)
        wins = int(data[0]["wins"])
        losses = int(data[0]["losses"])
        tier = data[0]["tier"]
        division = data[0]["rank"]
        lp = data[0]["leaguePoints"]

        ranks[i] = f"{tier} {division} {lp} LP"
        games_played[i] = wins + losses
        winrates[i] = round(float(wins / games_played[i]) * 100, 1)

        summoners = ""
        stats = ""
        positions = ""
        if not summoner_ids[i] == 0:
            summoners += f"{display_names[i]}\n"
            stats += f"{ranks[i]} WR: {winrates[i]}% ({games_played[i]} games)\n"
            positions += pos[i] + "\n"
    
    # Only need to write these once
    with open(f_summoners, "w") as f:
        f.write(summoners)
    with open(f_stats, "w") as f:
        f.write(stats)
    with open(f_positions, "w") as f:
        f.write(positions)
    

@connector.ws.register(f'/lol-champ-select/v1/summoners/', event_types=('UPDATE',))
async def select_updated(connection, event):
    if len(summoner_ids) == 0:
        print("Champ Select Started")
        await start(connection)

    # Timer
    # timer_info = await connection.request('get', f'/lol-champ-select/v1/session/timer')
    # data = await timer_info.json()
    # time_left = data['adjustedTimeLeftInPhase']

    # Get Champions
    championIds = [""] * 10
    session_info = await connection.request('get', f'/lol-champ-select/v1/session/')
    if not session_info.status == 200:
        return
    data = await session_info.json()
    my_team = data['myTeam']
    their_team = data['theirTeam']
    for i in range(len(my_team)):
        summoner = my_team[i]
        championIds[i] = summoner['championId']
    for i in range(len(their_team)):
        summoner = their_team[i]
        championIds[i + len(my_team)] = summoner['championId']
    for i in range(len(championIds)):
        if championIds[i] == 0:
            continue
        champion_info = await connection.request('get', f'/lol-champ-select/v1/grid-champions/{str(championIds[i])}')
        if not champion_info.status == 200:
            continue

        data = await champion_info.json()
        champion_names[i] = data['name']

    image_names = ""
    champions = ""
    for k in range(len(champion_names)):
        image_names += fix_name(champion_names[k]) + "\n"
        champions += champion_names[k] + "\n"
        
    # Updated every change
    with open(f_image_names, "w") as f:
        f.write(image_names)
    with open(f_champions, "w") as f:
        f.write(champions)
    







connector.start()
