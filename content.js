chrome.runtime.sendMessage(
    {
        from: 'content',
        subject: 'getTabId'
    }
);
    
chrome.runtime.onMessage.addListener(function(message, sender, response){
    if((message.from === 'popup') && (message.subject === 'getData')){
        var objson = {
            title:	document.getElementById("productTitle").innerText,
            price: document.getElementById("priceblock_ourprice").innerText,
            availability: document.getElementById("availability").innerText
        };
            response(objson);
        };
    }
);