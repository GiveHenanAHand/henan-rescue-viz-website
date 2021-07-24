import './App.css';
import {Map, ScaleControl, ZoomControl} from 'react-bmapgl';
import React, {useEffect, useState} from "react";
import { InfoHeader,InfoMarker } from "./components";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [timeRange, setTimeRange] = useState(6)
    const [data, setData] = useState({})
    const [focus, setFocus] = useState("")

    let onClickMarker = (link) => {
        return () => {
            if (focus === link) {
                setFocus("")
            } else {
                setFocus(link)
            }
        }
    }

    useEffect(() => {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (Object.keys(data).length === 0) {
            const serverData = JSON.parse(xhr.responseText)
            let pointDict = Object.assign({}, ...serverData.map(
                (serverDataEntry) => (
                    {
                        [serverDataEntry['微博链接']]: {
                            record: serverDataEntry,
                            latLong: {
                                lng: serverDataEntry['经度'] + Math.random() / 1000,
                                lat: serverDataEntry['纬度'] + Math.random() / 1000
                            }
                        }
                    }
                )));
            setData(pointDict);
        }
    };
    xhr.open("GET", "https://gist.githubusercontent.com/DrustZ/924be8ed71ae11ce47e94b9a829494d8/raw/2dfa6180e350169c4d5c8065cee787293b5f4390/test.json")//"https://api-henan.tianshili.me/parse_json.json");
    xhr.send()
    }, [])

    let filterData = () => {
        let currentFilteredData;
        if (timeRange === 12) {
            currentFilteredData = data
        } else {
            const currentTimestamp = Date.now()
            currentFilteredData = Object.fromEntries(
                Object.entries(data).filter(
                    ([link, currentDataEntry]) =>
                        currentTimestamp - Date.parse(currentDataEntry.record['时间']) < timeRange * 60 * 60 * 1000
                )
            );
        }
        return currentFilteredData
    }

    let handleSliderChange = (e) => {
        setTimeRange(e);
    }

    let infoMarkers = Object.entries(filterData()).map(
        ([link, entry]) =>
            <InfoMarker key={entry.record['微博链接']} record={entry.record} latLong={entry.latLong} focus={focus} onClickMarker={onClickMarker}/>)

    return (
        <div className={"rootDiv"}>
            <InfoHeader notifySliderChange={handleSliderChange}/>

            <Map
                enableScrollWheelZoom={true}
                enableDragging={true}
                zoom={9}
                center={{lng: 113.802193, lat: 34.820333}}
                className="mapDiv"
                style={{height: "100%"}}>
                <ZoomControl/>
                <ScaleControl/>
                {infoMarkers}
            </Map>
        </div>
    );
}

export default App;
