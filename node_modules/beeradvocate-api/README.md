# Beeradvocate API

Unofficial JavaScript library for working with Beer Advocate data. This was originally forked from the unmaintained [Beer Advocate API](https://github.com/parryc/beer-advocate-api) JavaScript library by Charlie Hield.

### Getting started

Beeradvocate API can be installed via [NPM](https://www.npmjs.org/). Make sure you’re in your projects directory, and run the following:

```bash
$ npm install beeradvocate-api
```

### Including the library

Next, make sure to include Beeradvocate API in your project.

```javascript
var ba = require('beeradvocate-api');
```

## Documentation

### Beers

#### Search

Search for a beer

```javascript
ba.beerSearch("Buffalo Sweat", function(beers) {
    console.log(beers);
});
```

Output

```json
[
  {
    "beer_name": "Tallgrass Buffalo Sweat",
    "beer_url": "\/beer\/profile\/16333\/54413\/",
    "brewery_name": "Tallgrass Brewing Company",
    "brewery_location": "Manhattan, Kansas",
    "brewery_url": "\/beer\/profile\/16333\/",
    "retired": false
  },
  {
    "beer_name": "Tallgrass Vanilla Bean Buffalo Sweat",
    "beer_url": "\/beer\/profile\/16333\/88933\/",
    "brewery_name": "Tallgrass Brewing Company",
    "brewery_location": "Manhattan, Kansas",
    "brewery_url": "\/beer\/profile\/16333\/",
    "retired": false
  },
  {
    "beer_name": "Bourbon Barrel Buffalo Sweat",
    "beer_url": "\/beer\/profile\/16333\/179467\/",
    "brewery_name": "Tallgrass Brewing Company",
    "brewery_location": "Manhattan, Kansas",
    "brewery_url": "\/beer\/profile\/16333\/",
    "retired": false
  }
]
```

### Beer page

Get a specific beer page

```javascript
ba.beerPage("/beer/profile/16333/54413/", function(beer) {
    console.log(beer);
});
```

Output (partially working)

```json
[
  {
    "beer_name": "Tallgrass Buffalo Sweat",
    "beer_style": "",
    "beer_abv": "%",
    "brewery_name": "Tallgrass Brewing Company",
    "brewery_state": "",
    "brewery_country": "",
    "ba_score": "86",
    "ba_rating": "very good",
    "bros_score": "91",
    "bros_rating": "outstanding",
    "ratings": "",
    "reviews": "",
    "avg": "",
    "pDev": ""
  }
]
```

## Acknowledgements

Beeradvocate API is not associated with beeradvocate.com. Their website is a great resource for all of us, to show thanks you should [subscribe to their awesome magazine](https://www.beeradvocate.com/mag/subscribe/).

**Beeradvocate API** was originally forked from [Beer Advocate API](https://github.com/parryc/beer-advocate-api) by [Charlie Hield](https://github.com/stursby).
