import {useCallback, useEffect, useState} from "react";
import { LEFT_FOLD } from '../icon';
import {Button, Slider, Row, Col, Input, Select, List, Radio} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import InfoItem from "./InfoItem";
import {CATEGORY_MAP} from "../common/constant";
import '../styles/InfoHeader.css'
const { Option } = Select

function InfoHeader(props) {
    const [isFold, setIsFold] = useState(false)
    const [timeRange, setTimeRange] = useState(8)
    const [displayList, setDisplayList] = useState([])
    const [selectedId, setSelectedId] = useState('')
    const [dataSource, setDataSource] = useState('weibo')
    const [types, setTypes] = useState([])

    useEffect(() => {
        if (props.bounds == null) return

        const list = props.list.filter(e => props.bounds.containsPoint(e.location))
        setDisplayList(list)
    }, [props.list, props.bounds])

    const onLeftFold = useCallback((e) => {
        e.stopPropagation();
        setIsFold(!isFold);
    }, [isFold])
    

    const handleSliderChange = (value) => {
        setTimeRange(value)
        props.notifySliderChange(value)
    }

    const handleItemClicked = (item) => {
        setSelectedId(item.id)
        props.handleItemClick(item)
    }

    let handleSouceSwitched = (event) => {
        setDataSource(event.target.value)
        props.notifyDataSourceSwitch(event.target.value)
    }

    let souceSwitch = () => {
        return <Row className="source-switch" justify="center">
            <Col style={{ marginTop: 5 }}>信息来源：</Col>
            <Col>
                <Radio.Group defaultValue="weibo" buttonStyle="solid" onChange={handleSouceSwitched}>
                <Radio.Button value="weibo">微博</Radio.Button>
                <Radio.Button value="sheet">在线表格</Radio.Button>
            </Radio.Group></Col>
        </Row>
    }

    let headerText = () => {
        if (dataSource == 'weibo') {
            return <label>本网站仅聚合新浪微博上发布的
                有关2021年7月河南暴雨的求助信息，请大家注意辨别信息真伪。
                点击标记点可以看到更多信息及原微博地址。</label>
        } else {
            return <label>在线表格信息来源于志愿者们手工整理有关2021年7月河南暴雨的求助信息, 跳转到
                <a href="https://u9u37118bj.feishu.cn/sheets/shtcnemn0sOgZ5Y9Cvp027wHWYd?from=from_copylink" target="_blank">文档地址</a></label>
        }
    }

    const handleCategoryChange = (value) => {
        setTypes(CATEGORY_MAP[value] || [])
        props.notifyCategoryChange(value)
    }

    const categories = Object.keys(CATEGORY_MAP)

    let slider = () => {
        if (dataSource == 'sheet') {
            return null
        }

        let labelText = "最近" + timeRange + "小时";
        if (timeRange === 12) {
            labelText = "全部记录"
        }
        return <div className="slider-container">
            <Row justify="center" align="middle">
                <Col span={12}>
                    <Slider defaultValue={8} step={2} min={2} max={12} onAfterChange={handleSliderChange}/>
                </Col>
                <Col className="label-col" span={6}>
                    <label>{labelText}</label>
                </Col>
            </Row>
            <div className="info-button-list">
                <Button type="primary" href="https://u9u37118bj.feishu.cn/docs/doccn3QzzbeQLPQwNSb4Hcl2X1g" target="_blank">关于我们</Button>
                <Button type="primary" href="https://u9u37118bj.feishu.cn/sheets/shtcnh4177SPTo2N8NglZHCirDe" target="_blank">实时数据表格</Button>
                <Button type="primary" href="https://www.wjx.cn/vj/PZb53C6.aspx" target="_blank">需求反馈</Button>
            </div>
        </div>
    }

    return (
            <div className="info-container" data-fold={isFold}>
                <div className="info" data-fold={isFold}>
                    {souceSwitch()}
                    <div>{headerText()}</div>
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
                       style={{ }}
                />
                <Select defaultValue='' className="info-list-category" style={{}} onChange={handleCategoryChange}>
                    <Option value={''}>全选</Option>
                    { categories.map(category => <Option value={category} key={category}>{category}</Option>) }
                </Select>
                <Select mode="multiple"
                        className="info-list-types"
                        value={props.selectedTypes}
                        defaultValue={[]}
                        allowClear
                        style={{ }}
                        disabled={types.length === 0}
                        onChange={value => props.notifyTypesChange(value)}>
                    {types.map(type => (
                      <Option key={type}>{type}</Option>
                    ))}
                </Select>
            </div>
            <List
                className="info-list"
                itemLayout="horizontal"
                bordered
                dataSource={displayList}
                locale={ { emptyText: props.defaultText } }
                renderItem={item => (
                    <List.Item key={item.id} className={item.id === selectedId ? "selected-item" : ''} onClick={ () => { handleItemClicked(item) } }>
                        <InfoItem info={item} />
                    </List.Item>
                )}
                />
                <div className="left-fold" data-fold={isFold} onClick={onLeftFold}>{LEFT_FOLD}</div>
            </div>
    )
}

export default InfoHeader;