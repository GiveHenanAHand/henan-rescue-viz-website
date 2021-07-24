function InfoItem(props) {
    return <div className="info-item">
        <div className="info-item-content">${props.info.post}</div>
        <div className="info-item-footer">
            <a className="info-item-link" href={props.info.link} target="_blank">原微博</a>
            <div className="info-item-date">{ `发布时间: 7月${props.info.Time.substring(8, 10)}日 ${props.info.Time.substring(11, 20)}` }</div>
        </div>
    </div>
}

export default InfoItem
