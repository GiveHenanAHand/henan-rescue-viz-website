import React, { useState }  from "react";
import { Marker } from "react-bmapgl";

function InfoMarker(props) {
    let basePosition = {
        lng: props.latLong.lng,
        lat: props.latLong.lat
    }

    function onClick(){
        props.onClickMarker(props.record.link)
    }

    let marker = <Marker icon={"loc_red"} key={props.record.link}
                            position={basePosition} 
                            onClick={onClick}/>
                            
    return (
            <div>
                {marker}
            </div>
        )
}

export default InfoMarker;