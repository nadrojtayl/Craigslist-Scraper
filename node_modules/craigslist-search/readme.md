# Craigslist Search 



This module allows to:
1. list all the listings in specified city for specified category
2. list all the listings in ALL craigslist cities for specified category

## Installation

```bash
npm install craigslist-search
```

## Usage
Example for command line: get ticket listings in New York 

```bash
node main.js --city=newyork --category=tia   // gets first 100 ticket listings
```
get next 100 ticket listings 

```bash
node main --city=newyork --category=tia --offset=100
```
to get tickets with images

```bash
node main --city=newyork --category=tia --hasPic=true
```
and with a query

```bash
node main --city=newyork --category=tia --hasPic=true --query=concert 
```
Get the list of all craigslist cities

```bash
node main --citiesOnly=true 
```

### Options
```javascript
options = {
  city: 'newyork',
  category: 'tia', /* tickets */
  hasPic: 1,
  offset: 100,     /* next 100 records */
  query: 'concert'
}
```
For list of cities
```javascript
options = {
  citiesOnly: 'true',
}
```

### Listing Object

Each returned listing will have several properties like in the example below:
```javascript
  {
    "category": "tickets - by owner",
    "date": "2014-12-08 16:30",
    "hasPic": true,
    "location": "Midtown West",
    "pid": "4796283245",
    "price": "$350",
    "title": "New York Giants vs Washington Redskins - Lower Level",
    "url": "https://newyork.craigslist.org/mnh/tix/4796283245.html",
    "pic": "http://images.craigslist.org/00W0W_a19zyPK9o3U_300x300.jpg"
 }
```