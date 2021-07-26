import React, { useState, useCallback, useMemo } from "react";
import { Map, ScaleControl, ZoomControl, MapTypeControl, MapvglView, MapvglLayer } from 'react-bmapgl';
import { InfoWindow, LocationControl } from ".";


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

    function onWindowCloseClick() {
        // onPointClick(focus)
    }

    const onPointClick = useCallback((e) => {
        console.log('e', e);
        const { geometry, properties } = e.dataItem;
        setShouldAutoFocus(true)
        if (focus === properties.id) {
            setFocus("")
        } else {
            setFocus(properties.id)
        }
    }, []);

    return <Map
        enableScrollWheelZoom={true}
        enableDragging={true}
        zoom={9}
        center={props.center}
        className="mapDiv"
        ref={mapRef}
        style={{ height: "100%" }}>
        <MapvglView>
            <MapvglLayer
                type="PointLayer"
                data={props.data}
                options={{
                    blend: 'lighter',
                    size: 20,
                    color: 'rgb(255, 53, 0, 0.6)',
                    enablePicked: true,// 是否可以拾取
                    // selectedIndex: -1, // 选中数据项索引
                    selectedColor: '#ff0000', // 选中项颜色
                    autoSelect: true,// 根据鼠标位置来自动设置选中项
                    onClick: onPointClick,
                }}
            />
        </MapvglView>
        <ZoomControl />
        <ScaleControl />
        <LocationControl />
        <MapTypeControl mapTypes={['normal', 'satellite']} />
        <InfoWindow
            item={props.data.find(e => e.properties.id === focus)}
            shouldAutoCenter={shouldAutoFocus}
            onCloseClick={onWindowCloseClick} />
    </Map>
}

export default BaiduMap
