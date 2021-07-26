import { Tag, Row, Col } from "antd"
import { colorMap } from '../common/constant'

function InfoItem(props) {

    return <div className="info-item">
        <div className="info-item-content">{props.info.post}</div>
        <div className="info-item-footer">
            <label className="info-item-date">{ props.info.formatTime }</label>
            <a className="info-item-link" href={props.info.link} target="_blank" rel="noopener noreferrer">原微博</a>
            <div className="info-item-tag-list">
              <Tag color={props.info.color}>{props.info.category}</Tag>
                { props.info.types.length > 0 ? props.info.types.map(type => <Tag color={props.info.color}>{type}</Tag>) : null }
            </div>
        </div>
    </div>
}

export default InfoItem
