var i = 0;
var nameArray = [];
var priceAddedArray = [];
var priceCurrentArray = [];

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

        /*chrome.storage.sync.set({'name${i}':nameArray[i]}, function(){
            chrome.storage.sync.get('name${i}', function(result){
                alert(result.name${i});
            });
        }); */
        /*chrome.storage.local.set({'nameArray':nameArray}, function(){
            chrome.storage.local.get('nameArray', function(result){
                for(k=0;k<10;k++){
                    alert(result.nameArray[k]);
                }
            });
        }); */

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

        chrome.storage.local.set({'names': name.innerHTML} , function(){
            alert('put into storage');
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
        alert(result.names);
    });
}

clearStorage.onclick = function(){
    chrome.storage.local.clear();
}