import { useCallback, useEffect, useState } from "react";
import { Button, Slider, Row, Col, Select, Tag, List } from 'antd';
import { LEFT_FOLD } from '../icon'
import { colorMap } from '../common/constant'
import InfoItem from "./InfoItem"
import '../styles/InfoHeader.css'
const options = Object.keys(colorMap).map(item => ({ label: item, value: colorMap[item] }));

function InfoHeader(props) {
    const [isFold, setIsFold] = useState(false)
    const [timeRange, setTimeRange] = useState(8)
    const [displayList, setDisplayList] = useState([])
    const [category, setCategory] = useState([]);

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
                    <Slider defaultValue={8} step={2} min={2} max={12} onAfterChange={handleSliderChange} />
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

    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = event => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                key={label}
                color={value}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 3 }}
            >
                {label}
            </Tag>
        );
    }

    const onSelectCategory = (value, options) => {
        const cat = []
        options.forEach(item => {
            cat.push(item.label)
        })
        setCategory(cat)
    }

    const dataList = category.length > 0 ? displayList.filter((item) => category.indexOf(item.category.split('_')[0]) !== -1) : displayList
    return (
        <div className="info-container" data-fold={isFold}>
            <div className="info" data-fold={isFold}>
                <div>本网站仅聚合新浪微博上发布的有关2021年7月河南暴雨的求助信息，请大家注意辨别信息真伪。点击标记点可以看到更多信息及原微博地址。</div>
                <br />
                {slider()}
            </div>
            <Select
                mode="multiple"
                showArrow
                tagRender={tagRender}
                // defaultValue={Object.keys(colorMap)}
                style={{ width: '100%' }}
                options={options}
                onChange={onSelectCategory}
            />
            <List
                className="info-list"
                itemLayout="horizontal"
                dataSource={dataList}
                renderItem={item => (
                    <List.Item>
                        <InfoItem info={item} key={item.id}/>
                    </List.Item>
                )}
            />
            <div className="left-fold" data-fold={isFold} onClick={onLeftFold}>{LEFT_FOLD}</div>
        </div>
    )
}

export default InfoHeader;
