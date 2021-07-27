import { Tag } from "antd"

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

    const handleCorrection = () => {
        if (props.handleCorrection) {
            props.handleCorrection(props.info)
        }
    }

    let post_time = (props.info.isWeibo ? props.info.formatTime : props.info.time)
    let link_section = null
    const showCorrection = typeof (props.hideCorrection) === 'undefined' || props.hideCorrection === false
    if (props.info.isWeibo) {
        link_section = <>
                            <a className="info-item-link" href={props.info.link} target="_blank" rel="noopener noreferrer">原微博</a>
            { showCorrection ? <a className="info-item-link" onClick={handleCorrection}>纠错</a> : null }
        </>
    }

    return <div className="info-item">
        <div className="info-item-content">{post_text}</div>
        <div className="info-item-footer">
            <label className="info-item-date">{post_time}</label>
            {link_section}
            <div className="info-item-tag-list">
              <Tag color={props.info.color}>{props.info.category}</Tag>
                { props.info.types.length > 0 ? props.info.types.map(type => <Tag color={props.info.color}>{type}</Tag>) : null }
            </div>
        </div>
    </div>
}

export default InfoItem
