import {useCallback, useEffect, useState} from "react";
import { LEFT_FOLD } from '../icon';
import InfoList from "./InfoList";

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
    

    let handleSliderChange = (e) => {
        setTimeRange(e.target.value)
        props.notifySliderChange(e.target.value)
    }

    let slider = () => {
        let labelText = "最近" + timeRange + "小时";
        if (timeRange === 12) {
            labelText = "全部记录"
        }
        return <label>
            <input id="sliderRange" type="range" min="2" max="12" value={timeRange} onChange={handleSliderChange} step="2" />
            {labelText}
        </label>
    }

    return (
            <div className="info-container" data-fold={isFold}>
                <div className="info" data-fold={isFold}>
                    <div>本网站仅聚合新浪微博上发布的有关2021年7月河南暴雨的求助信息，请大家注意辨别信息真伪。点击标记点可以看到更多信息及原微博地址。</div>
                    <br />
                    {slider()}
                    <a className="aboutButton" href="https://u9u37118bj.feishu.cn/docs/doccn3QzzbeQLPQwNSb4Hcl2X1g" target="_blank">关于我们</a>
                </div>
                <InfoList list={displayList}/>
                <div className="left-fold" data-fold={isFold} onClick={onLeftFold}>{LEFT_FOLD}</div>
            </div>
    )
}

export default InfoHeader;