import React, {useEffect, useState, useCallback} from "react";
import {CustomOverlay, Map, ScaleControl, ZoomControl} from 'react-bmapgl';
import { InfoHeader,InfoMarker } from "./components";
import { Card } from "antd";
import './styles/App.css';

function App() {
    const [timeRange, setTimeRange] = useState(6)
    const [data, setData] = useState({})
    const [focus, setFocus] = useState("")
    const [bounds, setBounds] = useState(null)

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

    let filterData = () => {
        let currentFilteredData;
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
    }

    let handleSliderChange = (e) => {
        setTimeRange(e);
    }

    const mapRef = useCallback(node => {
        if (node !== null && bounds == null) {
            const map = node.map
            updateBounds('init', map)
            map.addEventListener('moveend', () => {
                updateBounds('moveend', map)
            })
            map.addEventListener('zoomend', () => {
                updateBounds('zoomend', map)
            })
        }
    }, []);

    let lastUpdateTime = Date.now()
    const updateBounds = (type, map) => {
        const offset = Date.now() - lastUpdateTime;

        // infowindow/autoviewport triggers move/zoom event
        // which leads infinite loop
        // prevent frequent refreshing
        if (offset < 500) return

        if (map == null) return

        lastUpdateTime = Date.now()

        // console.log(`${type} end`)
        const visibleBounds = map.getBounds()
        setBounds(visibleBounds)
    }

    let infoMarkers = Object.entries(filterData()).map(
        ([link, entry]) =>
            <InfoMarker key={entry.record.link} record={entry.record} latLong={entry.latLong} time={entry.time} focus={focus} onClickMarker={onClickMarker}/>)

    let infoWindow = (link) => {
        if (!link || link.length === 0) return null

        const item = filterData()[link]
        if (typeof (item) === 'undefined') return null

        return <CustomOverlay
            position={item.record.location}
            // onClickclose={onClickMarker()(item.record.link)}
            onClickclose={() => console.log("testtest")}
            autoViewport={true}>
                <Card>
                    <div>
                        发布时间: 7月{item.time.substring(8, 10)}日
                        {item.time.substring(11, 20)}</div>
                    <div>{item.record.post}</div>
                    <hr />
                    <div>原微博：
                    <a target="_blank" rel="noopener noreferrer"
                        href={item.record.link}>{item.record.link}</a>
                    </div>
                </Card>
            </CustomOverlay>
    }

    return (
        <div className={"rootDiv"}>
            <InfoHeader list={Object.values(filterData()).map(e => e.record)} bounds={bounds} notifySliderChange={handleSliderChange}/>

            <Map
                enableScrollWheelZoom={true}
                enableDragging={true}
                zoom={9}
                center={{lng: 113.802193, lat: 34.820333}}
                className="mapDiv"
                ref={mapRef}
                style={{height: "100%"}}>
                <ZoomControl/>
                <ScaleControl/>
                {infoMarkers}
                {infoWindow(focus)}
            </Map>
        </div>
    );
}

export default App;
