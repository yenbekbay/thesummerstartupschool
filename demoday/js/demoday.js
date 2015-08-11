;(function(window, document, $){
  $(document).ready(function(){
    $('.app-image img').on('ab-color-found', function(e, data){
      var color = data.color;
      if (color == "rgb()") {
        color = "rgb(204,204,204)";
      }
      $(this).parents('.app-info').css({ background: color });
      var contrastingColor = getContrastingColor(color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/));
      $(this).parents('.app-info').find('.app-image .app-store-link').css({ color: contrastingColor });
      $(this).parents('.app-info').find('.app-description h1').css({ color: contrastingColor });
      $(this).parents('.app-info').find('.app-description p').css({ color: contrastingColor });
      $(this).parents('.app-info').find('.app-description a').css({ color: contrastingColor });
    });
    $.adaptiveBackground.run();

    $('.app-grid').masonry({
      itemSelector: '.app-card',
      layoutMode: 'fitRows'
    });

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
    $timer.countdown('2015/08/04 10:00:00', function(event) {
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

function getContrastingColor(rgb) {
  var yiq = ((rgb[1]*299)+(rgb[2]*587)+(rgb[3]*114))/1000;
	return (yiq >= 160) ? 'black' : 'white';
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
