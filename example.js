var QuranRecitors = require('./QuranRecitors')

quranRecitors = new QuranRecitors()
// we can listen to  the 'ready' event, so we make sure the list of recitors is ready
// to be manipulated.
quranRecitors.on('ready',function(recitors){
    // 'recitors' is an array containing all the recitors
    console.log(recitors)
    // another way to get recitors is to use 'getRecitors()' method
    console.log(JSON.stringify(quranRecitors.getRecitors()))
})