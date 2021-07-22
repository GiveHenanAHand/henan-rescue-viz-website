import os
import re
import time
import json
import xlrd
import xlwt
import cpca
from datetime import datetime, timezone
import requests
import numpy as np
from tqdm import tqdm

class Save(object):
    def __init__(self):
        pass

    def Load(self, path):
        '''
        Used to load data from existing file
        useless now.
        '''

        self.data = dict()

        if os.path.exists("latest_data.npy"):
            self.data = np.load("latest_data.npy", allow_pickle=True)[()]

        if 'xlsx' in path:
            workBook = xlrd.open_workbook(path)
            sheet1_content1 = workBook.sheet_by_index(0)

            for i in tqdm(range(sheet1_content1.nrows)):
                Time = sheet1_content1.cell(i, 0).value
                Link = sheet1_content1.cell(i, 1).value
                Content = sheet1_content1.cell(i, 2).value

                id = Link[-16:]

                if not id in self.data:
                    self.data[id] = dict()

                self.data[id]['time'] = Time
                self.data[id]['link'] = Link
                self.data[id]['post'] = Content

        elif 'json' in path:
            f = open(path, 'r', encoding='utf-8')
            text = f.read()
            data = json.loads(text)

            for v in data:
                id = v['link'][-16:]

                if not id in self.data:
                    self.data[id] = dict()

                self.data[id]['time'] = v['Time']
                self.data[id]['address'] = v['address']
                self.data[id]['location'] = v['location']
                self.data[id]['post'] = v['post']
                self.data[id]['link'] = v['link']

        np.save("latest_data", self.data)

    def Acquisite_data(self, keyword="暴雨互助", page=10, stop_if_repeat=True):
        '''
        Acquisite data from weibo
        Keyword : keyword for search
        Page : pages of data to climb
        Stop if repeat : only crawl the latest one when True, also crawl history when False
        '''

        self.data = np.load("latest_data.npy", allow_pickle=True)[()]

        params = {
            'containerid': f'100103type=1&q={keyword}',
            'page_type': 'searchall',
            'page': page
        }
        url = 'https://m.weibo.cn/api/container/getIndex?'
        response = requests.get(url, params=params).text
        id_ls = re.findall('"id":"(.{16}?)",', response, re.DOTALL)
        detail_url = ['https://m.weibo.cn/detail/' + i for i in id_ls]

        cnt = 0
        for i in detail_url:
            time.sleep(1)
            id = i[-16:]
            if id in self.data:
                if stop_if_repeat:
                    break
                else:
                    continue
            else:
                self.data[id] = dict()

            response = requests.get(i).text
            data = re.findall("var \$render_data = \[({.*})]\[0]", response, re.DOTALL)[0]
            data = json.loads(data)['status']

            created_at_time = data['created_at']
            log_text = data['text']
            log_text = re.sub('<.*?>', '', log_text)

            print(created_at_time, i, log_text)
            self.data[id]['time'] = created_at_time
            self.data[id]['link'] = i
            self.data[id]['post'] = log_text
            self.data[id]['checked_times'] = 1

            cnt += 1

        print("aquisite %d info" % cnt)

    def Process_content(self, Content):
        '''
        Preprocessing the content from weibo to get an accurate address processing
        '''
        Content = list(Content)
        lst = -1
        if "#" in Content:
            for i in range(len(Content)):
                if Content[i] == "#":
                    if lst != 0:
                        for j in range(lst, i + 1):
                            Content[j] = ' '
                        lst = -1
                    else:
                        lst = i
        Content = ''.join(Content)

        punctuation = r"""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~“”？#?，！【】（）、。：；’‘……￥·"""

        Content = re.sub(r'[{}]+'.format(punctuation), ' ', Content)
        return Content.strip()

    def Query_baidu(self, Content):
        '''
        Query content in Baidu to get the address
        '''

        API_KEY = 'Your API Key'
        SECRET_KEY = 'Your Secret Key'

        Content = self.Process_content(Content)

        host = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=%s&client_secret=%s' % (
            API_KEY, SECRET_KEY)
        response = requests.get(host)

        Result = dict()
        Result['address'] = ''
        Result['location'] = ''

        if response:
            rjson = response.json()
            access_token = rjson['access_token']

            r = requests.post("https://aip.baidubce.com/rpc/2.0/nlp/v1/address?access_token=%s" % access_token,
                              json={'text': Content})

            data = json.loads(r.text)

            if not 'province' in data:
                return Result

            location = data['province'] + data['city'] + data['town']

            if (len(location) == 0):
                return Result

            latitude = data['lat']
            longitude = data['lng']

            Result['address'] = location
            Result['location'] = {"lng": longitude, "lat": latitude}

        return Result

    def Process_address(self):
        '''
        Process address in data by querying Baidu api
        '''

        self.data = np.load("latest_data.npy", allow_pickle=True)[()]

        ID = self.data.keys()

        cnt = 0
        for id in tqdm(ID):
            if not 'address' in self.data[id]:
                self.data[id]['address'] = ''
                self.data[id]['location'] = ''
                Q = self.Query_baidu(self.data[id]['post'])
                self.data[id]['address'] = Q['address']
                self.data[id]['location'] = Q['location']
                cnt += 1

        print("Query %d info" % cnt)

        np.save("latest_data", self.data)

    def Export(self):
        '''
        Used to export data for visualization,
        data in json format
        '''

        self.data = np.load("latest_data.npy", allow_pickle=True)[()]

        news = []

        ID = self.data.keys()

        for id in ID:
            v = self.data[id]

            if 'address' in v and "河南" in v['address']:
                news.append({"Time": v['time'], "address": v['address'], "location": v['location'], "post": v['post'],
                             "link": v["link"]})

        with open("final.json", "w", encoding="utf-8") as fp:
            json.dump(news, fp, ensure_ascii=False, indent=4)

        print("Export %d info" % len(news))

    def Update_Saved(self, max_time=5):
        """
        To check if the weibo is still active
        logic is similar to slow start
        max check time can be customized, default set to 4 which means after 32 hours
        we will not check the status of the weibo again
        """
        self.data = np.load("latest_data.npy", allow_pickle=True)[()]

        res = {}
        for k, v in self.data.items():
            # check if it exceeds the max check times
            try:
                # TODO: why is this weibo still here? may need manual work from authorized persons
                times = v['checked_times']
                if times >= max_time:
                    res[k] = v
                    continue
                # check if it needs to be revisit
                utc_dt = datetime.now(timezone.utc)  # UTC time
                current_time = utc_dt.astimezone()  # local time
                created = datetime.strptime(v['time'], '%a %b %d %H:%M:%S %z %Y')
                delta = current_time - created
                if delta.total_seconds() <= pow(2, times) * 3600:
                    res[k] = v
                    continue
                # check if it's still active
                text = requests.get(v['link']).text
                if re.search("微博不存在或暂无查看权限!", text):
                    continue
                else:
                    v['checked_times'] = times + 1
                    res[k] = v
            except Exception as e:
                # keeps current one
                res[k] = v

        np.save("latest_data", res)

    def Exec_timely(self):
        self.Update_Saved()
        self.Acquisite_data()
        self.Process_address()
        self.Export()


if __name__ == "__main__":
    S = Save()

    S.Exec_timely()
