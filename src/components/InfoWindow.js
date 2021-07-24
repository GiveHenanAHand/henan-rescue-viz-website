import React, { useEffect, useState }  from "react";
import { Card } from "antd";
import {CustomOverlay} from 'react-bmapgl';

function InfoWindow(props) {

    if (typeof (props.item) === 'undefined') return null

    return <CustomOverlay
        position={props.item.record.location}
        onClickclose={() => console.log("testtest")}
        autoViewport={props.shouldAutoCenter}>
            <Card>
                <div>
                    发布时间: 7月{props.item.time.substring(8, 10)}日
                    {props.item.time.substring(11, 20)}</div>
                <div>{props.item.record.post}</div>
                <hr />
                <div>原微博：
                <a target="_blank" rel="noopener noreferrer"
                    href={props.item.record.link}>{props.item.record.link}</a>
                </div>
            </Card>
        </CustomOverlay>
}

export default InfoWindow
