import InfoItem from "./InfoItem"
import { List }  from "antd"

function InfoList(props) {
    const list = () => {
        return props.list.map((item, i) =>
            <InfoItem info={item} key={item.link} />
            )
    }

    return <List
            className="info-list"
            itemLayout="horizontal"
            dataSource={props.list}
            renderItem={item => (
              <List.Item>
                <InfoItem info={item} key={item.link} />
              </List.Item>
            )}
          />
}

export default InfoList