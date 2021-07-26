import { Tag, Row, Col } from "antd"
import { colorMap } from '../common/constant'

function InfoItem(props) {

    let post_text = props.info.post
    if (!props.info.isWeibo) {
        post_text = '地址：'+props.info.address+'\n'
        if (props.info.post) {
            post_text += '内容：'+props.info.post+'\n'
        }
        if (props.info.contact_person) {
            post_text += '联系人：'+props.info.contact_person+'\n'
        }
        if (props.info.contact_info) {
            post_text += '联系方式：'+props.info.contact_info
        }
    }

    let post_time = (props.info.isWeibo ? props.info.formatTime : props.info.time)
    let link_section = null
    if (props.info.isWeibo) {
        link_section = <a className="info-item-link" href={props.info.link} target="_blank" rel="noopener noreferrer">原微博</a>
    }

    return <div className="info-item">
        <div className="info-item-content">{post_text}</div>
        <div className="info-item-footer">
            <label className="info-item-date">{post_time}</label>
            <div className="info-item-tag-list">
              <Tag color={props.info.color}>{props.info.category}</Tag>
                { props.info.types.length > 0 ? props.info.types.map(type => <Tag color={props.info.color}>{type}</Tag>) : null }
            </div>
        </div>
    </div>
}

export default InfoItem
