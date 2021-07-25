import { Tag, Row, Col } from "antd"

function InfoItem(props) {
    const arr = props.info.category.split('_')
    const category = arr[0]
    let type = ''
    if (arr.length > 1) {
        type = arr[1]
    }

    const colorMap = {
        '求助': 'red',
        '求救': '#EC2215',
        '提供帮助': '#47AE53',
        '帮助': '#47AE53',
        '其他': '#3371BE',
    }

    const color = colorMap[category]

    return <div className="info-item">
        <div className="info-item-content">{props.info.post}</div>
        <div className="info-item-footer">
            <label className="info-item-date">{ `7月${props.info.time.substring(8, 10)}日 ${props.info.Time.substring(11, 20)}` }</label>
            <a className="info-item-link" href={props.info.link} target="_blank" rel="noopener noreferrer">原微博</a>
            <div className="info-item-tag-list">
              <Tag color={color}>{category}</Tag>
                { type.length > 0 ? <Tag color={color}>{type}</Tag> : null }
            </div>
        </div>
    </div>
}

export default InfoItem
