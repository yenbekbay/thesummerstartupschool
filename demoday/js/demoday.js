;(function(window, document, $){
  $(document).ready(function(){
    $('.app-image img').on('ab-color-found', function(e, data){
      $(this).parents('.app-info').css({ background: data.color });
      var contrastingColor = getContrastingColor(data.color);
      $('.app-image .app-store-link').css({ color: 'white' });
      $('.app-description h1').css({ color: contrastingColor });
      $('.app-description p').css({ color: contrastingColor });
      $('.app-description a').css({ color: contrastingColor });
    });
    $.adaptiveBackground.run();

    var labels = ['weeks', 'days', 'hours', 'minutes', 'seconds'],
      template = _.template($('#countdown-timer-template').html()),
      currDate = '00:00:00:00:00',
      nextDate = '00:00:00:00:00',
      parser = /([0-9]{2})/gi,
      $timer = $('#countdown-timer');
    function strfobj(str) {
      var parsed = str.match(parser),
        obj = {};
      labels.forEach(function(label, i) {
        obj[label] = parsed[i]
      });
      return obj;
    }
    // Return the time components that diffs
    function diff(obj1, obj2) {
      var diff = [];
      labels.forEach(function(key) {
        if (obj1[key] !== obj2[key]) {
          diff.push(key);
        }
      });
      return diff;
    }
    // Build the layout
    var initData = strfobj(currDate);
    labels.forEach(function(label, i) {
      $timer.append(template({
        curr: initData[label],
        next: initData[label],
        interval: label,
        label: getEndingForLabel(label, 0)
      }));
    });
    // Starts the countdown
    $timer.countdown('2015/08/04', function(event) {
      var newDate = event.strftime('%w:%d:%H:%M:%S'),
        data;
      if (newDate !== nextDate) {
        currDate = nextDate;
        nextDate = newDate;
        // Setup the data
        data = {
          'curr': strfobj(currDate),
          'next': strfobj(nextDate)
        };
        // Apply the new values to each node that changed
        diff(data.curr, data.next).forEach(function(label) {
          var selector = '.%s'.replace(/%s/, label),
              $node = $timer.find(selector);
          // Update the node
          $node.removeClass('flip');
          $node.find('.curr').text(data.curr[label]);
          $node.find('.next').text(data.next[label]);
          var correctEnding = getEndingForLabel(label, parseInt(data.next[label]));
          $node.find('.label').text(correctEnding);
          // Wait for a repaint to then flip
          _.delay(function($node) {
            $node.addClass('flip');
          }, 50, $node);
        });
      }
    });
  });
})(window, document, jQuery)

function getContrastingColor(hexcolor){
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
}

function getEndingForLabel(label, number) {
  var endings;
  if (label == 'weeks') {
    endings = ['неделя', 'недели', 'недель'];
  } else if (label == 'days') {
    endings = ['день', 'дня', 'дней'];
  } else if (label == 'hours') {
    endings = ['час', 'часа', 'часов'];
  } else if (label == 'minutes') {
    endings = ['минута', 'минуты', 'минут'];
  } else if (label == 'seconds') {
    endings = ['секунда', 'секунды', 'секунд'];
  }
  return getNumEnding(number, endings);
}

function getNumEnding(iNumber, aEndings) {
    var sEnding, i;
    iNumber = iNumber % 100;
    if (iNumber>=11 && iNumber<=19) {
        sEnding=aEndings[2];
    } else {
        i = iNumber % 10;
        switch (i) {
            case (1): sEnding = aEndings[0]; break;
            case (2):
            case (3):
            case (4): sEnding = aEndings[1]; break;
            default: sEnding = aEndings[2];
        }
    }
    return sEnding;
}
