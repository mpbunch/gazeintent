import random
import time
import json
# [{“meta”:{“start”:1111,“end”:2222},“data”:[{“cell”:2, “stim”:“square”, “start”:1111, “end”:2222, “gaze”:1100, “color”:“red”, “latency”:20},{“cell”:9, “stim”:“square”, “start”:1111, “end”:2222, “gaze”:1100, “color”:“red”, “latency”:20},{“cell”:4, “stim”:“square”, “start”:1111, “end”:2222, “gaze”:1100, “color”:“red”, “latency”:20}]}]

def meta():
    s = int(time.time()) * 1000
    e = s + random.randrange(3000,4500)
    payload['meta'] = {"start": s, "end": e, "diff":e-s}

def data():
    cell = random.randrange(1, events_per+1)
    # stimulus starts
    ss = int(time.time()) * 1000
    # stimulus end random
    ser = random.randrange(3000, 6000)
    # stimulus ends
    se = ss + ser
    # gaze starts
    gs = ss + random.randrange(100,2000)
    # gaze ends random
    ger = random.randrange(500, 3000) if gs + 3000 < se else ser-1000
    # gaze ends
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
    for ix in range(0, how_many):
        payload = {'meta':{},'data':[], 'type':'test'}
        meta()
        for i in range(0, events_per):
            data()
            time.sleep(random.randrange(2,5))
        insert()
        time.sleep(random.randrange(5,9))
