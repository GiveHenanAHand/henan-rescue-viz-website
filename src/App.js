import React, {useEffect, useState, useMemo} from "react";
import { BaiduMap, InfoHeader } from "./components";
import './styles/App.css';

function App() {
    const [timeRange, setTimeRange] = useState(6)
    const [data, setData] = useState({})
    const [bounds, setBounds] = useState(null)

    // filter relevant states
    const [ keyword, setKeyword ] = useState('')
    const [ selectedType, setSelectedType ] = useState('')
    // const [ categories, setCategories ] = useState([])

    useEffect(() => {
        console.log("enter page")
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (Object.keys(data).length !== 0) return

            const serverData = JSON.parse(xhr.responseText)
            let pointDict = Object.assign({}, ...serverData.map(
                (serverDataEntry) => (
                    {
                        [serverDataEntry.link]: {
                            record: serverDataEntry,
                            // including different ways to create the latLong and time fields to make it compatible
                            // across different versions of json format; only for the transition phase
                            latLong: {
                                lng: (serverDataEntry.location && serverDataEntry.location.lng) || serverDataEntry.lng + Math.random() / 1000,
                                lat: (serverDataEntry.location && serverDataEntry.location.lat) || serverDataEntry.lat + Math.random() / 1000
                            },
                            time: serverDataEntry.Time || serverDataEntry.time
                        }
                    }
                )))
            setData(pointDict)
        };
        xhr.open("GET", "https://api-henan.tianshili.me/parse_json.json");
        xhr.send()
    })

    const categories = useMemo(() => {
        const items = Object.values(data)
        console.log("update categories")
        const categories = new Set(items.map(e => e.record.category ).filter(e => e && e.length > 0))
        // setCategories()

        console.log(categories)
        return [...categories].sort().reverse()
    }, [data])

    let filterData = useMemo(() => {
        let currentFilteredData;
        console.log("update filter!")

        if (timeRange !== 12 || (keyword && keyword.length > 0) || selectedType.length > 0) {
            const beginTime = Date.now() - timeRange * 60 * 60 * 1000
            currentFilteredData = Object.fromEntries(
                Object.entries(data).filter(
                    ([link, item]) => {
                        return (Date.parse(item.time || item.record.Time) > beginTime) &&
                            item.record.post.indexOf(keyword) > -1 &&
                            item.record.category.indexOf(selectedType) > -1
                    }
                )
            )
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
                list={Object.values(filterData).map(e => e.record)}
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
