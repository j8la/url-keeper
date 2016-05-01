url-keeper
=============
Dynamically maintains a list of URLs based on their availability in a given time interval. You can also add or remove a URL on the fly. Uses url-monitor and event-timer.

## Installation 
```
npm install url-keeper
```

## How to
Here a simple example with the 'change' event, in fact a timer based on interval option, which gives you a Javascript Object with detailed informations (http status codes, status, last checked time) :
```javascript
// Load module
var urlkeeper = require('./url-keeper.js');

// create url-keeper instance
var monitor = new urlkeeper({
    interval: 5000,                    // 5000 ms by default, optional
    timeout: 3000,                     // 3000 ms by default, optional
    list:['http://www.google.fr',      // Mandatory
          'http://www.microsoft.com',
          'http://www.apple.com',
          'https://www.debian.org']
});

// Timer which refreshes results on time interval
monitor.on('change', (data) => { 
    console.dir(data,{colors: true}); 
})

// Start url-keeper
monitor.start();
```

The results given by the 'change' event will be :
```javascript
{ 
    'http://www.google.fr': { 
        code: 200, 
        status: 'available', 
        time: 1462138566961 
    },
    'http://www.microsoft.com': { 
        code: 200, 
        status: 'available', 
        time: 1462138566917 
    },
    'http://www.apple.com': { 
        code: 200, 
        status: 'available', 
        time: 1462138567049 
    },
    'https://www.debian.org': { 
        code: 200, 
        status: 'available', 
        time: 1462138567341 
    },
    'http://www.npmjs.com': { 
        code: 301, 
        status: 'available', 
        time: 1462138567062 
    } 
}
```

If you want to manage the refresh of the list by yourself without the 'change' event, you can access the list with this method (but the interval option is always necessary for URL checking) :
```javascript
monitor.getList();
```

You can get an array of the URLs (for an example, to get the updated list passed at origin in the options before stopping the instance) :
```javascript
monitor.getURLs();
```

You can add or delete an url to the list on the fly :
```javascript
monitor.add('https://my.secure.site');
monitor.del('https://my.secure.site');
```

If you want to know if url-keeper is running (returns 'true' or 'false'):
```javascript
monitor.isRunning();
```

To stop url-keeper:
```javascript
monitor.stop();
```

## Updates
- `v1.0.1 :` Removes an old reference to an unused module.
- `v1.0.0 :` Initial release

## License
The MIT License (MIT) 
Copyright (c) 2016 Julien Blanc
 