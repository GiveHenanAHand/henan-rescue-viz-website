import InfoItem from "./InfoItem"
import { List, Input, Select } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useState, useMemo, useEffect } from "react"
const { Search } = Input
const { Option } = Select

function InfoList(props) {
    const allStr = '全选'

    const [ keyword, setKeyword ] = useState('')
    const [ selectedType, setSelectedType ] = useState('')
    const [ categories, setCategories ] = useState([])
    
    useEffect(() => {
        console.log("set categories")
        const categories = new Set(props.list.map(e => e.category ).filter(e => e.length > 0))
        setCategories([...categories])
    }, [props.list])

    const select = () => <Select defaultValue={allStr} style={{width: 120}} onChange={value => setSelectedType(value)}>
        <Option value={''}>{allStr}</Option>
        { categories.map(category => <Option value={category} key={category}>{category}</Option>) }
    </Select>


    const filteredData = useMemo(() => {
        if ((keyword && keyword.length > 0) || selectedType !== allStr) {
            // keyword is not empty or some type is selected
            return props.list.filter(e => {
                return e.post.indexOf(keyword) > -1 && e.category.indexOf(selectedType) > -1
            })
        } else {
            return props.list
        }
    }, [props.list, keyword, selectedType])

    return <>
            <div className="info-list-header">
                <Input placeholder="搜索"
                       className="info-list-search"
                       value={keyword}
                       onChange={ e => setKeyword(e.target.value) }
                       allowClear
                       prefix={<SearchOutlined className="info-list-search-icon"/>}
                       style={{ width: 200 }}
                />
                { select() }
            </div>
            <List
                className="info-list"
                itemLayout="horizontal"
                dataSource={filteredData}
                renderItem={item => (
                    <List.Item>
                        <InfoItem info={item} key={item.link}/>
                    </List.Item>
                )}
            />
        </>
}

export default InfoList