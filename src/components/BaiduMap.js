import React, { useState, useCallback, useEffect } from "react";
import { Map, ScaleControl, ZoomControl, MapTypeControl, MapvglView, MapvglLayer } from 'react-bmapgl';
import { InfoWindow, LocationControl } from ".";
import { COLOR_MAP } from '../common/constant'

function BaiduMap(props) {
    const [focus, setFocus] = useState("")
    const [bounds, setBounds] = useState(null)
    const [shouldAutoFocus, setShouldAutoFocus] = useState(true)
    const [listIem, setListItem] = useState(null);

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
        const { dataIndex, dataItem } = e;
        if (dataItem) {
            const { geometry, properties } = dataItem;
            setShouldAutoFocus(true)
            if (focus === properties.id) {
                setFocus("")
            } else {
                setFocus(properties.id)
            }
        } else {
            // 点击空白关闭infoWindow
            setFocus("")
        }
    }, [focus]);

    const geojson = [];
    let centerPoint = null;
    props.data.map((item) => {
        // delete item.color
        const point = {
            geometry: {
                type: 'Point',
                coordinates: [item.location.lng, item.location.lat],
            },
            properties: {
                ...item,
                icon: item.id === (focus || listIem) ? './images/marker-blue.svg' : './images/marker-red.svg',
            },
        }
        if (item.id === (focus || listIem)) {
            centerPoint = point;
        } else {
            geojson.push(point);
        }
    })
    centerPoint && geojson.push(centerPoint);
    let loc = { lng: 113.802193, lat: 34.820333 };

    if (props.center) {
        const { location } = props.center;
        loc = location;
    }

    // 选中列表项展示infoWindow
    useEffect(() => {
        if (props.center) {
            setListItem(props.center.id);
        }
    }, [props.center]);
    return <Map
        enableScrollWheelZoom={true}
        enableDragging={true}
        zoom={9}
        center={loc}
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
            handleCorrection={props.handleCorrection}
            onCloseClick={onWindowCloseClick} />
        <MapvglView>
            <MapvglLayer
                type="IconLayer"
                data={geojson}
                options={{
                    // icon: (item) => {
                    //     console.log('item', item.properties);
                    //     if (item.properties.id === focus) {
                    //         return './images/marker-blue.svg';
                    //     }
                    //     console.log('item', item);
                    //     return './images/marker-red.svg';
                    // },
                    color: (item) => {
                        // console.log('item', item);
                        const { properties: { category } } = item
                        return COLOR_MAP[category]
                    },
                    size: 20,
                    enablePicked: true,// 是否可以拾取
                    selectedIndex: (item) => {
                        console.log('item', item);
                    },
                    selectedColor: '#5B8FF9', // 选中项颜色
                    autoSelect: true,// 根据鼠标位置来自动设置选中项
                    onClick: onPointClick,
                }}
            />
        </MapvglView>
    </Map>
}

export default BaiduMap
