import React, { useState, useCallback, useMemo } from "react";
import { Map, ScaleControl, ZoomControl, MapTypeControl, MapvglView, MapvglLayer } from 'react-bmapgl';
import { InfoWindow, LocationControl } from ".";
import { COLOR_MAP } from '../common/constant'
import { MARKER } from '../icon';

function BaiduMap(props) {
    const [focus, setFocus] = useState("")
    const [bounds, setBounds] = useState(null)
    const [shouldAutoFocus, setShouldAutoFocus] = useState(true)

    const mapRef = useCallback(node => {
        if (node !== null && bounds == null) {
            const map = node.map
            // updateBounds('init', map)
            props.mapInited()
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
        if (offset < 500 && bounds !== null) return
        if (map == null) return

        lastUpdateTime = Date.now()
        const visibleBounds = map.getBounds()
        setShouldAutoFocus(false)
        setBounds(visibleBounds)
        props.handleBoundChanged(visibleBounds)
    }

    function onWindowCloseClick(e) {
        e.stopPropagation()
        const item = {
            dataItem: {
                properties: focus
            }
        };
        onPointClick(item)
    }

    const onPointClick = useCallback((e) => {
        if (e.dataItem){
            const { geometry, properties } = e.dataItem;
            setShouldAutoFocus(true)
            if (focus === properties.id) {
                setFocus("")
            } else {
                setFocus(properties.id)
            }
        }
    }, [focus]);

    const geojson = props.data.map(item=>{
        delete item.icon
        delete item.color
        return {
            geometry: {
                type: 'Point',
                coordinates: [item.location.lng, item.location.lat],
            },
            properties: item,
        }
    })
    return <Map
        enableScrollWheelZoom={true}
        enableDragging={true}
        zoom={9}
        center={props.center}
        className="mapDiv"
        ref={mapRef}
        style={{ height: "100%" }}>
        <ZoomControl />
        <ScaleControl />
        <LocationControl />
        <MapTypeControl mapTypes={['normal', 'satellite']} />
        <InfoWindow
            item={props.data.find(e => e.id === focus)}
            shouldAutoCenter={shouldAutoFocus}
            onCloseClick={onWindowCloseClick} />
        <MapvglView>
            <MapvglLayer
                type="IconLayer"
                data={geojson}
                options={{
                    icon: './images/marker.svg',
                    color: (item)=>{
                        const { properties: { category} } = item
                        return COLOR_MAP[category]
                    },
                    size: 20,
                    enablePicked: true,// 是否可以拾取
                    selectedIndex: 99, // 选中数据项索引
                    selectedColor: '#ff0000', // 选中项颜色
                    autoSelect: true,// 根据鼠标位置来自动设置选中项
                    onClick: onPointClick,
                }}
            />
        </MapvglView>
    </Map>
}

export default BaiduMap
