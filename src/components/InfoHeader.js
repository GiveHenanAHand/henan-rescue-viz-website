import {useCallback, useEffect, useState} from "react";
import { LEFT_FOLD } from '../icon';
import {Button, Slider, Row, Col, Input, Select, List} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import InfoItem from "./InfoItem";
import '../styles/InfoHeader.css'
const { Option } = Select

function InfoHeader(props) {
    const [isFold, setIsFold] = useState(false)
    const [timeRange, setTimeRange] = useState(8)
    const [displayList, setDisplayList] = useState([])

    useEffect(() => {
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
            <Row justify="center">
                <Col span={12}>
                    <Slider defaultValue={8} step={2} min={2} max={24} onAfterChange={handleSliderChange}/>
                </Col>
                <Col className="label-col" span={6}>
                    <label>{labelText}</label>
                </Col>
            </Row>
            <div className="info-button-list">
                <Button type="primary" href="https://u9u37118bj.feishu.cn/docs/doccn3QzzbeQLPQwNSb4Hcl2X1g" target="_blank">关于我们</Button>
                <Button type="primary" href="https://u9u37118bj.feishu.cn/sheets/shtcnh4177SPTo2N8NglZHCirDe" target="_blank">实时数据表格</Button>
                <Button type="primary" href="https://www.wjx.cn/vj/PfjWt3C.aspx" target="_blank">需求反馈</Button>
            </div>
        </div>
    }

    return (
            <div className="info-container" data-fold={isFold}>
                <div className="info" data-fold={isFold}>
                    <div>本网站仅聚合新浪微博上发布的有关2021年7月河南暴雨的求助信息，请大家注意辨别信息真伪。点击标记点可以看到更多信息及原微博地址。</div>
                    <br />
                    {slider()}
                </div>
            <div className="info-list-header">
                <Input placeholder="搜索"
                       className="info-list-search"
                       value={props.keyword}
                       onChange={ e => props.notifyKeywordChange(e.target.value) }
                       allowClear
                       prefix={<SearchOutlined className="info-list-search-icon"/>}
                       style={{ width: 200 }}
                />
                <Select defaultValue='' style={{width: 120}} onChange={value => props.notifyTypeChange(value)}>
                    <Option value={''}>全选</Option>
                    { props.categories.map(category => <Option value={category} key={category}>{category}</Option>) }
                </Select>
            </div>
            <List
                className="info-list"
                itemLayout="horizontal"
                dataSource={displayList}
                renderItem={item => (
                    <List.Item>
                        <InfoItem info={item} key={item.link}/>
                    </List.Item>
                )}
                />
                <div className="left-fold" data-fold={isFold} onClick={onLeftFold}>{LEFT_FOLD}</div>
            </div>
    )
}

export default InfoHeader;