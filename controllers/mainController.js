const axios = require("axios")
const CryptoData = require('../models/cryptoDataSchema')

const home_page = async (req, res) => {
    try {
        // fetching the data
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers')
        const res_data = await response.data

        // slice the top 10 results
        const result = Object.values(res_data).slice(0, 10)

        // creating an array of Data Model instance
        const cryptoDataArray = result.map((data) => new CryptoData(data))

        // store the data in DB collection
        await CryptoData.insertMany(cryptoDataArray)

        // process the data

        const storedData = await CryptoData.find().limit(8)

        const processedData = []

        storedData.forEach((data) => {
            var { base_unit, name, buy, sell, volume, open, low, high, last } = data;

            const timestamp = new Date(data.at * 1000)
            const tradeTime = timestamp.toLocaleString()
            base_unit = base_unit.toUpperCase()
            // Create an object containing the processed data for each base unit
            const processedDoc = {
                baseUnit: base_unit,
                name: name,
                buy: buy,
                sell: sell,
                volume: volume,
                open: open,
                low: low,
                high: high,
                last: last,
                tradeTime: tradeTime,
            }

            processedData.push(processedDoc)
        })

            CryptoData.deleteMany({})

            // send the first data
            res.render('index',{data:processedData})
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Internal error fetching and storing data')
        }
    }

module.exports = { home_page }