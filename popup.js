//TODO: update ui with html & css, add quick links to parts of site, add link to item, add color to availability, check all button, fix check item button(checks all)

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

var newProductPrice;
var newProductAvailability;

var tabID;

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

function insertData(data){
    productTitle = data.title;
    productPrice = data.price;
    productAvailability = data.availability;
}

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

document.addEventListener('DOMContentLoaded', async () => {

    nameArray = await new Promise(resolve => chrome.storage.local.get('names', (result) => resolve(result.names)));
    priceAddedArray = await new Promise(resolve => chrome.storage.local.get('pricesAdded', (result) => resolve(result.pricesAdded)));
    priceCurrentArray = await new Promise(resolve => chrome.storage.local.get('pricesCurrent', (result) => resolve(result.pricesCurrent)));
    availabilityArray = await new Promise(resolve => chrome.storage.local.get('availability', (result) => resolve(result.availability)));
    favoriteArray = await new Promise(resolve => chrome.storage.local.get('favorites', (result) => resolve(result.favorites)));
    urlArray = await new Promise(resolve => chrome.storage.local.get('urls', (result) => resolve(result.urls)));

    if(nameArray.length >= 1){

        for(j=1;j<nameArray.length;j++){
            if(nameArray[j] && favoriteArray[j]==true){
                addtoDOM(nameArray[j], priceAddedArray[j], priceCurrentArray[j], availabilityArray[j], favoriteArray[j], urlArray[j]);
            }
        }
        for(j=1;j<nameArray.length;j++){
            if(nameArray[j] && favoriteArray[j]==false){
                addtoDOM(nameArray[j], priceAddedArray[j], priceCurrentArray[j], availabilityArray[j], favoriteArray[j], urlArray[j]);
            }
        }
    }
});

//read from storage and restore to popup
function addtoDOM(iName, iPriceAdded, iPriceCurrent, iAvailability, iFavorite, iURL){

    var div = document.createElement('div');
    div.style.marginTop = "10px";
    div.style.backgroundColor = "#c2e1ff";
    div.style.borderLeft = "6px solid #2196F3";
    div.className = 'items';

    var par1 = document.createElement("P");
    var par2 = document.createElement("P");

    var name = document.createElement('name');
    name.innerHTML = iName + "  ";

    var availability = document.createElement('availability');
    availability.innerHTML = "Availability: " + iAvailability;

    var priceWhenAdded = document.createElement('priceWhenAdded');
    priceWhenAdded.innerHTML = iPriceAdded + "  ";

    var currentPriceText = document.createElement('currentPriceText');
    currentPriceText.innerHTML = "Current Price: ";

    var priceCurrent = document.createElement('priceCurrent');
    priceCurrent.innerHTML = iPriceCurrent + "  ";

    var checkItem = document.createElement("BUTTON");
    checkItem.innerHTML = "Check Item";


    checkItem.onclick = function() {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let tabIndex = tabs[0].index;
            chrome.tabs.create({ url: iURL, active : false, index:tabIndex+1 });
            chrome.tabs.onUpdated.addListener(function (updatedTabID , changeInfo, updatedTab) {
                tabID = updatedTabID;
                if (changeInfo.status === 'complete' ) {
                    chrome.tabs.sendMessage(updatedTabID, 
                        {from: 'popup',
                            subject: 'getNewData'}, 
                        insertNewData);
                }
              });
        })
    }

    function insertNewData(data){
        newProductPrice = data.newPrice;
        newProductAvailability = data.newAvailability;
        let priceNew = newProductPrice.substring(5);
        let pricePrevious = priceCurrent.innerHTML.substring(10);
        parseInt(priceNew);
        parseInt(pricePrevious);
        let priceDiff = pricePrevious - priceNew;
        parseInt(priceDiff);
        alert(priceNew);
        alert(pricePrevious);
        alert(priceDiff);
        if(priceDiff < 0){
            priceCurrent.style.color = "#ff0000";
        } else if (priceDiff > 0){
            priceCurrent.style.color = "#00cc00";
        }
        priceCurrent.innerHTML = newProductPrice + "  ";
        var k = nameArray.indexOf(iName);
        priceCurrentArray[k] = newProductPrice;
        chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){})
        chrome.tabs.remove(tabID);
    }
    

    var favoriteItem = document.createElement("BUTTON");
    if(iFavorite == true){
        favoriteItem.innerHTML = "Unfavorite Item";
    } else if(iFavorite == false){
        favoriteItem.innerHTML = "Favorite Item";
    }

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

    var removeItem = document.createElement("BUTTON");
    removeItem.innerHTML = "Remove Item";

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

    par1.appendChild(name);
    //par.appendChild(priceWhenAdded); implement later
    par2.appendChild(currentPriceText);
    par2.appendChild(priceCurrent);
    par2.appendChild(availability);

    div.appendChild(par1);
    div.appendChild(par2);
    div.appendChild(checkItem);
    div.appendChild(favoriteItem);
    div.appendChild(removeItem);

    document.body.appendChild(div);
}

addCurrent.onclick = function(){

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

        let url = tabs[0].url;
        
        if(!urlArray.includes(url)){

            addtoDOM(productTitle, productPrice, productPrice, productAvailability, false, url);
            
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

function refreshPopup(){
    document.querySelectorAll('.items').forEach(function(a){
        a.remove();
    })
    var DOMContentLoaded_event = document.createEvent("Event");
    DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
    window.document.dispatchEvent(DOMContentLoaded_event);
}