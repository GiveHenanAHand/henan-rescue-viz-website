import React from "react";
import {InfoWindow, Marker} from "react-bmapgl";

export class InfoMarker extends React.Component {
    render() {
        const basePosition = {
            lng: this.props.latLong.lng,
            lat: this.props.latLong.lat
        }

        const marker = <Marker key={this.props.record.link} position={basePosition} onClick={this.props.onClickMarker(this.props.record.link)}/>
        const infoWindow = <InfoWindow
            height={200}
            position={basePosition}
            onClickclose={this.props.onClickMarker(this.props.record.link)}
        >
            <div>{this.props.record.post}</div>
            <div>原微博：<a target="_blank" rel="noopener noreferrer"
                        href={this.props.record.link}>{this.props.record.link}</a></div>
            <div>发布时间: 7月{this.props.record.Time.substring(8, 10)}日 {this.props.record.Time.substring(11, 20)}</div>
        </InfoWindow>
        return (
            <div>
                {marker}
                {this.props.focus === this.props.record.link && infoWindow}
            </div>
        )
    }
}