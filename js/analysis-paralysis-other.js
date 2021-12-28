function formatDateTime(date) {
  var utcDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), today.getUTCMilliseconds());
  var formattedDate = ('0' + (utcDate.getMonth()+1)).slice(-2) + '.' + ('0' + utcDate.getDate()).slice(-2);

  var hours = today.getHours();
  var minutes = today.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var formattedTime = hours + ':' + minutes  + ' ' + ampm;

  console.log(formattedTime);
  if (formattedTime == '12:00 am') {
    var formattedDateTime = formattedDate + ' / ' + formattedTime;
  }
  else {
    var formattedDateTime = formattedDate;
  }

  return formattedDateTime;
};

function deleteItemsFromArray(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
};

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

