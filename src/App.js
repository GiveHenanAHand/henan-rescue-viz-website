import React, {useEffect, useState, useCallback, useMemo} from "react";
import { Map, ScaleControl, ZoomControl} from 'react-bmapgl';
import { BaiduMap, InfoHeader,InfoMarker,InfoWindow } from "./components";
import './styles/App.css';

function App() {
    const [timeRange, setTimeRange] = useState(6)
    const [data, setData] = useState({})
    const [bounds, setBounds] = useState(null)

    useEffect(() => {
        console.log("enter page")
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (Object.keys(data).length === 0) {
            const serverData = JSON.parse(xhr.responseText)
            let pointDict = Object.assign({}, ...serverData.map(
                (serverDataEntry) => (
                    {
                        [serverDataEntry.link]: {
                            record: serverDataEntry,
                            // including different ways to create the latLong and time fields to make it compatible
                            // across different versions of json format; only for the transition phase
                            latLong: {
                                lng: (serverDataEntry.location && serverDataEntry.location.lng) || serverDataEntry.lng + Math.random() / 1000,
                                lat: (serverDataEntry.location && serverDataEntry.location.lat) || serverDataEntry.lat + Math.random() / 1000
                            },
                            time: serverDataEntry.Time || serverDataEntry.time
                        }
                    }
                    )));
                setData(pointDict);
            }
        };
        xhr.open("GET", "https://api-henan.tianshili.me/parse_json.json");
        xhr.send()
    }, [])

    let filterData = useMemo(() => {
        let currentFilteredData;
        console.log("update filter!")
        if (timeRange === 12) {
            currentFilteredData = data
        } else {
            const currentTimestamp = Date.now()
            currentFilteredData = Object.fromEntries(
                Object.entries(data).filter(
                    ([link, currentDataEntry]) =>
                        (currentTimestamp - Date.parse(currentDataEntry.time) < timeRange * 60 * 60 * 1000)
                )
            );
        }
        return currentFilteredData
    }, [data, timeRange])

    let handleSliderChange = (e) => {
        setTimeRange(e);
    }

    function updateBounds(newBounds) {
        setBounds(newBounds)
    }

    return (
        <div className={"rootDiv"}>
            <InfoHeader list={Object.values(filterData).map(e => e.record)} bounds={bounds} notifySliderChange={handleSliderChange}/>
            <BaiduMap 
                data={filterData}
                handleBoundChanged={updateBounds}/>
        </div>
    );
}

export default App;
