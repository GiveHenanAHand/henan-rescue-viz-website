import React, { useState }  from "react";
import { Marker } from "react-bmapgl";

function InfoMarker(props) {
    let basePosition = {
        lng: props.latLong.lng,
        lat: props.latLong.lat
    }

    let marker = <Marker icon={"loc_red"} key={props.record.link}
                            position={basePosition} 
                            onClick={props.onClickMarker(props.record.link)}/>
    return (
            <div>
                {marker}
            </div>
        )
}

export default InfoMarker;