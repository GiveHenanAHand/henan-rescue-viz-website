import React, {useEffect, useState}  from "react";
import {Marker, CustomOverlay} from "react-bmapgl";
import {Alert} from 'react-bootstrap';

function InfoMarker(props) {
    const [refreshStr, setRefreshStr] = useState(" ")
    
    let basePosition = {
        lng: props.latLong.lng,
        lat: props.latLong.lat
    }
    
    let refresh = () => {
        setRefreshStr(prevState => prevState+" ")
    }

    let marker = <Marker key={props.record['微博链接']} 
                            position={basePosition} 
                            onClick={props.onClickMarker(props.record['微博链接'])}/>

    let infoWindow = <CustomOverlay
                        position={basePosition}
                        onClickclose={props.onClickMarker(props.record['微博链接'])}
                        autoViewport={true}>
                        <Alert variant='light'>
                            <div>
                                发布时间: 7月{props.record['时间'].substring(8, 10)}日 
                                {props.record['时间'].substring(11, 20)}</div>
                            <div>{props.record['微博内容']}</div>
                            <hr />
                            <div>{refreshStr}原微博：
                            <a target="_blank" rel="noopener noreferrer"
                                href={props.record['微博链接']}>{props.record['微博链接']}</a>
                            </div>
                        </Alert>
        </CustomOverlay>

    return (
            <div>
                {marker}
                {props.focus === props.record['微博链接'] && infoWindow}
            </div>
        )
    
}

export default InfoMarker;