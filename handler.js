'use strict'

const Parser = require('rss-parser')
const parser = new Parser()

const getDate = dateStr => {
  const date = new Date(dateStr);
  return date.toISOString()
}

let lastFetched = null
let lastNews = []
const getMarcio = async () => {
  const now = new Date().getTime()
  if (!lastFetched || now - lastFetched.getTime() > 60000 * 60) {
    const feed = await parser.parseURL(
      'http://www.blogdomarciorangel.com.br/feed'
    )
    const news = feed.items.slice(0, 5).map(({ link, title, pubDate }, i) => ({
      uid: title,
      updateDate: getDate(pubDate),
      titleText: title,
      mainText: title,
      redirectionUrl: link,
    }))
    lastFetched = new Date()
    lastNews = news
  }
  return lastNews
}
module.exports.marcio = (event, context, callback) => {
  getMarcio().then(news => {
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify(news),
    }

    callback(null, response)
  })
}
