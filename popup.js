//TODO: fix check item button(checks all), clicking one check item changes the text for the next items, but not the previous ones

//declare variables

var iCount;
var nameArray = [];
var priceAddedArray = [];
var priceCurrentArray = [];
var favoriteArray = [];
var urlArray = [];
var availabilityArray = [];

var productTitle;
var productPrice;
var productAvailability;

var tabID;

//get data from the current page by sending a message to content.js
//calls the insertData function

chrome.tabs.query(
	{active: true, 
	currentWindow: true},
	function (tabs){
	chrome.tabs.sendMessage(tabs[0].id, 
		{from: 'popup',
	     subject: 'getData'}, 
		insertData);
        }
);
    
//update variables with data from the current page

function insertData(data){
    productTitle = data.title;
    productPrice = data.price;
    productAvailability = data.availability;
}

//get values and arrays from storage

chrome.storage.local.get('count', function(result){
    iCount = result.count;
})

chrome.storage.local.get('names', function(result){
    nameArray = result.names;
})

chrome.storage.local.get('pricesAdded', function(result){
    priceAddedArray = result.pricesAdded;
})

chrome.storage.local.get('pricesCurrent', function(result){
    priceCurrentArray = result.pricesCurrent;
})

chrome.storage.local.get('favorites', function(result){
    favoriteArray = result.favorites;
})

chrome.storage.local.get('urls', function(result){
    urlArray = result.urls;
})

chrome.storage.local.get('availability', function(result){
    availabilityArray = result.availability;
})

//the DOMContentLoaded event fires when the HTML document of the popup has been completely loaded

document.addEventListener('DOMContentLoaded', async () => {

    //disables the addCurrent button if the url of the current page does not include amazon
    
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        if (!url.includes("amazon")){
            addCurrent.disabled = true;
        }
    })

    //get values from storage asynchronously so that we can load the items in storage
    
    nameArray = await new Promise(resolve => chrome.storage.local.get('names', (result) => resolve(result.names)));
    priceAddedArray = await new Promise(resolve => chrome.storage.local.get('pricesAdded', (result) => resolve(result.pricesAdded)));
    priceCurrentArray = await new Promise(resolve => chrome.storage.local.get('pricesCurrent', (result) => resolve(result.pricesCurrent)));
    availabilityArray = await new Promise(resolve => chrome.storage.local.get('availability', (result) => resolve(result.availability)));
    favoriteArray = await new Promise(resolve => chrome.storage.local.get('favorites', (result) => resolve(result.favorites)));
    urlArray = await new Promise(resolve => chrome.storage.local.get('urls', (result) => resolve(result.urls)));

    //display all the items from storage starting with the favorited items

    if(nameArray.length >= 1){

        for(j=1;j<nameArray.length;j++){
            if(nameArray[j] && favoriteArray[j]==true){
                addtoDOM(nameArray[j], priceAddedArray[j], priceCurrentArray[j], availabilityArray[j], favoriteArray[j], urlArray[j], j);
            }
        }
        for(j=1;j<nameArray.length;j++){
            if(nameArray[j] && favoriteArray[j]==false){
                addtoDOM(nameArray[j], priceAddedArray[j], priceCurrentArray[j], availabilityArray[j], favoriteArray[j], urlArray[j], j);
            }
        }
    }
});

//this method displays the item in the popup with the given information

