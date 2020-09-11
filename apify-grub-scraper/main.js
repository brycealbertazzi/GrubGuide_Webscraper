const Apify = require('apify');
const {
    utils: { enqueueLinks },
} = Apify;
const storedRestaurantURLs = require('./restaurantURLs');
const fs = require('fs');

const allRestaurantDataJSON = [];

const printAllData = (allRestaurantDataJSON) => {
    console.log(allRestaurantDataJSON);
    console.log(allRestaurantDataJSON.length);
}
Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    const numPages = 12;
    let currentPage = 1;
    let restaurantReviewURLs = [];

    ///For putting restaurant URLS into restaurantURLs.js///////////////////////
    // for (let i = 0; i < numPages; i++) {
    //     await requestQueue.addRequest({ url: `https://www.tripadvisor.com/Restaurants-g51766-oa${i * 30}-Bend_Central_Oregon_Oregon.html` });
    // }
    ////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < storedRestaurantURLs.data.length; i++) {
        await requestQueue.addRequest({ url: `https://www.tripadvisor.com/${storedRestaurantURLs.data[i].slice(1)}` });
    }

    const handlePageFunction = async ({ request, $ }) => {
        ///For putting restaurant URLS into restaurantURLs.js///////////////////////
        // $('.wQjYiB7z span a[href]').map((i, el) => {
        //     if (i > 0) {
        //         restaurantReviewURLs.push(el.attribs.href);
        //     }
        // });
        // if (currentPage === 3) {
        //     console.log(restaurantReviewURLs);
        // }
        // currentPage += 1;
        ////////////////////////////////////////////////////////////////////////////

        ////////////////////SCRAPE DATA FOR PAGE/////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let name;
        let description;
        let numReviews;
        let aveReviews;
        let websiteURL;
        let foodRating;
        let serviceRating;
        let valueRating;
        let atmosphereRating
        let mealType;
        let cuisines;
        let price;
        let imageURL;
        let specialDiets;

        name = $('h1._3a1XQ88S').text();
        description = $('div._1lSTB9ov').text();
        numReviews = $('a._10Iv7dOs').text();
        aveReviews = $('span.r2Cf69qf').text();
        websiteURL = `${request.url}`;

        // Gets an image of the restaurant and retrieves its URL
        $('.prw_rup.prw_common_basic_image.photo_widget.large.landscape img[src]').map((i, el) => {
            if (i === 0) {
                imageURL = el.attribs['data-lazyurl'];
            }
        });

        // Gets the price range of the restaurant
        $('._13OzAOXO._34GKdBMV a._2mn01bsa').map((i, el) => {
            if (i === 0) {
                price = el.children[0].data
            }
        });

        // Gets the meal type of the restaurant e.g. Breakfast, Lunch, Dinner, Late Night
        $('.ui_column .o3o2Iihq').map((i, el) => {
            const idx = i;
            if (el.children[0].data === "Meals") {
                $('.ui_column ._2170bBgV').map((j, el) => {
                    if (j === idx) {
                        mealType = el.children[0].data;
                    }
                });
            }
        });
        if (!mealType) {
            $('._3UjHBXYa ._14zKtJkz').map((i, el) => {
                const idx = i;
                if (el.children[0].data === "Meals") {
                    $('._3UjHBXYa ._1XLfiSsv').map((j, el) => {
                        if (j === idx) {
                            mealType = el.children[0].data;
                        }
                    });
                }
            });
        }
        if (!mealType) {
            $('._2qgIJxhC ._14zKtJkz').map((i, el) => {
                const idx = i;
                if (el.children[0].data === "Meals") {
                    $('._2qgIJxhC ._1XLfiSsv').map((j, el) => {
                        if (j === idx) {
                            mealType = el.children[0].data;
                        }
                    });
                }
            });
        }
        
        /////////////////////////////////////////////////////
        // Gets the cuisines of the restaurant
        $('.ui_column .o3o2Iihq').map((i, el) => {
            const idx = i;
            if (el.children[0].data === "CUISINES") {
                $('.ui_column ._2170bBgV').map((j, el) => {
                    if (j === idx) {
                        cuisines = el.children[0].data;
                    }
                });
            }
        });
        if (!cuisines) {
            $('._3UjHBXYa ._14zKtJkz').map((i, el) => {
                const idx = i;
                if (el.children[0].data === "CUISINES") {
                    $('._3UjHBXYa ._1XLfiSsv').map((j, el) => {
                        if (j === idx) {
                            cuisines = el.children[0].data;
                        }
                    });
                }
            });
        }
        if (!cuisines) {
            $('._2qgIJxhC ._14zKtJkz').map((i, el) => {
                const idx = i;
                if (el.children[0].data === "CUISINES") {
                    $('._2qgIJxhC ._1XLfiSsv').map((j, el) => {
                        if (j === idx) {
                            cuisines = el.children[0].data;
                        }
                    });
                }
            });
        }
        /////////////////////////////////////////////////////

        // Gets the special diets of the restaurant
        $('.ui_column .o3o2Iihq').map((i, el) => {
            const idx = i;
            if (el.children[0].data === "Special Diets") {
                $('.ui_column ._2170bBgV').map((j, el) => {
                    if (j === idx) {
                        const specialDietsString = el.children[0].data;
                        specialDiets = {
                            hasVegetarianOptions: false,
                            hasGlutenFreeOptions: false,
                            hasVeganOptions: false
                        }
                        if (specialDietsString.includes('Vegetarian Friendly')) {
                            specialDiets.hasVegetarianOptions = true;
                        }
                        if (specialDietsString.includes('Gluten Free Options')) {
                            specialDiets.hasGlutenFreeOptions = true;
                        }
                        if (specialDietsString.includes('Vegan Options')) {
                            specialDiets.hasVeganOptions = true;
                        }
                    }
                });
            }
        });
        if (!specialDiets) {
            $('._3UjHBXYa ._14zKtJkz').map((i, el) => {
                const idx = i;
                if (el.children[0].data === "Special Diets") {
                    $('._3UjHBXYa ._1XLfiSsv').map((j, el) => {
                        if (j === idx) {
                            const specialDietsString = el.children[0].data;
                            specialDiets = {
                                hasVegetarianOptions: false,
                                hasGlutenFreeOptions: false,
                                hasVeganOptions: false
                            }
                            if (specialDietsString.includes('Vegetarian Friendly')) {
                                specialDiets.hasVegetarianOptions = true;
                            }
                            if (specialDietsString.includes('Gluten Free Options')) {
                                specialDiets.hasGlutenFreeOptions = true;
                            }
                            if (specialDietsString.includes('Vegan Options')) {
                                specialDiets.hasVeganOptions = true;
                            }
                        }
                    });
                }
            });
        }

        if (!specialDiets) {
            $('._2qgIJxhC ._14zKtJkz').map((i, el) => {
                const idx = i;
                if (el.children[0].data === "Special Diets") {
                    $('._2qgIJxhC ._1XLfiSsv').map((j, el) => {
                        if (j === idx) {
                            const specialDietsString = el.children[0].data;
                            specialDiets = {
                                hasVegetarianOptions: false,
                                hasGlutenFreeOptions: false,
                                hasVeganOptions: false
                            }
                            if (specialDietsString.includes('Vegetarian Friendly')) {
                                specialDiets.hasVegetarianOptions = true;
                            }
                            if (specialDietsString.includes('Gluten Free Options')) {
                                specialDiets.hasGlutenFreeOptions = true;
                            }
                            if (specialDietsString.includes('Vegan Options')) {
                                specialDiets.hasVeganOptions = true;
                            }
                        }
                    });
                }
            });
        }
        /////////////////////////////////////////////////////

        // Gets the food, service, value and atmosphere ratings 
        $('span._377onWB-').map((i, el) => {
            const classBubbleString = el.children[0].attribs.class;
            const rating = +classBubbleString.slice(classBubbleString.length - 2) / 10;
            switch (i) {
                case 0:
                    foodRating = rating;
                case 1:
                    serviceRating = rating;
                case 2:
                    valueRating = rating;
                default:
                    atmosphereRating = rating;
            }
        });
        //////////////////END SCRAPE DATA FOR PAGE//////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Store the scraped data into this JSON object
        const restaurantDataJSON = {
            name: name,
            mealType: mealType,
            cuisines: cuisines,
            numReviews: numReviews,
            aveReviews: aveReviews,
            imageURL: imageURL,
            websiteURL: websiteURL,
            price: price,
            description: description,
            foodRating: foodRating,
            serviceRating: serviceRating,
            valueRating: valueRating,
            atmosphereRating: atmosphereRating,
            specialDiets: specialDiets
        }
        
        if (websiteURL.startsWith('https://www.tripadvisor.com/Restaurant_Review-g51766')) {
            fs.appendFile('BendRestaurantData.txt', `${JSON.stringify(restaurantDataJSON)},\n`, (err) => { 
                
                // In case of a error throw err. 
                if (err) throw err; 
            }) 
            allRestaurantDataJSON.push(restaurantDataJSON);
        }

        // Enqueue links
        const enqueued = await enqueueLinks({
            $,
            requestQueue: requestQueue,
            // pseudoUrls: ['http[s?]://www.tripadvisor.com/Restaurant_Review-g51766[.*]Bend_Central_Oregon_Oregon.html'],
            baseUrl: request.loadedUrl,
        });
    };
        
    const pageURLCrawler = new Apify.CheerioCrawler({
        requestQueue: requestQueue,
        // maxRequestsPerCrawl: numPages,
        maxRequestsPerCrawl: 256,
        handlePageFunction,
    });
    await pageURLCrawler.run();
    printAllData(allRestaurantDataJSON);
});
