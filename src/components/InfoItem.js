import { Tag, Button } from "antd"

function InfoItem(props) {
    const handleCorrection = () => {
        if (props.handleCorrection) {
            props.handleCorrection(props.info)
        }
    }

    let link_section = null
    const showCorrection = typeof (props.hideCorrection) === 'undefined' || props.hideCorrection === false
    if (props.info.isWeibo) {
        link_section = <>
            <a className="info-item-link" href={props.info.link} target="_blank" rel="noopener noreferrer">原微博</a>
            {showCorrection ? <Button type="link" className="info-item-link" onClick={handleCorrection}>纠错</Button> : null}
        </>
    }

    return <div className={ `info-item ${!props.info.isWeibo ? 'info-sheet-item' : ''}` }>
        <div className="info-item-content">{props.info.post}</div>
        <div className="info-item-footer">
            <label className="info-item-date">{props.info.formatTime || props.info.time}</label>
            {link_section}
            <div className="info-item-tag-list">
              <Tag color={props.info.color}>{props.info.category}</Tag>
                { props.info.types.length > 0 ? props.info.types.map(type => <Tag color={props.info.color} key={type}>{type}</Tag>) : null }
            </div>
        </div>
    </div>
}

export default InfoItem
