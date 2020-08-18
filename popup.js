let changeColor = document.getElementById('changeColor');
//var URLValue = document.getElementById('itemURL').value;
//let favoriteItem = document.getElementById('favoriteItem');
//let removeItem = document.getElementById('removeItem');

var i = 0;

addItem.onclick = function() {
    
    var URLValue = document.getElementById('itemURL').value;

    /*var remove = "<button type = 'button' class='removeButton'> Remove Item </button>";
    var favorite = "<button type = 'button' class='favoriteButton'> Favorite Item </button>";
    if(URLValue.length > 0){
        i++;
        let test = document.createElement('div');
        document.getElementById(item).appendChild(test);

        return false;
    }*/

    var div = document.createElement('div');
    div.style.marginTop = "10px";
    div.style.backgroundColor = "#c2e1ff";
    div.style.borderLeft = "6px solid #2196F3";

    var par = document.createElement("P");

    var name = document.createElement('name');
    name.innerHTML = URLValue + "  ";

    var priceWhenAdded = document.createElement('priceWhenAdded');
    priceWhenAdded.innerHTML = "50.00  ";

    var priceCurrent = document.createElement('priceCurrent');
    priceCurrent.innerHTML = "30.00";

    var favoriteItem = document.createElement("BUTTON");
    favoriteItem.innerHTML = "Favorite Item";

    var removeItem = document.createElement("BUTTON");
    removeItem.innerHTML = "Remove Item";

    par.appendChild(name);
    par.appendChild(priceWhenAdded);
    par.appendChild(priceCurrent);

    div.appendChild(par);
    div.appendChild(favoriteItem);
    div.appendChild(removeItem);

    document.body.appendChild(div);
};
