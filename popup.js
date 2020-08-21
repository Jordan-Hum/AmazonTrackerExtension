//TODO: remove button, favorite button, webscraping for prices, making url only accept amazon links, update ui with css


var iCount;
var nameArray = [];
var priceAddedArray = [];
var priceCurrentArray = [];

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

document.addEventListener('DOMContentLoaded', async () => {

    const tempNameArray = await new Promise(resolve => chrome.storage.local.get('names', (result) => resolve(result.names)));
    const tempPriceAddedArray = await new Promise(resolve => chrome.storage.local.get('pricesAdded', (result) => resolve(result.pricesAdded)));
    const tempPriceCurrentArray = await new Promise(resolve => chrome.storage.local.get('pricesCurrent', (result) => resolve(result.pricesCurrent)));
    
    if(tempNameArray.length > 0){
        for(j=0;j<tempNameArray.length;j++){
            if(tempNameArray[j]){
                addtoDOM(tempNameArray[j], tempPriceAddedArray[j], tempPriceCurrentArray[j]);
            }
        }
    }
});

//read from storage and restore to popup
function addtoDOM(iName, iPriceAdded, iPriceCurrent){

    var div = document.createElement('div');
    div.style.marginTop = "10px";
    div.style.backgroundColor = "#c2e1ff";
    div.style.borderLeft = "6px solid #2196F3";

    var par = document.createElement("P");

    var name = document.createElement('name');
    name.innerHTML = iName + "  ";

    var priceWhenAdded = document.createElement('priceWhenAdded');
    priceWhenAdded.innerHTML = iPriceAdded + "  ";

    var priceCurrent = document.createElement('priceCurrent');
    priceCurrent.innerHTML = iPriceCurrent;

    var favoriteItem = document.createElement("BUTTON");
    favoriteItem.innerHTML = "Favorite Item";

    var removeItem = document.createElement("BUTTON");
    removeItem.innerHTML = "Remove Item";

    removeItem.onclick = function(){
        div.remove();
        chrome.storage.local.remove('names', function(){
            alert('name removed from storage');
        });
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

        var removeItem = document.createElement("BUTTON");
        removeItem.innerHTML = "Remove Item";

        removeItem.onclick = function(){
            div.remove();
            chrome.storage.local.remove('names', function(){
                alert('name removed from storage');
            });
        }
        
        par.appendChild(name);
        par.appendChild(priceWhenAdded);
        par.appendChild(priceCurrent);

        div.appendChild(par);
        div.appendChild(favoriteItem);
        div.appendChild(removeItem);

        document.body.appendChild(div);

        chrome.storage.local.set({'names': nameArray}, function(){
        })

        chrome.storage.local.set({'pricesAdded': priceAddedArray} , function(){
        })

        chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){
        })

        alert('test');

        breakPoint:
        for(j=0;j<nameArray.length+1;j++){
            if(!nameArray[j]){
                iCount=j;
                break breakPoint;
            }
        }
        
        alert(iCount);

        chrome.storage.local.set({'count': iCount}, function(){
        })
    }
};

storageTest.onclick = function() {
    chrome.storage.local.get('names', function(result) {
        for (k=0;k<result.names.length;k++){
            console.log(result.names[k]);
        }
    });
}

clearStorage.onclick = function(){
    chrome.storage.local.clear();
}
