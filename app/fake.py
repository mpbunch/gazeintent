import random
import time
import json
# [{“meta”:{“start”:1111,“end”:2222},“data”:[{“cell”:2, “stim”:“square”, “start”:1111, “end”:2222, “gaze”:1100, “color”:“red”, “latency”:20},{“cell”:9, “stim”:“square”, “start”:1111, “end”:2222, “gaze”:1100, “color”:“red”, “latency”:20},{“cell”:4, “stim”:“square”, “start”:1111, “end”:2222, “gaze”:1100, “color”:“red”, “latency”:20}]}]

def meta():
    s = int(time.time()) * 1000
    e = s + random.randrange(30,45)
    payload['meta'] = {"start": s, "end": e}

def data():
    cell = random.randrange(1, 9)
    ss = int(time.time()) * 1000
    ser = random.randrange(3, 5)
    se = int(time.time()) * 1000 + ser
    gs = ss + random.randrange(1,3)
    ger = random.randrange(1, 3) if gs + 3 < se else ser
    ge = gs + ger
    selected_stim = stim[random.randrange(0,len(stim))]
    selected_color = color[random.randrange(0,len(color))]
    gaze = {
        "cell": cell,
        "stimStart": ss,
        "stimEnd": se,
        "gazeStart": gs,
        "gazeEnd": ge,
        "color":selected_color,
        "stim":selected_stim
    
    }
    payload['data'].append(gaze)

def insert():
    cmd = f"INSERT INTO calibrate (data, user_id) VALUES ('{json.dumps(payload)}', 38);"
    print(cmd)

if __name__ == "__main__":
    how_many = 20
    events_per = 9
    stim = ['square', 'triangle', 'circle', 'rombus', 'rectangle', 'star', 'smile']
    color = ['red', 'green', 'blue', 'purple', 'orange', 'black', 'teal', 'pink']
    for ix in range(1, how_many):
        payload = {'meta':{},'data':[], 'type':'test'}
        meta()
        for i in range(1, events_per+1):
            data()
        insert()
        time.sleep(random.randrange(1,3))