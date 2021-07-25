import React, {useState, useCallback, useMemo} from "react";
import {Map, ScaleControl, ZoomControl} from 'react-bmapgl';
import { InfoMarker,InfoWindow,LocationControl } from ".";


function BaiduMap(props) {
    const [focus, setFocus] = useState("")
    const [bounds, setBounds] = useState(null)
    const [shouldAutoFocus, setShouldAutoFocus] = useState(true)

    function onClickMarker(id){
        setShouldAutoFocus(true)
        if (focus === id) {
            setFocus("")
        } else {
            setFocus(id)
        }
    }

    const mapRef = useCallback(node => {
        if (node !== null && bounds == null) {
            const map = node.map
            // updateBounds('init', map)
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
        console.log('update timedif ', offset)
        // infowindow/autoviewport triggers move/zoom event
        // which leads infinite loop
        // prevent frequent refreshing
        if (offset < 500 && bounds !== null) return
        if (map == null) return

        lastUpdateTime = Date.now()
        const visibleBounds = map.getBounds()
        setShouldAutoFocus(false)
        setBounds(visibleBounds)
        props.handleBoundChanged(visibleBounds)
    }

    function onWindowCloseClick() {
        onClickMarker(focus)
    }

    const infoMarkers = useMemo(() => {
        return props.data.map( item => {
                    // color in props.changeList has a higher priority
                    return <InfoMarker key={item.id} item={item} icon={props.changeList[item.id] || item.icon} onClickMarker={onClickMarker}/>
                })
    }, [props.changeList, props.data])

    return <Map
                enableScrollWheelZoom={true}
                enableDragging={true}
                zoom={9}
                center={props.center}
                className="mapDiv"
                ref={mapRef}
                style={{height: "100%"}}>
                <ZoomControl/>
                <ScaleControl/>
                <LocationControl/>
                { infoMarkers }
                <InfoWindow 
                    item={props.data.find(e => e.id === focus)}
                    shouldAutoCenter={shouldAutoFocus} 
                    onCloseClick={onWindowCloseClick}/>
            </Map>
}

export default BaiduMap