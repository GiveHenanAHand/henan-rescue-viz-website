import React, {useEffect, useState, useMemo} from "react";
import { BaiduMap, InfoHeader } from "./components";
import './styles/App.css';

function App() {
    const [timeRange, setTimeRange] = useState(6)
    const [data, setData] = useState([])
    const [bounds, setBounds] = useState(null)

    // filter relevant states
    const [ keyword, setKeyword ] = useState('')
    const [ selectedType, setSelectedType ] = useState('')

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
                    lng: (item.location && item.location.lng) || item.lng + Math.random() / 1000,
                    lat: (item.location && item.location.lat) || item.lat + Math.random() / 1000
                }
                item.time = item.Time || item.time

                // use last part of link as id
                const arr = item.link.split('/')
                item.id = arr[arr.length - 1]

                // fill null category
                item.category = item.category || '未分类'

                item.isWeibo = item.link.startsWith('no_link')

                return item
            })

            setData(items)
        };
        xhr.open("GET", "https://api-henan.tianshili.me/parse_json.json");
        xhr.send()
    })

    const categories = useMemo(() => {
        console.log("update categories")
        const categories = new Set(data.map(e => e.category ).filter(e => e && e.length > 0))

        console.log(categories)
        return [...categories].sort().reverse()
    }, [data])

    let filterData = useMemo(() => {
        let currentFilteredData
        console.log("update filter!")

        if (timeRange !== 12 || (keyword && keyword.length > 0) || selectedType.length > 0) {
            const beginTime = Date.now() - timeRange * 60 * 60 * 1000
            currentFilteredData = data.filter(item => {
                        return (Date.parse(item.time) > beginTime) &&
                            item.post.indexOf(keyword) > -1 &&
                            item.category.indexOf(selectedType) > -1
            })
        } else {
            currentFilteredData = data
        }

        return currentFilteredData
    }, [data, timeRange, keyword, selectedType])

    let handleSliderChange = (e) => {
        setTimeRange(e)
    }

    function updateBounds(newBounds) {
        setBounds(newBounds)
    }

    return (
        <div className={"rootDiv"}>
            <InfoHeader
                list={filterData}
                bounds={bounds}
                keyword={keyword}
                categories={categories}
                notifySliderChange={handleSliderChange}
                notifyKeywordChange={ e => setKeyword(e) }
                notifyTypeChange={ e => setSelectedType(e) }
            />
            <BaiduMap
                data={filterData}
                handleBoundChanged={updateBounds}/>
        </div>
    )
}

export default App;
