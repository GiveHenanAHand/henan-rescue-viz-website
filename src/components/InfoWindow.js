import React from "react";
import { Card, Button } from "antd";
import {CloseCircleOutlined} from '@ant-design/icons';
import {CustomOverlay} from 'react-bmapgl';
import InfoItem from "./InfoItem";
import '../styles/InfoWindow.css'

function InfoWindow(props) {

    if (typeof (props.item) === 'undefined') return null

    return <CustomOverlay
        position={props.item.record.location}
        autoViewport={props.shouldAutoCenter}>
            <Card style={ { width: 320 } }>
            <Button type="text" danger className="windowCloseBtn" onClick={props.onCloseClick}>
                <CloseCircleOutlined />
            </Button>
            <InfoItem  info={props.item.record} key={props.item.record.link}/>
            </Card>
        </CustomOverlay>
}

export default InfoWindow
