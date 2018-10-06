const https = require('https');
const puppeteer = require('puppeteer');
const keys = require('../config/keys');



module.exports.findPlaceNameByImageUrl = function(imageUrl,callback){

    let searchImageUrl = "https://www.google.com/searchbyimage?image_url=";
    let encodedImageUrl = encodeURI(imageUrl);
    let rep1 = encodedImageUrl.replace(/=/g,'%3D');
    let rep2 = rep1.replace(/&/g,'%26');
    let finalUrl = searchImageUrl + rep2;


        puppeteer.launch().then(async browser => {
            try {
            const page = await browser.newPage();
            await page.setViewport({width: 1280, height: 800})
            await page.goto(finalUrl);
            let name = await page.$eval('.r5a77d', element => element.textContent);
            await browser.close();
            await console.log("googleService -> findPlaceNameByImageUrl o.k");
            await callback(name, null);
            } catch(err){
                console.log("googleService -> findPlaceByImageUrl error");
                callback(null, err);
            }
        });
};

module.exports.findPlaceIdByPlaceName = function(placeName,callback){

    console.log("findPlaceIdByPlaceName with place name: " + placeName);
    let encodedPlaceName = encodeURI(placeName);
    const googleAPIKey = keys.google.placesKey;
    const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + encodedPlaceName + "&key=" + googleAPIKey;
    https.get(url, (res) => {

        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log("googleService -> findPlaceIdByPlaceName o.k");
            let json = JSON.parse(data);
            callback(json,null);

        });

    }).on('error', (e) => {
        console.log("googleService -> findPlaceIdByPlaceName error");
        console.log(e);
        callback(null,e);
    });

  };