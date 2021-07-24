import React, { useState }  from "react";
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

    let marker = <Marker icon={"loc_red"} key={props.record.link}
                            position={basePosition} 
                            onClick={props.onClickMarker(props.record.link)}/>

    let infoWindow = <CustomOverlay
                        position={basePosition}
                        onClickclose={props.onClickMarker(props.record.link)}
                        autoViewport={true}>
                        <Alert variant='light'>
                            <div>
                                发布时间: 7月{props.time.substring(8, 10)}日
                                {props.time.substring(11, 20)}</div>
                            <div>{props.record.post}</div>
                            <hr />
                            <div>{refreshStr}原微博：
                            <a target="_blank" rel="noopener noreferrer"
                                href={props.record.link}>{props.record.link}</a>
                            </div>
                        </Alert>
        </CustomOverlay>

    return (
            <div>
                {marker}
                {props.focus === props.record.link && infoWindow}
            </div>
        )
    
}

export default InfoMarker;