const request = require("request-promise");

async function getNextDepartures(req, res, next) {
  var limit = parseInt(req.query.limit);
  if (limit < 0 || limit > 5) {
    limit = 3;
  }
  query_limit = limit + 1; //add one more if next departure too close
  const options = {
    method: "GET",
    uri: "http://transport.opendata.ch/v1/connections",
    json: true,
    qs: {
      limit: query_limit,
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
        var today = new Date();
        var time =
          (d.getHours() < 10 ? "0" : "") +
          d.getHours() +
          ":" +
          (d.getMinutes() < 10 ? "0" : "") +
          d.getMinutes();
        //add only if we are not to close to next departure
        // 1minute (in ms) here
        if (d - today > 1 * 60 * 1000) {
          departures.push(time);
        }
      });
      //remove last item depending on wether we are too close to next departure
      if (departures.length > limit) {
        departures.pop();
      }
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
