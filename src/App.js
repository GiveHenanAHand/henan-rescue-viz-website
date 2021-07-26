import React, { useEffect, useState, useMemo } from "react";
import { BaiduMap, InfoHeader } from "./components";
import { COLOR_MAP } from './common/constant'
import './styles/App.css';

function App() {
    const [timeRange, setTimeRange] = useState(6)
    const [data, setData] = useState({})
    const [dataSource, setDataSource] = useState('weibo')
    const [bounds, setBounds] = useState(null)
    const [listDefaultText, setListDefaultText] = useState("")
    // map center
    const [center, setCenter] = useState({ lng: 113.802193, lat: 34.820333 })

    // filter relevant states
<<<<<<< HEAD
    const [keyword, setKeyword] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedTypes, setSelectedTypes] = useState([])

    // highlight relevant states
    // changeList: (id -> icon) dict
    const [changeList, setChangeList] = useState({})

    // Fetch data on init
    useEffect(() => {
        console.log("enter page")
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (Object.keys(data).length !== 0) return

            const serverData = JSON.parse(xhr.responseText)
            const items = serverData.map(item => {
                // including different ways to create the latLong and time fields to make it compatible
                // across different versions of json format; only for the transition phase
                item.location = {
                    lng: ((item.location && item.location.lng) || item.lng) + Math.random() / 150,
                    lat: ((item.location && item.location.lat) || item.lat) + Math.random() / 150
                }

                // format time
                item.time = item.Time || item.time
                item.timestamp = Date.parse(item.time)
                const date = new Date(item.timestamp)
                item.formatTime = `${date.getMonth() + 1}月${date.getDate()}日 ${item.time.substring(11, 20)}`

                // use last part of link as id
                let arr = item.link.split('/')
                item.id = arr[arr.length - 1]
=======
    const [ keyword, setKeyword ] = useState('')
    const [ selectedCategory, setSelectedCategory ] = useState('')
    const [ selectedTypes, setSelectedTypes ] = useState([])

    // highlight relevant states
    // changeList: (id -> icon) dict
    const [ changeList, setChangeList ] = useState({})

    function createDataItem(item) {
        // including different ways to create the latLong and time fields to make it compatible
        // across different versions of json format; only for the transition phase
        item.isWeibo = !item.link.startsWith('no_link')
        // generate random to prevent overlap
        let random1 = Math.random()-0.5
        let random2 = Math.random()-0.5
        if (!item.isWeibo) {
            random1 = random1 / 200
            random2 = random2 / 200
        } else {
            random1 = random1 / 1000
            random2 = random2 / 1000
        }
        item.location = {
            lng: ((item.location && item.location.lng) || item.lng) + random1,
            lat: ((item.location && item.location.lat) || item.lat) + random2
        }

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
>>>>>>> Fork/master

        // fill null category
        item.category = item.category || '未分类'

        // item category and types
        const category = item.category
        arr = category.split('_').map(e => e.trim())
        // the first is category
        item.category = arr.shift()
        item.types = arr
        item.color = COLOR_MAP[item.category]

<<<<<<< HEAD
                // item category and types
                const category = item.category
                arr = category.split('_').map(e => e.trim())
                // the first is category
                item.category = arr.shift()
                item.types = arr
                item.color = COLOR_MAP[item.category]

                // default icon
                item.icon = 'loc_red'

                return {
                    geometry: {
                        type: 'Point',
                        coordinates: [item.location.lng, item.location.lat],
                    },
                    properties: item,
                }
            })
            setData(items)
        };
        xhr.open("GET", "https://api-henan.tianshili.me/parse_json.json");
        xhr.send()
    },[]) // 带上中括号,避免重复请求

=======
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
>>>>>>> Fork/master

    // [SECTION] Data generation
    let filterData = useMemo(() => {
        if (!(dataSource in data)) return []
        let currentFilteredData
        // convert selectedTypes into map, with (item -> true)
        const selectedTypesMap = selectedTypes.reduce((result, item) => {
            result[item] = true
            return result
        }, {})

<<<<<<< HEAD
        if (timeRange !== 12 || (keyword && keyword.length > 0) || selectedCategory.length > 0 || selectedTypes.length > 0) {
            const beginTime = Date.now() - timeRange * 60 * 60 * 1000

            // convert selectedTypes into map, with (item -> true)
            const selectedTypesMap = selectedTypes.reduce((result, item) => {
                result[item] = true
                return result
            }, {})
            currentFilteredData = data.filter(item => {
                const result = (item.timestamp > beginTime) &&
                    item.post.indexOf(keyword) > -1 &&
                    item.category.indexOf(selectedCategory) > -1
                // if already false
                if (result === false) {
                    return false
                }

                // default select all
                if (selectedTypes.length === 0) return true


                // if previous condition is true, check selected types
                for (const type of item.types) {
                    if (selectedTypesMap[type]) {
                        return true
                    }
=======
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
>>>>>>> Fork/master
                }
                return false
            })
        } else {
<<<<<<< HEAD
            // only return data within 12 hours
            const beginTime = Date.now() - 12 * 60 * 60 * 1000

            currentFilteredData = data.filter(item => item.timestamp > beginTime)
=======
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
>>>>>>> Fork/master
        }
        return currentFilteredData
<<<<<<< HEAD
    }, [data, timeRange, keyword, selectedCategory, selectedTypes])

    // [SECTION] component call backs
=======
    }, [data, dataSource, timeRange, keyword, selectedCategory, selectedTypes])

    // [SECTION] component call backs
    function handleDataSourceSwitch(value) {
        setDataSource(value)
    }

>>>>>>> Fork/master
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

<<<<<<< HEAD
            const prevItem = data.find(e => e.id === id)
=======
            const prevItem = data[dataSource].find(e => e.id === id)
>>>>>>> Fork/master
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

    return (
        <div className={"rootDiv"}>
            <InfoHeader
                list={filterData}
                bounds={bounds}
                keyword={keyword}
                selectedTypes={selectedTypes}
                defaultText={listDefaultText}
                notifySliderChange={handleSliderChange}
<<<<<<< HEAD
                notifyKeywordChange={e => setKeyword(e)}
                notifyCategoryChange={e => { setSelectedCategory(e); setSelectedTypes([]) }}
                notifyTypesChange={e => setSelectedTypes(e)}
                handleItemClick={e => handleInfoSelected(e)}
            />
            <BaiduMap
                data={data}
                center={center}
                changeList={changeList}
                mapInited={handleMapInited}
                handleBoundChanged={updateBounds} />
=======
                notifyDataSourceSwitch={handleDataSourceSwitch}
                notifyKeywordChange={ e => setKeyword(e) }
                notifyCategoryChange={ e => { setSelectedCategory(e); setSelectedTypes([]) } }
                notifyTypesChange={ e => setSelectedTypes(e) }
                handleItemClick={ e => handleInfoSelected(e) }
            />
            <BaiduMap
                data={filterData}
                center={center}
                changeList={changeList}
                mapInited={handleMapInited}
                handleBoundChanged={updateBounds}/>
>>>>>>> Fork/master
        </div>
    )
}

export default App;