function addtoDOM(iName, iPriceAdded, iPriceCurrent, iAvailability, iFavorite, iURL, count){

    //initialize the div and pars of each item
    
    var div = document.createElement('div');
    div.style.marginTop = "10px";
    div.style.backgroundColor = "#c2e1ff";
    div.style.borderLeft = "6px solid #2196F3";
    div.className = 'items';

    var par1 = document.createElement("P");
    var par2 = document.createElement("P");
    
    //initialize all the text variables of each element

    var name = document.createElement('name');
    name.innerHTML = iName;
    //name.id = 'name-'+ count;

    var availabilityText = document.createElement('availabilityText');
    availabilityText.innerHTML = "Availability: ";

    var availability = document.createElement('availability');
    availability.innerHTML = iAvailability;
    if(availability.innerHTML.includes("Temporarily")){
        availability.innerHTML = "Temporarily Out of Stock.";
    }
    //availability.id = 'availability-' + count;

    var priceWhenAdded = document.createElement('priceWhenAdded');
    priceWhenAdded.innerHTML = iPriceAdded + "  ";

    var currentPriceText = document.createElement('currentPriceText');
    currentPriceText.innerHTML = "Current Price: ";

    var priceCurrent = document.createElement('priceCurrent');
    priceCurrent.innerHTML = iPriceCurrent + "  ";
    //priceCurrent.id = 'priceCurrent-' + count;
    
    //adds view item button that brings the user to the page of the item when clicked

    var viewItem = document.createElement("BUTTON");
    viewItem.innerHTML = "View Item";

    viewItem.onclick = function(){
        chrome.tabs.create({ url: iURL, active : true});
    }

    //adds check item button that opens the item in a new tab to check for changes in prices and availability
    //and it updates the information in the popup
    //calls the myListener in a addListener function

    var checkItem = document.createElement("BUTTON");
    checkItem.innerHTML = "Check Item";

    checkItem.onclick = function() {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let tabIndex = tabs[0].index;
            chrome.tabs.create({ url: iURL, active : false, index:tabIndex+1 });
            chrome.tabs.onUpdated.addListener(myListener);
        })
    }

    //adds listener to wait for the page to load completely and sends a message to content.js

    function myListener(updatedTabID , changeInfo, updatedTab) {
        tabID = updatedTabID;
        if (changeInfo.status === 'complete' ) {
            chrome.tabs.sendMessage(updatedTabID, 
                {from: 'popup',
                    subject: 'getNewData'}, 
                insertNewData);
            chrome.tabs.onUpdated.removeListener(myListener);
            return;
        }
    };

    //updates the information

    function insertNewData(data){

        var k = nameArray.indexOf(iName);

        let newProductPrice = data.newPrice;
        let newProductAvailability = data.newAvailability;

        //parse the values obtained to remove unneeded information and check if the new price is lower or higher than the previous one
        
        let priceNew = newProductPrice.substring(5);
        let pricePrevious = priceCurrent.innerHTML.substring(10);
        parseInt(priceNew);
        parseInt(pricePrevious);
        let priceDiff = pricePrevious - priceNew;
        parseInt(priceDiff);

        //alert(priceNew);
        //alert(pricePrevious);
        //alert(priceDiff);

        //change the color of the price according to the new price
        
        if(priceDiff < 0){
            priceCurrent.style.color = "#ff0000";   //if new price is lower, set text to red
        } else if (priceDiff > 0){
            priceCurrent.style.color = "#00cc00";   //if new price is higher, set text to green
        }
        
        //change the color of the availability according to the new availability
        //https://www.amazon.ca/gp/help/customer/display.html?nodeId=201910280
        
        if(newProductAvailability == "In Stock."){  //if item is in stock, set text to green
            availability.style.color = "#00cc00";   
        } else if (newProductAvailability.includes("Currently") || newProductAvailability.includes('Not')){    //if item is out of stock, set text to red
            availability.style.color = "#ff0000";
        } else if (newProductAvailability.includes("Temporarily")){ //seperate case to remove all the text that follows, sets text to red
            availability.style.color = "#ff0000";
            newProductAvailability = "Temporarily Out of Stock.";
        } else {                                    //else, set text to yellow
            availability.style.color = "#ffff00";
        }

        priceCurrent.innerHTML = newProductPrice + "  ";
        priceCurrentArray[k] = newProductPrice;
        chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){});

        availability.innerHTML = newProductAvailability + "  ";
        availabilityArray[k] = newProductAvailability;
        chrome.storage.local.set({'availability': availabilityArray} , function(){});
        
        chrome.tabs.remove(tabID);
    }
    
    //adds favorite button, allows the favorite button to display the correct text depending on whether the user has favorited the item or not

    var favoriteItem = document.createElement("BUTTON");
    if(iFavorite == true){
        favoriteItem.innerHTML = "Unfavorite Item";
    } else if(iFavorite == false){
        favoriteItem.innerHTML = "Favorite Item";
    }

    //adds functionality to the favorite button, sets the appropriate index in the favorite of true/false depending on its status and refresh the popup
    //to allow favorite to be put on top of the list 
    
    favoriteItem.onclick = function(){
        var k = nameArray.indexOf(iName);
        if(iFavorite == true){
            favoriteArray[k] = false;
            favoriteItem.innerHTML = 'Favorite Item';
            chrome.storage.local.set({ 'favorites': favoriteArray }, function () { })
            refreshPopup();

        } else if (iFavorite == false) {
            favoriteArray[k] = true;
            favoriteItem.innerHTML = 'Unfavorite Item';
            chrome.storage.local.set({ 'favorites': favoriteArray }, function () { })
            refreshPopup();
        }
    }

    //adds remove button
    
    var removeItem = document.createElement("BUTTON");
    removeItem.innerHTML = "Remove Item";

    //adds functionality to the remove button, sets all appropriate arrays to null or false to remove item from the array and sets them in the storage

    removeItem.onclick = function(){
        div.remove();

        var k = nameArray.indexOf(iName);

        nameArray[k] = null;
        priceAddedArray[k] = null;
        priceCurrentArray[k] = null;
        favoriteArray[k] = false;
        urlArray[k] = null;
        availabilityArray[k] = null;

        chrome.storage.local.set({ 'names': nameArray }, function () {})

        chrome.storage.local.set({ 'pricesAdded': priceAddedArray }, function () {})

        chrome.storage.local.set({ 'pricesCurrent': priceCurrentArray }, function () {})

        chrome.storage.local.set({'favorites' : favoriteArray}, function() {})

        chrome.storage.local.set({'urls' : urlArray}, function() {})

        chrome.storage.local.set({'availability' : availabilityArray}, function() {})
    }

    //adds the name, price, availability to the list for each item in the list

    par1.appendChild(name);
    //par.appendChild(priceWhenAdded); TODO****
    par2.appendChild(currentPriceText);
    par2.appendChild(priceCurrent);
    par2.appendChild(availabilityText);
    par2.appendChild(availability);

    //adds button for view Item, check Item, favorite Item and remove Item for each item in the list

    div.appendChild(par1);
    div.appendChild(par2);
    div.appendChild(viewItem);
    div.appendChild(checkItem);
    div.appendChild(favoriteItem);
    div.appendChild(removeItem);

    document.body.appendChild(div);
}

