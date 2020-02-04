const SCHEDULE = { from: "02:10:00:00", till: "06:50:00:00" }; // hh:mm:ss:ms 24H

const API_TO_CALL = {
  from: {
    // url: "http://127.0.0.1:6800/jsonrpc",
    url: "http://www.mocky.io/v2/5e39a4f73200006800ddfc39",

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
    // url: "http://127.0.0.1:6800/jsonrpc",
    url: "http://www.mocky.io/v2/5e39a4f73200006800ddfc39",

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

const setCallAt = (api, time) => {
  const [hour, minute, second, mSecond] = time.split(":");

  if (!hour || !minute || !second || !mSecond)
    throw new Error(
      "ScheduleCaller: Invalided schedule:: schedule should set in format 'hh:mm:ss:ms' ",
    );

  const now = new Date();

  let millisTill =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      second,
      mSecond,
    ) - now;

  if (millisTill < 0) millisTill += 86400000;

  log(
    `Timeout-test:: for "${time}" after "${msToTime(millisTill)}" later`,
    "gold",
  );

  setTimeout(() => {
    call(api.url, api.options)
      .then(() => {
        log(
          `Timeout-test:: pass(✓) Successfully setInterval for "${time}"`,
          "cyan",
        );

        setInterval(() => {
          log(`Interval:: for ${time}`, "cyan");

          call(api.url, api.options);
        }, 86400000);
      })
      .catch(err =>
        console.error(
          `ScheduleCaller: Timeout-test:: Fail(x) failed to setInterval on "${time}" ${err}`,
        ),
      );
  }, millisTill);
};

self.addEventListener("activate", () => {
  log(
    `Activating calling schedule from: "${SCHEDULE.from}" till: "${SCHEDULE.till}"`,
  );

  Object.keys(SCHEDULE).forEach(key =>
    setCallAt(API_TO_CALL[key], SCHEDULE[key]),
  );
});

function log(message, color = "#bada55") {
  console.log(
    `%c ScheduleCaller: ${message}`,
    `background: #222; color: ${color}`,
  );
}

function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
}

function call(url, options, fetcher = fetch) {
  log(`Sending a ${options.method} request to ${url}`);

  return new Promise((resolve, reject) =>
    fetcher(url, options)
      .then(res => {
        log(`Successfully fetched:: ${url}`);

        if (res.json) {
          res.json().then(res => {
            log(`Response:: ${url}`);

            console.table(res);
          });
        }

        resolve(res);
      })
      .catch(err => {
        reject(err);

        console.error(`ScheduleCaller: ${url} failed ${err}`);
      }),
  );
}
