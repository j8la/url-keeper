/*
Name    : url-keeper.js
Author  : Julien Blanc
Version : 1.2.0
Date    : 02/05/2016
NodeJS  : 5.10.1+ 
*/

//----------------------------------------- LOAD MODULES
var evt = require('event-timer');
var urm = require('url-monitor');
var utl = require('util');
var event = require('events').EventEmitter;
var _ = require('private-parts').createKey();


//----------------------------------------- CLASS

//------ Constructor
function urlk(options) {
    
    _(this).interval = options.interval || 5000;
    _(this).timeout = options.timeout || 3000;
    _(this).eventTimer = options.eventTimer || 'true';
    _(this).handle = null;
    _(this).running = false;
    
    _(this).urlmon = new Object();
    _(this).list = new Object();
    
    for(var item in options.list) {
        _(this).list[options.list[item]] = {
            code: null,
            status: null,
            time: null
        };
    }
    
    if(_(this).eventTimer == 'true') {
        _(this).check = new evt({
            interval: _(this).interval || 5000,
            events: ['event']
        })
    }
        
}


//------ Inherit from 'events' module
utl.inherits(urlk, event);


//------ Start monitoring
urlk.prototype.start = function() {
       
    for(var url in _(this).list) {
        
        _(this).urlmon[url] = new urm({
            url: url,
            interval: _(this).interval,
            timeout: _(this).timeout
        })
        
        _(this).urlmon[url].on('available', (data) => {

            _(this).list[data.url] = {
                code: data.code,
                status: 'available',
                time: Date.now()
            }

        })
        
        _(this).urlmon[url].on('unavailable', (data) => {

            _(this).list[data.url] = {
                code: data.code,
                status: 'unavailable',
                time: Date.now()
            }

        })
        
        _(this).urlmon[url].on('error', (data) => {
            
            _(this).list[data.url] = {
                code: data.code,
                status: 'unreachable',
                time: Date.now()
            }

        })
        
        _(this).urlmon[url].start();
        
    }
    
    if(_(this).eventTimer == 'true') {
        
        _(this).check.on('event', () => {
            
            if( _(this).running == false) {
                _(this).running = true;
            } else {
                this.emit('change', _(this).list);
            }
                
        })
        
        _(this).check.start();
        
    } else {
        
        _(this).running = true;
        
    }
    
}


//------ Stop monitoring 
urlk.prototype.stop = function() {
    
    for(var url in _(this).list) {
        _(this).urlmon[url].stop();
        delete _(this).urlmon[url];
    }
    
    if(_(this).eventTimer == 'true') {
        _(this).check.stop();
        _(this).check.removeAllListeners('event');
    }
    
    _(this).running = false;
    
}


//------ Add url
urlk.prototype.add = function(url) {
    
    this.stop();
    
    _(this).list[url] = {
        code: null,
        status: null,
        time: null
    };
   
    this.start();
        
}


//------ Delete url
urlk.prototype.del = function(url) {
    
    this.stop();
    
    delete _(this).list[url];
    delete _(this).urlmon[url];
   
    this.start();
        
}


//------ Returns array of hosts in the same format that options
urlk.prototype.getURLs = function() {
    
    var out = [];
    
    for(url in _(this).list) { out.push(url); }
    
    return out;
    
}

//------ Returns array of hosts available in the same format that options
urlk.prototype.getAvailableURLs = function() {
    
    var out = [];
    
    for(url in _(this).list) { 
        if(_(this).list[url].status == 'available') {
            out.push(url); 
        }
    }
    
    return out;
    
}


//------ Returns list of hosts with status information
urlk.prototype.getList = function() {
    
    return _(this).list;
    
}

//------ Returns list of hosts with status information
urlk.prototype.isRunning = function() {
    
    return _(this).running;
    
}


//------ Export module
module.exports = urlk;