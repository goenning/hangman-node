var id;

function doPost(url, data, cb) {
  $.post(url, data, function(data) {

    if (data.success)
      cb(data);
    else
      showError(data.error);

  }, 'json').fail(function() {
    showError('Something went wrong, maybe the server is down.');
  });
}

function clickStartNewGame() {
  var newGameWord = $('#new-game-word');
  var word = newGameWord.val();
  newGameWord.val('');

  doPost('/game/new', { id: id, word: word }, function(data) {
    $('#puzzle, #letters, #remaining').removeClass('hidden');

    id = data.id;
    showStatus(data);
    $('#letters button').addClass('btn-info').removeClass('btn-disabled').removeAttr('disabled');
  });
}

function clickLetter(letter) {
  var button = $(this);

  doPost('/game/guess', { id: id, letter: button.data('letter') }, function(data) {
    showStatus(data);
    button.addClass('btn-disabled').removeClass('btn-info').attr('disabled', 'disabled');
  });
}

function showError(error) {
  $('#error').removeClass('hidden');
  $('#error span').html(error);
}

function showStatus(data) {
  $('#won, #failure, #error').addClass('hidden');

  if (data.status === 1) {
    $('#puzzle span').html(data.letters.join(' '));
    $('#remaining span').html(data.remainingMissesCount === 1 ? 'You have only one more chance.' : 'You can only miss ' + data.remainingMissesCount + ' times.');
    return;
  }

  if (data.status === 2) {
    $('#puzzle, #letters, #remaining').addClass('hidden');
    $('#won').removeClass('hidden');
    $('#won .word').html(data.word);
    return;
  }

  if (data.status === 3) {
    $('#puzzle, #letters, #remaining').addClass('hidden');
    $('#failure').removeClass('hidden');
    $('#failure .word').html(data.word);
    return;
  }
}

$(function() {
  $('#btn-start-game').click(clickStartNewGame);
  $('#letters button').click(clickLetter);
});
