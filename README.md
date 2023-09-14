9/13/23 v0.1.0
scrape open-insider via a custom url to get yesterday's insider trades
then check alpaca account value to help decide how much to invest today
then place buy orders on alpaca using the tickers found from the scraped url

this uses a combo of html, node.js and javascript
it runs on express.js framework

there's a lot of files which were constructed while i was in the learning process of how to put this together. they are largely unnecessary for the app to run properly.

app.js is called to run on either a local or environment host (vercel).

this calls on node document test.js which calls on other node documents. ultimately test.js serves as an API which display_scrape_cal_buy.js calls on to populate a DOM element in index.html.

so when index.html is loaded, it runs the app which scrapes, calculates buy quantities, and places buy orders.

seems simple enough, but it took a lot of work! whew! :D