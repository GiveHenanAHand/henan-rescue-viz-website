import {useCallback, useEffect, useState} from "react";
import { LEFT_FOLD } from '../icon';
import InfoList from "./InfoList";
import { Button, Slider, Row, Col } from 'antd';
import '../styles/InfoHeader.css'

function InfoHeader(props) {
    const [isFold, setIsFold] = useState(false)
    const [timeRange, setTimeRange] = useState(8)
    const [displayList, setDisplayList] = useState([])

    useEffect(() => {
        console.log("message from header")
        console.log(props.bounds)

        if (props.bounds == null) return
        const list = props.list.filter(e => props.bounds.containsPoint(e.location))
        setDisplayList(list)
    }, [props.list, props.bounds])

    const onLeftFold = useCallback((e) => {
        e.stopPropagation();
        setIsFold(!isFold);
    }, [isFold])
    

    let handleSliderChange = (value) => {
        setTimeRange(value)
        props.notifySliderChange(value)
    }

    let slider = () => {
        let labelText = "最近" + timeRange + "小时";
        if (timeRange === 12) {
            labelText = "全部记录"
        }
        return <div className="slider-container">
            <Row>
                <Col span={8}>
                    <Slider defaultValue={8} step={2} min={2} max={12} onAfterChange={handleSliderChange}/>
                </Col>
                <Col className="label-col" span={6}>
                    <label>{labelText}</label>
                </Col>
                <Col span={6}>
                    <Button type="primary" href="https://u9u37118bj.feishu.cn/docs/doccn3QzzbeQLPQwNSb4Hcl2X1g" target="_blank">关于我们</Button>
                </Col>
                <Col span={6}>
                    <Button type="primary" href="https://u9u37118bj.feishu.cn/sheets/shtcnh4177SPTo2N8NglZHCirDe" target="_blank">实时数据表格</Button>
                </Col>
                <Col span={6}>
                    <Button type="primary" href="https://www.wjx.cn/vj/PfjWt3C.aspx" target="_blank">需求反馈</Button>
                </Col>
            </Row>
        </div>
    }

    return (
            <div className="info-container" data-fold={isFold}>
                <div className="info" data-fold={isFold}>
                    <div>本网站仅聚合新浪微博上发布的有关2021年7月河南暴雨的求助信息，请大家注意辨别信息真伪。点击标记点可以看到更多信息及原微博地址。</div>
                    <br />
                    {slider()}
                </div>
                <InfoList list={displayList}/>
                <div className="left-fold" data-fold={isFold} onClick={onLeftFold}>{LEFT_FOLD}</div>
            </div>
    )
}

export default InfoHeader;