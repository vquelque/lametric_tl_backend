const request = require("request-promise");
var departuresForStation = new Map();

async function getNextDepartures(req, res) {
  var limit = parseInt(req.query.limit);
  var departures;
  var station = req.query.from;
  if (limit < 0 || limit > 5) {
    limit = 3;
  }
  if (
    !departuresForStation.has(station) ||
    departuresForStation.get(station).length < limit
  ) {
    query_api(req, function(resp) {
      departures = getNextDepartureForStation(req, limit);
      json = formatJSON(departures);
      res.send(json);
    });
  } else {
    departures = getNextDepartureForStation(req, limit);
    json = formatJSON(departures);
    res.send(json);
  }
}

function formatJSON(departures) {
  var json = {
    frames: []
  };
  var index = 0;
  departures.forEach(item => {
    connection = {
      text: item,
      icon: "a1395",
      index: index
    };
    json.frames.push(connection);
    ++index;
  });
  return json;
}

function getNextDepartureForStation(req, limit) {
  //check if we have temp departures for this station :
  var departures;
  var departureTimes = [];
  station = req.query.from;
  departures = departuresForStation.get(station);
  var today = new Date();
  // remove item if we are too close to next departure
  // 1minute (in ms) here
  while (departures[0] - today < 1 * 60 * 1000) {
    departures.shift();
  }
  nextDepartures = departures.slice(0, limit);
  nextDepartures.forEach(item => {
    var time =
      (item.getHours() < 10 ? "0" : "") +
      item.getHours() +
      ":" +
      (item.getMinutes() < 10 ? "0" : "") +
      item.getMinutes();
    departureTimes.push(time);
  });
  return departureTimes;
}

function query_api(req, callback) {
  const options = {
    method: "GET",
    uri: "http://transport.opendata.ch/v1/connections",
    json: true,
    qs: {
      //limit: query_limit,
      from: req.query.from,
      to: req.query.to,
      limit: 16, //max limit
      fields: ["connections/from/departure", "connections/to/arrival"]
    }
  };
  request(options)
    .then(function(response) {
      var departures = [];
      response.connections.forEach(item => {
        var d = new Date(item.from.departure);
        departures.push(d);
      });
      departuresForStation.set(req.query.from, departures);
      callback(departures);
    })
    .catch(function(err) {
      console.log("error making API call");
      console.log(err);
    });
}

module.exports = {
  getNextDepartures
};
