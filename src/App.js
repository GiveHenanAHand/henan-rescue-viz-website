import './App.css';
import { BaiduMap, Marker, InfoWindow, NavigationControl, GeolocationControl, MapTypeControl, asyncWrapper } from 'react-baidu-maps';
import { useCallback, useEffect, useState } from "react";
import { LEFT_FOLD } from './icon';
const AsyncMap = asyncWrapper(BaiduMap);

function App() {
    const [timeRange, setTimeRange] = useState(8)
    const [data, setData] = useState([])

    useEffect(() => {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (data.length === 0) {
                setData(JSON.parse(xhr.responseText));
            }
        };
        xhr.open("GET", "https://api-henan.tianshili.me/parse_json.json");
        xhr.send()
    }, [])

    let filterData = () => {
        let filtered_data = [];
        if (timeRange === 12) {
            filtered_data = data
        } else {
            const currentTimestamp = Date.now()
            for (let i = 0; i < data.length; ++i) {
                if (currentTimestamp - Date.parse(data[i]["Time"]) < timeRange * 60 * 60 * 1000) {
                    filtered_data.push(data[i])
                }
            }
        }
        return filtered_data.map(drawPoints)
    }

    let drawPoints = (record) => <Marker key={record["link"]} position={
        { lng: record["location"]["lng"] + Math.random() / 1000, lat: record["location"]["lat"] + Math.random() / 1000 }
    }>
        <InfoWindow content={
            `
            <div>${record["post"]}</div>
            <div>原微博：<a target="_blank" rel="noopener noreferrer" href=${record["link"]}>${record["link"]}</a></div>
            <div>发布时间: 7月${record["Time"].substring(8, 10)}日 ${record["Time"].substring(11, 20)}</div>
            `
        } offset={{ width: 0, height: -20 }} />
    </Marker>

    let handleSliderChange = (value) => {
        setTimeRange(value)
    }

    return (
        <div className={"rootDiv"}>
            <InforHeader notifySliderChange={handleSliderChange}/>
            <AsyncMap
                mapUrl={`https://api.map.baidu.com/api?v=2.0&ak=mTM4lv5gl2AenfvEuC8hV6DMGyWF4mBZ`}
                loadingElement={<div style={{textAlign: 'center', fontSize: 40}}>Loading.....</div>}
                enableScrollWheelZoom
                enableDragging
                defaultZoom={9}
                defaultCenter={{lng:113.802193, lat:34.820333}}
                mapContainer={<div className={"mapDiv"}/>}>
                    {filterData()}
                <NavigationControl
                    type="small"
                    anchor="top_right"
                    offset={{ width: 15, height: 40 }} />
                <GeolocationControl />
                <MapTypeControl mapTypes={['normal', 'satellite']}/>
            </AsyncMap>
        </div>
    );
}

function InforHeader(props) {
    const [isFold, setIsFold] = useState(false)
    const [timeRange, setTimeRange] = useState(8)

    const onLeftFold = useCallback((e) => {
        e.stopPropagation();
        setIsFold(!isFold);
    }, [isFold])
    

    let handleSliderChange = (e) => {
        setTimeRange(e.target.value)
        props.notifySliderChange(e.target.value)
    }

    let slider = () => {
        let labelText = "最近" + timeRange + "小时";
        if (timeRange === 12) {
            labelText = "全部记录"
        }
        return <label>
            <input id="sliderRange" type="range" min="2" max="12" value={timeRange} onChange={handleSliderChange} step="2" />
            {labelText}
        </label>
    }

    return (
            <div className="info-container" data-fold={isFold onClick={onLeftFold}}>
                <div className="info" data-fold={isFold}>
                    <div>本网站仅聚合新浪微博上发布的有关2021年7月河南暴雨的求助信息，请大家注意辨别信息真伪。点击标记点可以看到更多信息及原微博地址。</div>
                    <br />
                    {slider()}
                </div>
                <div className="left-fold" data-fold={isFold}>{LEFT_FOLD}</div>
            </div>
    )
}

export default App;
