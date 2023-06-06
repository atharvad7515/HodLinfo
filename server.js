const express = require('express')
const mongoose = require('mongoose')

const app = express()

// routes importing
const apiRoute = require('./routes/apiRoute.js')

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// view engine
app.set('view engine', 'ejs')

app.listen(3000)

app.get('/', (req, res) => res.render('index'))

app.use((req, res) => {
    res.status(404).send("404 not found")
  })