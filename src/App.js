import './App.css';
import {BaiduMap, Marker, InfoWindow, NavigationControl} from 'react-baidu-maps';
import data from './parse_json.json'

function App() {
    return (
        <div className={"rootDiv"}>
            <div className="info">本网站仅聚合新浪微博上发布的有关2021年7月河南暴雨的求助信息，请大家注意辨别信息真伪。点击标记点可以看到更多信息及原微博地址。</div>
            <BaiduMap defaultZoom={9} defaultCenter={data[0]["location"]} mapContainer={<div className={"mapDiv"}/>}>
                {data.map((record) => <Marker position={{lng: record["location"]["lng"] + Math.random()/10, lat: record["location"]["lat"] + Math.random()/10}}>
                    <InfoWindow content={
                        `<div>${record["post"]}</div><div>原微博：<a href=${record["link"]}>${record["link"]}</a></div>`} offset={{width: 0, height: -20}}/>
                </Marker>)}
                <NavigationControl
                    type="small"
                    anchor="top_right"
                    offset={{ width: 0, height: 30 }} />
            </BaiduMap>
        </div>
    );
}

export default App;
