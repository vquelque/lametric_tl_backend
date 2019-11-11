const request = require("request-promise");

async function getNextDepartures(req, res, next) {
  var limit = req.query.limit;
  if (limit < 0 || limit > 5) {
    limit = 3;
  }
  const options = {
    method: "GET",
    uri: "http://transport.opendata.ch/v1/connections",
    json: true,
    qs: {
      limit: limit,
      from: req.query.from,
      to: req.query.to,
      fields: ["connections/from/departure", "connections/to/arrival"]
    }
  };
  request(options)
    .then(function(response) {
      var departures = [];
      response.connections.forEach(item => {
        var d = new Date(item.from.departure);
        var time =
          (d.getHours() < 10 ? "0" : "") +
          d.getHours() +
          ":" +
          (d.getMinutes() < 10 ? "0" : "") +
          d.getMinutes();
        departures.push(time);
      });
      json = formatJSON(departures);
      res.send(json);
    })
    .catch(function(err) {
      console.log("error making API call");
      console.log(err);
    });
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

module.exports = {
  getNextDepartures
};
