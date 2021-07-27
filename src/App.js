import React, {useEffect, useState, useMemo} from "react";
import { BaiduMap, InfoHeader } from "./components";
import { COLOR_MAP } from './common/constant'
import './styles/App.css';
import ReportModal from "./components/ReportModal";

function App() {
    const [timeRange, setTimeRange] = useState(6)
    const [data, setData] = useState({})
    const [dataSource, setDataSource] = useState('weibo')
    const [bounds, setBounds] = useState(null)
    const [listDefaultText, setListDefaultText] = useState("")
    // map center
    const [center, setCenter] = useState({ lng: 113.802193, lat: 34.820333 })

    // filter relevant states
    const [ keyword, setKeyword ] = useState('')
    const [ selectedCategory, setSelectedCategory ] = useState('')
    const [ selectedTypes, setSelectedTypes ] = useState([])

    // highlight relevant states
    // changeList: (id -> icon) dict
    const [ changeList, setChangeList ] = useState({})

    // modal relevant states
    const [ modalState, setModalState ] = useState({ modalVisible: false, item: null })

    function createDataItem(item) {
        // including different ways to create the latLong and time fields to make it compatible
        // across different versions of json format; only for the transition phase
        item.location = {
            lng: ((item.location && item.location.lng) || item.lng) + Math.random() / 150,
            lat: ((item.location && item.location.lat) || item.lat) + Math.random() / 150
        }

        item.isWeibo = !item.link.startsWith('no_link')
        item.time = item.Time || item.time
        if (item.isWeibo) {
            // format time
            item.timestamp = Date.parse(item.time)
            const date = new Date(item.timestamp)
            item.formatTime = `${date.getMonth() + 1}月${date.getDate()}日 ${item.time.substring(11, 20)}`
        }

        // use last part of link as id
        let arr = item.link.split('/')
        item.id = arr[arr.length - 1]

        // fill null category
        // revised_category has a higher priority
        item.category = item.revised_category || item.category || '未分类'

        // item category and types
        const category = item.category
        arr = category.split('_').map(e => e.trim())
        // the first is category
        item.category = arr.shift()
        item.types = arr
        item.color = COLOR_MAP[item.category]

        // default icon
        item.icon = 'loc_red'

        return item
    }

    // Fetch data on init
    useEffect(() => {
        let xhr_weibo = new XMLHttpRequest();
        xhr_weibo.onload = function () {
            if ('weibo' in data) return
            const serverData = JSON.parse(xhr_weibo.responseText)
            const items = serverData.map(createDataItem)
            setData(previousData => ({...previousData, weibo: items}))
        };
        xhr_weibo.open("GET", "https://api-henan.tianshili.me/parse_json.json");
        xhr_weibo.send()

        let xhr_sheet = new XMLHttpRequest();
        xhr_sheet.onload = function () {
            if ('sheet' in data) return
            const serverData = JSON.parse(xhr_sheet.responseText)
            const items = serverData.map(createDataItem)
            setData(previousData => ({...previousData, sheet: items}))
        };
        xhr_sheet.open("GET", "https://api-henan.tianshili.me/manual.json ");
        xhr_sheet.send()
    })

    // [SECTION] Data generation
    let filterData = useMemo(() => {
        if (!(dataSource in data)) return []
        let currentFilteredData
        // convert selectedTypes into map, with (item -> true)
        const selectedTypesMap = selectedTypes.reduce((result, item) => {
            result[item] = true
            return result
        }, {})

        if (dataSource === 'weibo') {
            const beginTime = Date.now() - timeRange * 60 * 60 * 1000
            currentFilteredData = data[dataSource].filter(item => {
                const result = (item.timestamp > beginTime) &&
                            item.post.indexOf(keyword) > -1 &&
                            item.category.indexOf(selectedCategory) > -1
                // if already false
                if (result === false) { return false }
                // default select all
                if (selectedTypes.length === 0) return true
                // if previous condition is true, check selected types
                for (const type of item.types) {
                    if (selectedTypesMap[type]) { return true }
                }
                return false
            })
        } else {
            // filter for manual sheet source
            currentFilteredData = data[dataSource].filter(item => {
                let contains_keyword = ((item.address.indexOf(keyword) > -1) ||
                    (item.post && item.post.indexOf(keyword) > -1))
                const result = contains_keyword && item.category.indexOf(selectedCategory) > -1
                if (!result) { return false }
                if (selectedTypes.length === 0) return true
                for (const type of item.types) {
                    if (selectedTypesMap[type]) { return true }
                }
                return false
            })
        }
        return currentFilteredData
    }, [data, dataSource, timeRange, keyword, selectedCategory, selectedTypes])

    // [SECTION] component call backs
    function handleDataSourceSwitch(value) {
        setDataSource(value)
    }

    function handleSliderChange(e) {
        setTimeRange(e)
    }

    function updateBounds(newBounds) {
        setBounds(newBounds)
        setListDefaultText("无数据")
    }

    function handleMapInited() {
        setListDefaultText("移动地图显示列表")
    }

    function handleInfoSelected(item) {
        let list = Object.assign({}, changeList)

        // revert last change
        for (const id in list) {
            if (id === item.id) continue

            const prevItem = data[dataSource].find(e => e.id === id)
            // if prevItem exists and it's highlighted, un-highlight it
            if (prevItem && list[id] !== prevItem.icon) {
                list[id] = prevItem.icon
            } else {
                // no previous item exists or it's already not highlighted, remove from list
                delete list[id]
            }
        }

        // highlight item
        list[item.id] = 'loc_blue'
        setChangeList(list)
        setCenter(item.location)
    }

    function handleCorrection(item) {
        setModalState({ visible: true, item: item })
    }

    return (
        <div className={"rootDiv"}>
            <InfoHeader
                list={filterData}
                bounds={bounds}
                keyword={keyword}
                selectedTypes={selectedTypes}
                defaultText={listDefaultText}
                notifySliderChange={handleSliderChange}
                notifyDataSourceSwitch={handleDataSourceSwitch}
                notifyKeywordChange={ e => setKeyword(e) }
                notifyCategoryChange={ e => { setSelectedCategory(e); setSelectedTypes([]) } }
                notifyTypesChange={ e => setSelectedTypes(e) }
                handleItemClick={ e => handleInfoSelected(e) }
                handleCorrection={ e => handleCorrection(e) }
            />
            <BaiduMap
                data={filterData}
                center={center}
                changeList={changeList}
                mapInited={handleMapInited}
                handleCorrection={handleCorrection}
                handleBoundChanged={updateBounds}/>
            { modalState.visible && modalState.item ?
                <ReportModal item={modalState.item}
                         visible={modalState.visible}
                         setVisible={(v, e) => { setModalState({ visible: v, item: e }) }}/> :null }
        </div>
    )
}

export default App;
