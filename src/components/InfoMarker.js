import React from "react";
import { Marker } from "react-bmapgl";

function InfoMarker(props) {
    let basePosition = {
        lng: props.item.location.lng,
        lat: props.item.location.lat
    }

    function onClick(){
        // console.log(props.item.id)
        props.onClickMarker(props.item.id)
    }

    // set top if is highlighted
    return (
            <Marker icon={props.icon} key={props.item.id}
                        position={basePosition}
                        isTop={props.icon !== props.item.icon}
                        onClick={onClick}/>
        )
}

export default InfoMarker;