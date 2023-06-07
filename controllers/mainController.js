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

        // retrive the first data (BTC Data) to home page
        const firstData = await CryptoData.findOne()

        // send the first data
        res.render('index',firstData)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Internal error fetching and storing data')
    }
}

module.exports = { home_page }