//adds functionality to the Add Current Item button, allows users to add the item to the list with the name, price, availability 

addCurrent.onclick = function(){

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

        let url = tabs[0].url;

        //checks if the item has already been added to the list

        if(!urlArray.includes(url)){

            //calls addtoDom method which allows elements to be added to the popup
            
            addtoDOM(productTitle, productPrice, productPrice, productAvailability, false, url, iCount);
            
            //adds corresponding information to the correct array and sets the arrays in storage
            
            nameArray[iCount] = productTitle;
            
            urlArray[iCount] = url;
            
            availabilityArray[iCount] = productAvailability;

            favoriteArray[iCount] = false;
            
            priceAddedArray[iCount] = productPrice;
            
            priceCurrentArray[iCount] = productPrice;

            chrome.storage.local.set({'names': nameArray}, function(){})

            chrome.storage.local.set({'pricesAdded': priceAddedArray} , function(){})

            chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){})

            chrome.storage.local.set({'favorites' : favoriteArray}, function(){})

            chrome.storage.local.set({'urls' : urlArray}, function(){})

            chrome.storage.local.set({'availability' : availabilityArray}, function(){})

            //finds the next available spot in the arrays

            breakPoint:
            for(j=1;j<nameArray.length+1;j++){
                //if(!nameArray[j]){
                if(nameArray[j]==null){
                    iCount=j;
                    break breakPoint;
                }
            }

            chrome.storage.local.set({'count': iCount}, function(){})

        } else {
            alert('Item already added');
        }
    });
}

//allows the popup to refresh itself by removing all items and readding them

function refreshPopup(){
    document.querySelectorAll('.items').forEach(function(a){
        a.remove();
    })
    var DOMContentLoaded_event = document.createEvent("Event");
    DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
    window.document.dispatchEvent(DOMContentLoaded_event);
}


//allows users to quickly navigate to frequent pages on amazon.ca using the dropdown menu

document.getElementById("links").onchange = goToLink;

function goToLink(){
    switch(document.getElementById('links').value){
        case "goto":
            break;
        case "home":
            chrome.tabs.create({ url: "https://www.amazon.ca/", active : true});
            break;
        case "account":
            chrome.tabs.create({ url: "https://www.amazon.ca/gp/css/homepage.html?ref_=nav_AccountFlyout_ya", active : true});
            break;
        case "orders":
            chrome.tabs.create({ url: "https://www.amazon.ca/gp/your-account/order-history?ref_=ya_d_c_yo", active : true});
            break;
        case "cart":
            chrome.tabs.create({ url: "https://www.amazon.ca/gp/cart/view.html?ref_=nav_cart", active : true});
            break;
        case "deals":
            chrome.tabs.create({ url: "https://www.amazon.ca/gp/goldbox?ref_=nav_cs_gb", active : true});
            break;
        case "bestsellers":
            chrome.tabs.create({ url: "https://www.amazon.ca/Best-Sellers-generic/zgbs/?ref_=nav_cs_bestsellers", active : true});
            break;
        case "releases":
            chrome.tabs.create({ url: "https://www.amazon.ca/gp/new-releases/?ref_=nav_cs_newreleases", active : true});
            break;
        case "service":
            chrome.tabs.create({ url: "https://www.amazon.ca/gp/help/customer/display.html?ref_=nav_cs_help", active : true});
            break;
    }
}

