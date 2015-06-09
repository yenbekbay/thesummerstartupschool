var client = new Keen({
  projectId: "55752ff146f9a76de0044a88",
  readKey: "b323f7b32537259abbfa0f604d3ee7aa4c4b34881ce0374909f6c454b7ec522198664eb85d0835e1b2ddc7989063f63c52f05bf9839c71ff9c926bc130bb2fa8443dea54806f036e6d9527a6a640c9a4a7dd177156c8e32592050e8cabafee0c1cc5f7b97a2040193b11013fe7c6f8b2"
});

Keen.ready(function() {

  var points = new Keen.Query("sum", {
    eventCollection: "points",
    targetProperty: qqqwdqwdqwdqwdqwd"point.worth",
    groupBy: "point.name",
    timeframe: "this_2_months"
  });

  client.draw(points, document.getElementById("barchart"), {
    chartType: "barchart",
    title: false,
    height: 750,
    sortGroups: "desc",
    chartOptions: {
      chartArea: {
        left: "25%",
        width: "72%",
        height: "100%"
      },
      isStacked: true
    }
  });

});
