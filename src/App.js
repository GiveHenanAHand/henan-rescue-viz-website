import './App.css';
import {Map, ScaleControl, ZoomControl} from 'react-bmapgl';
import React, {useEffect, useState} from "react";
import {InfoMarker} from "./InfoMarker";
import { InfoHeader } from "./components";


function App() {
    const [timeRange, setTimeRange] = useState(8)
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
                        [serverDataEntry.link]: {
                            record: serverDataEntry,
                            latLong: {
                                lng: serverDataEntry.location.lng + Math.random() / 1000,
                                lat: serverDataEntry.location.lat + Math.random() / 1000
                            }
                        }
                    }
                )));
            setData(pointDict);
        }
    };
    xhr.open("GET", "https://api-henan.tianshili.me/parse_json.json");
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
                        currentTimestamp - Date.parse(currentDataEntry.record.Time) < timeRange * 60 * 60 * 1000
                )
            );
        }
        return currentFilteredData
    }

    let slider = () => {
        let labelText = "最近" + timeRange + "小时";
        if (timeRange === 12) {
            labelText = "全部记录"
        }
        return <label>
            <input id="sliderRange" type="range" min="2" max="12" value={timeRange} onChange={handleSliderChange}
                   step="2"/>
            {labelText}
        </label>
    }

    let handleSliderChange = (e) => {
        setTimeRange(e);
    }

    let infoMarkers = Object.entries(filterData()).map(
        ([link, entry]) =>
            <InfoMarker key={entry.record.link} record={entry.record} latLong={entry.latLong} focus={focus} onClickMarker={onClickMarker}/>)

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
