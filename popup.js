//TODO: webscraping for prices, making url only accept amazon links, update ui with css

var iCount;
var nameArray = [];
var priceAddedArray = [];
var priceCurrentArray = [];
var favoriteArray = [];

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

document.addEventListener('DOMContentLoaded', async () => {

    nameArray = await new Promise(resolve => chrome.storage.local.get('names', (result) => resolve(result.names)));
    priceAddedArray = await new Promise(resolve => chrome.storage.local.get('pricesAdded', (result) => resolve(result.pricesAdded)));
    priceCurrentArray = await new Promise(resolve => chrome.storage.local.get('pricesCurrent', (result) => resolve(result.pricesCurrent)));
    favoriteArray = await new Promise(resolve => chrome.storage.local.get('favorites', (result) => resolve(result.favorites)));

    if(nameArray.length >= 1){
        for(j=1;j<nameArray.length;j++){
            if(nameArray[j] && favoriteArray[j]==true){
                addtoDOM(nameArray[j], priceAddedArray[j], priceCurrentArray[j], favoriteArray[j]);
            }
        }
        for(j=1;j<nameArray.length;j++){
            if(nameArray[j] && favoriteArray[j]==false){
                addtoDOM(nameArray[j], priceAddedArray[j], priceCurrentArray[j], favoriteArray[j]);
            }
        }
    }
});

//read from storage and restore to popup
function addtoDOM(iName, iPriceAdded, iPriceCurrent, iFavorite, divCount){

    var div = document.createElement('div');
    div.style.marginTop = "10px";
    div.style.backgroundColor = "#c2e1ff";
    div.style.borderLeft = "6px solid #2196F3";
    div.className = 'items';

    var par = document.createElement("P");

    var name = document.createElement('name');
    name.innerHTML = iName + "  ";

    var priceWhenAdded = document.createElement('priceWhenAdded');
    priceWhenAdded.innerHTML = iPriceAdded + "  ";

    var priceCurrent = document.createElement('priceCurrent');
    priceCurrent.innerHTML = iPriceCurrent;

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
        
        chrome.storage.local.set({'names': nameArray}, function(){})

        chrome.storage.local.set({'pricesAdded': priceAddedArray} , function(){})

        chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){})

        chrome.storage.local.set({'favorites' : favoriteArray}, function(){})
    }

    par.appendChild(name);
    par.appendChild(priceWhenAdded);
    par.appendChild(priceCurrent);

    div.appendChild(par);
    div.appendChild(favoriteItem);
    div.appendChild(removeItem);

    document.body.appendChild(div);
}

addItem.onclick = function() {

    var URLValue = document.getElementById('itemURL').value;

    if(URLValue.length > 0){

        var div = document.createElement('div');
        div.style.marginTop = "10px";
        div.style.backgroundColor = "#c2e1ff";
        div.style.borderLeft = "6px solid #2196F3";
        div.className = 'items';

        var par = document.createElement("P");

        var name = document.createElement('name');
        name.innerHTML = URLValue;
        nameArray[iCount] = name.innerHTML;

        var priceWhenAdded = document.createElement('priceWhenAdded');
        priceWhenAdded.innerHTML = "50.00";
        priceAddedArray[iCount] = priceWhenAdded.innerHTML;

        var priceCurrent = document.createElement('priceCurrent');
        priceCurrent.innerHTML = "30.00";
        priceCurrentArray[iCount] = priceCurrent.innerHTML;

        var favoriteItem = document.createElement("BUTTON");
        favoriteItem.innerHTML = "Favorite Item";

        favoriteArray[iCount] = false;
    
        favoriteItem.onclick = function(){
            var k = nameArray.indexOf(name.innerHTML);
            if(favoriteArray[k] == true){
                favoriteArray[k] = false;
                favoriteItem.innerHTML = 'Favorite Item';
                chrome.storage.local.set({'favorites' : favoriteArray}, function() {})
                refreshPopup();
            }else if(favoriteArray[k] ==false){
                favoriteArray[k] = true;
                favoriteItem.innerHTML = 'Unfavorite Item';
                chrome.storage.local.set({'favorites' : favoriteArray}, function() {})
                refreshPopup();
            }   
        }

        var removeItem = document.createElement("BUTTON");
        removeItem.innerHTML = "Remove Item";

        removeItem.onclick = function(){
            div.remove();

            var k = nameArray.indexOf(name.innerHTML);

            nameArray[k] = null;
            priceAddedArray[k] = null;
            priceCurrentArray[k] = null;
            favoriteArray[k] = false;

            chrome.storage.local.set({ 'names': nameArray }, function () {})

            chrome.storage.local.set({ 'pricesAdded': priceAddedArray }, function () {})

            chrome.storage.local.set({ 'pricesCurrent': priceCurrentArray }, function () {})

            chrome.storage.local.set({'favorites' : favoriteArray}, function() {})
        }
        
        par.appendChild(name);
        par.appendChild(priceWhenAdded);
        par.appendChild(priceCurrent);

        div.appendChild(par);
        div.appendChild(favoriteItem);
        div.appendChild(removeItem);

        document.body.appendChild(div);

        chrome.storage.local.set({'names': nameArray}, function(){})

        chrome.storage.local.set({'pricesAdded': priceAddedArray} , function(){})

        chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){})

        chrome.storage.local.set({'favorites' : favoriteArray}, function(){})

        breakPoint:
        for(j=1;j<nameArray.length+1;j++){
            //if(!nameArray[j]){
            if(nameArray[j]==null){
                iCount=j;
                break breakPoint;
            }
        }

        chrome.storage.local.set({'count': iCount}, function(){})
    }
}

storageTest.onclick = function() {
    chrome.storage.local.get('names', function(result) {
        for (k=1;k<result.names.length;k++){
            console.log(result.names[k]);
        }
    });
}

clearStorage.onclick = function(){
    chrome.storage.local.clear();

    var iCount = 1;
    var nameArray = [];
    var priceAddedArray = [];
    var priceCurrentArray = [];

    nameArray[0]='placeholder';

    chrome.storage.local.set({'count': iCount}, function(){})

    chrome.storage.local.set({'names': nameArray}, function(){})

    chrome.storage.local.set({'pricesAdded': priceAddedArray} , function(){})

    chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){})

    chrome.storage.local.set({'favorites' : favoriteArray}, function() {})
}

function refreshPopup(){
    document.querySelectorAll('.items').forEach(function(a){
        a.remove()
    })
    var DOMContentLoaded_event = document.createEvent("Event");
    DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
    window.document.dispatchEvent(DOMContentLoaded_event);
}