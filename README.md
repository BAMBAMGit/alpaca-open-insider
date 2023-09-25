9/13/23
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


9/17/23
OK some more updates. When I set up the google scripts to run as a chron job (trigger) for the alpaca-open-insider.vercel.app, it turns out that the script only returns the html at it's initial loading stage. it doesn't load any of the javascript additions that are loaded into the DOM like a client normally would. I guess google apps script is extremely simple and limited...

So to circumvent this problem, I had to run all the scripts first, and then serve the HTML via an api to the alpaca-open-insider.vercel.app endpoint. Then this allows all the node.js scripts to be run before the initial html is loaded. It's the difference between hosting a static website and a dynamic one. Initially, I was trying to run a static website where the javascript content was altering the website on the client side. I needed to change it to a dynamic website where the node.js content alters the html prior to serving it to the client.

Google apps script is triggered to run every minute. it checks to see if it's the appropriate time, in this case 6hours and 30 mins. If it's the corrent time, it calls on the alpaca-open-insider.vercel.app endpoint which then triggers the serverless functions via express.js.

Then the serverless functions checks to see if the market is open. if it is, then it initiates the scrape, calculate buy quantities, and place buy orders into alpaca via alpaca's SDK. It also posts a string to firebase under a folder with the current date.

TODO:
change the name of the folders in firebase. they are currently "today's" date. they should be 14 days into the future (for sale @14days)
create a sister app that is triggered later in the day, 1230p, to check firebase for stocks marked for sale that day and place market sell orders.

Let it run through Dec? if it's beating S&P sufficiently, then try putting $1k-$10k into it?


9/22/23
I consolidated most of the functions into fewer node.js docs. this frees up lots of room for my serverless function limits on vercel.  :D

I got it to run in firebase. Turns out it was an async nightmare! I finally got it working consistently when i put an 'await' command before the set(...) request. After making EVERYTHING async, then it worked pretty well... on the buy side. it took about a week of trial an error to realize what the problem was. every time i added another async, it would work in local trials but fail in production... especially when i ran it in the morning when there are lots of orders on alpaca.

now i'm working on the sell side. I'm making it a simple API. This is better than a whole new app. i think i have it working ok. it fails sometimes when it tries to sell something that already has a buy order or if it's not in the portfolio.

TODO:
add a portfolio check for each stock that is being sold, to make sure i have enough shares to sell.
add an order checker --> delete all pending orders for the stock i'm trying to sell before i place a sell order.
