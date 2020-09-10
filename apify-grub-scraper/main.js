const Apify = require('apify');
const {
    utils: { enqueueLinks },
} = Apify;

const allRestaurantDataJSON = [];

const printAllData = (allRestaurantDataJSON) => {
    console.log(allRestaurantDataJSON);
}

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: 'https://www.tripadvisor.com/Restaurant_Review-g51766' });
    const handlePageFunction = async ({ request, $ }) => {
        const name;
        const description;
        const numReviews;
        const aveReviews;
        const websiteURL;
        let foodRating;
        let serviceRating;
        let valueRating;
        let atmosphereRating
        let mealType;
        let cuisines;
        let price;
        let imageURL;
        let specialDiets;

        ////////////////////SCRAPE DATA FOR PAGE/////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        ////////////////////END SCRAPE DATA FOR PAGE//////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        
        allRestaurantDataJSON.push(restaurantDataJSON);

        // Enqueue links
        const enqueued = await enqueueLinks({
            $,
            requestQueue,
            pseudoUrls: ['http[s?]://www.tripadvisor.com/Restaurant_Review-g51766[.*]Bend_Central_Oregon_Oregon.html'],
            baseUrl: request.loadedUrl,
        });
    };
    // nav next disabled
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        maxRequestsPerCrawl: 30,
        handlePageFunction,
    });
    await crawler.run();
    printAllData(allRestaurantDataJSON);
});
