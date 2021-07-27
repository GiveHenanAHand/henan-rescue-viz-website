import {useState} from "react"
import { Modal, Select, Divider } from "antd"
import InfoItem from "./InfoItem";
import {CATEGORY_MAP} from "../common/constant";
import "../styles/ReportModal.css"
const {Option} = Select

const ReportModal = (props) => {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [selectedTypes, setSelectedTypes] = useState([])
    const [category, setCategory] = useState('')
    const [types, setTypes] = useState([])

    const showModal = () => {
        props.setVisible(true)
    }

    const handleOk = () => {
        setConfirmLoading(true)
        setTimeout(() => {
            props.setVisible(false)
            setConfirmLoading(false)
        }, 2000)
    }

    const handleCancel = () => {
        console.log('Clicked cancel button')
        props.setVisible(false)
    }

    const handleCategoryChange = (v) => {
        setTypes(CATEGORY_MAP[v] || [])
        setSelectedTypes([])
        setCategory(v)
    }

    const handleTypesChange = (v) => {
        setSelectedTypes(v)
    }

    const categories = Object.keys(CATEGORY_MAP)

    return (
        <Modal
            title="标签纠错"
            className="report-modal"
            cancelText="取消"
            okText="提交"
            visible={props.visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
        >
            <InfoItem info={props.item} hideCorrection={true}/>

            <Divider/>

            <label className="new-tag">正确标签: </label>
            <Select defaultValue={props.item.category} className="info-list-category" style={{}}
                    onChange={handleCategoryChange}>
                {categories.map(category => <Option value={category} key={category}>{category}</Option>)}
            </Select>
            <Select mode="multiple"
                    className="info-list-types"
                    value={selectedTypes}
                    defaultValue={[]}
                    allowClear
                    style={{}}
                    disabled={types.length === 0}
                    onChange={handleTypesChange}>
                {types.map(type => (
                    <Option key={type}>{type}</Option>
                ))}
            </Select>
        </Modal>
    )
}

export default ReportModal