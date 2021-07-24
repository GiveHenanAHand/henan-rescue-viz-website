import React from "react";
import {Marker, CustomOverlay} from "react-bmapgl";
import {Alert} from 'react-bootstrap';

export class InfoMarker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshStr: " "
        };
    }

    render() {
        const basePosition = {
            lng: this.props.latLong.lng,
            lat: this.props.latLong.lat
        }

        let refresh = () => {
            this.setState({refreshStr: this.state.refreshStr + " "})
        }

        const marker = <Marker
            key={this.props.record.link}
            position={basePosition}
            onClick={this.props.onClickMarker(this.props.record.link)}
        />
        const infoWindow = <CustomOverlay
            position={basePosition}
            onClickclose={this.props.onClickMarker(this.props.record.link)}
            autoViewport={true}
        >
            <Alert variant='light'>
                <div>
                    发布时间: 7月{this.props.record.Time.substring(8, 10)}日 {this.props.record.Time.substring(11, 20)}</div>
                <div>{this.props.record.post}</div>
                <hr />
                <div>{this.state.refreshStr}原微博：<a target="_blank" rel="noopener noreferrer"
                                                   href={this.props.record.link}>{this.props.record.link}</a></div>
            </Alert>
        </CustomOverlay>
        return (
            <div>
                {marker}
                {this.props.focus === this.props.record.link && infoWindow}
            </div>
        )
    }
}