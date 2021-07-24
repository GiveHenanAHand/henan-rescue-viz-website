import InfoItem from "./InfoItem"

function InfoList(props) {
    const list = () => {
        return props.list.map((item, i) => <InfoItem info={item} key={item.id} />)
    }

    return <div className="info-list">
        {list()}
    </div>
}

export default InfoList