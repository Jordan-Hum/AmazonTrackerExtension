var i = 0;

var tempNameArray = [];
var tempPriceAddedArray = [];
var tempPriceCurrrentArray = [];

var nameArray = [];
var priceAddedArray = [];
var priceCurrentArray = [];

document.addEventListener('DOMContentLoaded', function(){

    chrome.storage.local.get('names', function(result){
        tempNameArray = result.names;
        alert(tempNameArray.length);
    })

    chrome.storage.local.get('pricesAdded', function(result){
        tempPriceAddedArray = result.pricesAdded;
    })

    chrome.storage.local.get('pricesCurrent', function(result){
        tempPriceCurrentArray = result.pricesCurrent;
    })

    if(tempNameArray.length > 0){
        alert('into if');
        alert('getting '+tempNameArray[0]);
        alert(tempNameArray.length);
        for(j=0;j<tempNameArray.length;j++){
            alert('into for');
            if(tempNameArray[j]!=null){
                addtoDOM(tempNameArray[j], tempPriceAddedArray[j], tempPriceCurrentArray[j]);
            }
        }
    }
});

//read from storage and restore to popup
function addtoDOM(iName, iPriceAdded, iPriceCurrent){
    alert('calling addtodom');

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
        nameArray[i] = name.innerHTML;

        var priceWhenAdded = document.createElement('priceWhenAdded');
        priceWhenAdded.innerHTML = "50.00";
        priceAddedArray[i] = priceWhenAdded.innerHTML;

        var priceCurrent = document.createElement('priceCurrent');
        priceCurrent.innerHTML = "30.00";
        priceCurrentArray[i] = priceCurrent.innerHTML;

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
            //console.log("put into storage");
        })

        chrome.storage.local.set({'pricesAdded': priceAddedArray} , function(){
            //console.log("put into storage");
        })

        chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){
            //console.log("put into storage");
        })

        for(j=0;;j++){
            if(nameArray[j] == null){
                i=j;
                break;
            }
        }
    }
};

storageTest.onclick = function() {
    chrome.storage.local.get('names', function(result) {
        //alert(result.names);
        for (k=0;k<result.names.length;k++){
            console.log(result.names[k]);
        }
    });
}

clearStorage.onclick = function(){
    chrome.storage.local.clear();
}
