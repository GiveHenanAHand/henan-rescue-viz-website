import './App.css';
import {BaiduMap, Marker, InfoWindow, NavigationControl} from 'react-baidu-maps';
import data from './parse_json.json'
import {useState} from "react";

function App() {
    const [timePreference, setTimePreference] = useState("see_all")

    const currentTimestamp = Date.now()
    let latest_data = []
    let i;
    for (i = 0 ; i < data.length ; ++i) {
        if (currentTimestamp - Date.parse(data[i]["Time"]) < 6 * 60 * 60 * 1000) {
            latest_data.push(data[i])
        }
    }
    let drawPoints = (record) => <Marker position={{lng: record["location"]["lng"] + Math.random()/10, lat: record["location"]["lat"] + Math.random()/10}}>
        <InfoWindow content={
            `<div>${record["post"]}</div><div>原微博：<a target="_blank" rel="noopener noreferrer" href=${record["link"]}>${record["link"]}</a></div><div>发布时间: 7月${record["Time"].substring(8,10)}日 ${record["Time"].substring(11, 20)}</div>`} offset={{width: 0, height: -20}}/>
    </Marker>
    let timePreferenceOnChange = (selection) => {console.log(selection.target.value); setTimePreference(selection.target.value)}
    return (
        <div className={"rootDiv"}>
            <div className="info">
                <div>本网站仅聚合新浪微博上发布的有关2021年7月河南暴雨的求助信息，请大家注意辨别信息真伪。点击标记点可以看到更多信息及原微博地址。</div>
                <br/>
                <input type="radio" id="see_all" name="see_all" value="see_all"
                       checked={timePreference === "see_all"}
                       onChange={timePreferenceOnChange}/>
                <label htmlFor="see_all">全部记录</label>
                <input type="radio" id="see_latest" name="see_latest" value="see_latest"
                       checked={timePreference === "see_latest"}
                       onChange={timePreferenceOnChange}/>
                <label htmlFor="see_latest">只看最近六小时</label>
            </div>
            <BaiduMap defaultZoom={9} defaultCenter={{lng:113.802193, lat:34.820333}} mapContainer={<div className={"mapDiv"}/>}>
                {(timePreference === "see_all") && data.map(drawPoints)}
                {(timePreference === "see_latest") && latest_data.map(drawPoints)}
                <NavigationControl
                    type="small"
                    anchor="top_right"
                    offset={{ width: 0, height: 30 }} />
            </BaiduMap>
        </div>
    );
}

export default App;
