# sw-schedule-caller

A quick script in order to calling some api in particular time schedule from service-worker

## Usage

It's Pretty straight forward

1. Register [ ./sw.js ](./sw.js)
2. Change `SCHEDULE` and `API_TO_CALL` inside the [ ./sw.js ](./sw.js)

## Example

[ ./sw.js ](./sw.js)

```js
const SCHEDULE = { from: "02:10:00:00", till: "06:50:00:00" }; // hh:mm:ss:ms 24H

const API_TO_CALL = {
  from: {
    url: "http://127.0.0.1:6800/jsonrpc",

    options: {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        Accept: "application/json",
      },

      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "aria2.unpauseAll",
        params: [],
      }),
    },
  },

  till: {
    url: "http://127.0.0.1:6800/jsonrpc",

    options: {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        Accept: "application/json",
      },

      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "aria2.pauseAll",
        params: [],
      }),
    },
  },
};
```

![sw-schedule-caller](./assets/docIMG.png)
