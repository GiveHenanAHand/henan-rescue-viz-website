import argparse
import datetime
import json
import os
import re
import shutil
import time

import numpy as np
import requests
import schedule
import xlrd
from tqdm import tqdm

parser = argparse.ArgumentParser(description='Scraper for henan flood-related weibo')
parser.add_argument('--cache', type=str, default=None, help='cache numpy array')
parser.add_argument('--output', type=str, default=None, help='output json file')
parser.add_argument('--api_key', type=str, default=None, help='baidu API key')
parser.add_argument('--api_secret', type=str, default=None, help='baidu API secret')


def backup_if_exist(path):
    now = datetime.datetime.now()
    if os.path.exists(path):
        shutil.copy(path, path + f".{now.strftime('%Y%m%d%H%M%S')}.old")


class Save(object):
    def __init__(self, cache_path, output_path, api_key, api_secret):
        self.cache_path = cache_path
        self.output_path = output_path
        self.api_key = api_key
        self.api_secret = api_secret

    def Load(self, path):
        """
        Used to load data from existing file
        useless now.
        """

        self.data = dict()

        if os.path.exists(self.cache_path):
            self.data = np.load(self.cache_path, allow_pickle=True)[()]

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
        """
        Acquisite data from weibo
        Keyword : keyword for search
        Page : pages of data to climb
        Stop if repeat : only crawl the latest one when True, also crawl history when False
        """

        self.data = np.load(self.cache_path, allow_pickle=True)[()]

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
            try:
                id = i[-16:]
                if id in self.data:
                    if stop_if_repeat:
                        break
                    else:
                        continue
                else:
                    self.data[id] = dict()
                time.sleep(1)

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
                self.data[id]['valid'] = 1

                cnt += 1
            except Exception:
                print("weibo fetching error")

        print("aquisite %d info" % cnt)

        np.save("latest_data", self.data)

    def Process_content(self, Content):
        """
        Preprocessing the content from weibo to get an accurate address processing
        """
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
        """
        Query content in Baidu to get the address
        """

        Content = self.Process_content(Content)

        host = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=%s&client_secret=%s' \
               % (self.api_key, self.api_secret)
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
        """
        Process address in data by querying Baidu api
        """

        self.data = np.load(self.cache_path, allow_pickle=True)[()]

        ID = self.data.keys()

        cnt = 0
        for id in tqdm(ID):
            if not 'address' in self.data[id] and 'post' in self.data[id]:
                self.data[id]['address'] = ''
                self.data[id]['location'] = ''
                Q = self.Query_baidu(self.data[id]['post'])
                self.data[id]['address'] = Q['address']
                self.data[id]['location'] = Q['location']
                cnt += 1

        print("Query %d info" % cnt)

        np.save("latest_data", self.data)

    def Export(self):
        """
        Used to export data for visualization,
        data in json format
        """

        self.data = np.load(self.cache_path, allow_pickle=True)[()]

        news = []

        ID = self.data.keys()

        for id in ID:
            v = self.data[id]

            if 'address' in v and "河南" in v['address'] and v['valid'] == 1:
                news.append({"Time": v['time'], "address": v['address'], "location": v['location'], "post": v['post'],
                             "link": v["link"]})

        with open(self.output_path, "w", encoding="utf-8") as fp:
            json.dump(news, fp, ensure_ascii=False, indent=4)

        print("Export %d info" % len(news))

    def Update_Saved(self, del_id='0', del_keywords='error'):
        """
        Update the info that has been saved.
        """

        self.data = np.load(self.cache_path, allow_pickle=True)[()]

        ID = self.data.keys()

        for id in ID:
            if not 'valid' in self.data[id]:
                self.data[id]['valid'] = 1

            if self.data[id]['valid'] == 0:
                continue

            if del_keywords in self.data[id]['post']:
                print("delete " + self.data[id]['link'] + self.data[id]['post'])
                self.data[id]['valid'] = 0

        if del_id in ID:
            self.data[del_id]['valid'] = 0
            print("delete " + self.data[del_id]['post'])

        np.save("latest_data", self.data)

    def Recover(self, recover_id='0'):
        self.data = np.load(self.cache_path, allow_pickle=True)[()]

        if recover_id in self.data:
            self.data[recover_id]['valid'] = 1
            print("recover " + self.data[recover_id]['post'])

        np.save("latest_data", self.data)

    def Exec_timely(self):
        for i in tqdm(range(0, 50)):
            self.Acquisite_data("河南暴雨互助", page=i, stop_if_repeat=False)
        # self.Acquisite_data("河南暴雨互助", page=0, stop_if_repeat=False)
        self.Process_address()
        self.Export()


if __name__ == "__main__":
    args = parser.parse_args()
    S = Save(args.cache, args.output, args.api_key, args.api_secret)


    def run():
        backup_if_exist(args.cache)
        backup_if_exist(args.output)
        S.Exec_timely()


    schedule.every(30).minutes.do(lambda: run())

    run()
    while True:
        schedule.run_pending()
        time.sleep(60)
