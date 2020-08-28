var iCount = 1;
var nameArray = [];
var priceAddedArray = [];
var priceCurrentArray = [];
var favoriteArray = [];
var urlArray = [];
var availabilityArray = [];

nameArray[0]='placeholder';

chrome.storage.local.set({'count': iCount}, function(){
})

chrome.storage.local.set({'names': nameArray}, function(){
})

chrome.storage.local.set({'pricesAdded': priceAddedArray} , function(){
})

chrome.storage.local.set({'pricesCurrent': priceCurrentArray} , function(){
})

chrome.storage.local.set({'favorites': favoriteArray} , function(){
})

chrome.storage.local.set({'urls': urlArray} , function(){
})

chrome.storage.local.set({'availability': availabilityArray} , function(){
})

chrome.runtime.onMessage.addListener(function(message, sender){
  if((message.from === 'content') && (message.subject === 'getTabId')){
       chrome.pageAction.show(sender.tab.id);
  }
});
