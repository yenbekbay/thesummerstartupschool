$(function(){
  var students = [
    { value: 'Ayan Yenbekbay' },
    { value: 'Aimukhametova Saltanat' },
    { value: 'Amir Nursultan' },
    { value: 'Arkalyk Akash' },
    { value: 'Arziyev Kudryatzhan' },
    { value: 'Arziyev Suhrat' },
    { value: 'Asanov Ulan' },
    { value: 'Askaruly Sanzhar' },
    { value: 'Baktybayeva Nazifa' },
    { value: 'Bakyt Uulu' },
    { value: 'Bolatov Nurdaulet' },
    { value: 'Dalibayeva Guldana' },
    { value: 'Elyubayeva Assel' },
    { value: 'Ibragimov Bauirzhan' },
    { value: 'Ilyasov Ibrahim' },
    { value: 'Ilyassov Rustam' },
    { value: 'Iskendirova Gulmira' },
    { value: 'Jumabekov Sapar' },
    { value: 'Kairatuly Almas' },
    { value: 'Kalmurzayev Sergazy' },
    { value: 'Kapar Ardak' },
    { value: 'Kappasov Rauan' },
    { value: 'Kaskyrbek Aidana' },
    { value: 'Kazhymurat Aknazar' },
    { value: 'Kenzhetayev Daulet' },
    { value: 'Khvan Olga' },
    { value: 'Lee Elina' },
    { value: 'Makul Dauren' },
    { value: 'Mekebayeva Diana' },
    { value: 'Mynzhassarov Ilyas' },
    { value: 'Myrzagalym Sanzhar' },
    { value: 'Park Tatyana' },
    { value: 'Pernebayeva Didara' },
    { value: 'Segisbayev Kemal' },
    { value: 'Serikov Anuar' },
    { value: 'Tazhibayev Ayan' },
    { value: 'Toktasynov Yeldar' },
    { value: 'Yesenzhanov Hakim' },
    { value: 'Zholdasbayev Ilyas' },
    { value: 'Zhuginissova Karlygash' },
    { value: 'Zigangirov Anatolij' },
    { value: 'Juliet Lozovaya' }
  ];

  var date = new Date();
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];
  var weekday = weekdays[date.getDay()];
  var month = months[date.getMonth()];
  var day = date.getDate();
  $('.form-title').text('Leaderboard Submission - ' + weekday + ', ' + month + ' ' + day);

  var client = new Keen({
    projectId: "55752ff146f9a76de0044a88",
    readKey: "b323f7b32537259abbfa0f604d3ee7aa4c4b34881ce0374909f6c454b7ec522198664eb85d0835e1b2ddc7989063f63c52f05bf9839c71ff9c926bc130bb2fa8443dea54806f036e6d9527a6a640c9a4a7dd177156c8e32592050e8cabafee0c1cc5f7b97a2040193b11013fe7c6f8b2",
    writeKey: "270e5d5609429651dd77dd434141cdf3d12c0d152949d6aeb8e8aad0c868195e15dcb4967e6a884fe1190902aced7a2ef33c44a73ede309a6d47af2f9bd7af35cfa19e63aebe3f396af9cb96f59baeb4d67502b518189086e5f23e00ed6a03a16b3b5681d234beda17a250ef7c83848b"
  });

  var opts = { lines: 13, length: 28, width: 14, radius: 42, scale: 0.25, corners: 1,
    color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 1, trail: 60, fps: 20,
    zIndex: 2e9, className: 'spinner', top: '75px', left: '50%', shadow: false,
    hwaccel: false, position: 'relative' }
  var target = document.getElementById('output')

  // setup autocomplete function pulling from currencies[] array
  $('#autocomplete').autocomplete({
    lookup: students,
    onSelect: function (suggestion) {
      $('#label').html(suggestion.value);
      var spinner = new Spinner(opts).spin(target);
      $('#form').show();
      $('#form').css("visibility", "hidden");
      var i = 0;
      $('#form input[type=checkbox]').each(function() {
        var type = this.name;
        var checkbox = $(this);
        var count = new Keen.Query("count", {
            eventCollection: "points",
            timeframe: "today",
            filters: [
              {
                "property_name" : "point.name",
                "operator" : "eq",
                "property_value" : $('#label').text()
              },
              {
                "property_name" : "point.type",
                "operator" : "eq",
                "property_value" : type
              }
            ]
        });
        client.run(count, function(err, response) {
          if (err) {
            alert(err);
          } else {
            if (parseInt(response.result) > 0) {
              checkbox.prop('disabled', true);
              checkbox.prop('checked', true);
              checkbox.next('span').addClass('disabled');
            }
          }
          i++;
          if (i >= 3) {
            spinner.stop();
            $('#form').css("visibility", "visible");
          }
        });
      });
    }
  });

  $('#form').submit(function(event) {
    $('#form input[type=checkbox]').each(function() {
      if (this.checked) {
        var worth = 1;
        if (this.name == 'bronze') {
          worth = 2;
        } else if (this.name == 'silver') {
          worth = 3;
        } else if (this.name == 'gold') {
          worth = 4;
        }
        client.addEvent("points", {
          point: {
            name: $('#label').text(),
            type: this.name,
            worth: worth
          },
          keen: {
            timestamp: new Date().toISOString()
          }
        });
      }
    });
    $('#label').html("Success. Added points to " + $('#label').text() + ".");
    $('#form').hide();
    event.preventDefault();
  });

});
