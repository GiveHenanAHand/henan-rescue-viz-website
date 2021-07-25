import React, {useEffect} from "react";
import { Marker } from "react-bmapgl";

function InfoMarker(props) {
    let basePosition = {
        lng: props.item.location.lng,
        lat: props.item.location.lat
    }

    function onClick(){
        console.log(props.item.id)
        props.onClickMarker(props.item.id)
    }

    // set top if is highlighted
    return (
            <div>
                <Marker icon={props.icon} key={props.item.id}
                            position={basePosition}
                            isTop={props.icon !== props.item.icon}
                            onClick={onClick}/>
            </div>
        )
}

export default InfoMarker;