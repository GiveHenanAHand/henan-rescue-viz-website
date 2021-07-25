import React from "react";
import { Marker } from "react-bmapgl";

function InfoMarker(props) {
    let basePosition = {
        lng: props.item.location.lng,
        lat: props.item.location.lat
    }

    function onClick(){
        props.onClickMarker(props.item.id)
    }

    let marker = <Marker icon={"loc_red"} key={props.item.id}
                            position={basePosition} 
                            onClick={onClick}/>
                            
    return (
            <div>
                {marker}
            </div>
        )
}

export default InfoMarker;