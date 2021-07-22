import './App.css';
import {BaiduMap, Marker, InfoWindow, NavigationControl} from 'react-baidu-maps';
import data from './parse_json.json'

function App() {
    return (
        <div className={"rootDiv"}>
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
