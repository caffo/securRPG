var game = {
  monsters: ['mummy', 'revenant', 'ghost', 'skeleton', 'spectre', 'zombie', 'wraith', 'lich', 'necrolord', 'necrogod'],

  init: function(){
    if (!store.enabled) {
          alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
          return
    }

    character.init();

    $("#seed").val((""+Math.random()).substring(2,8));

    $('#submit').on('click', function() {
      var seed = $('#seed').val();
      if (seed == '') { return false }
      else { game.processTurn(seed) }
    });

    $('#new_game').on('click', function(){
      character.new();
    });

    console.log('Game initialized');
  },

  processTurn: function(seed){
    var log = [];

    if (character.isDead()){
      log.push('Player is dead. Please start a new game.');
      game.printTurn(log);
      return;
    }

    var seed = seed.split('');
    var data = {
                 mob:         parseInt(seed[0]),
                 mob_attack:  parseInt(seed[1]),
                 hero_attack: parseInt(seed[2]),
                 damage:      parseInt(seed[3]),
                 coins:       parseInt(seed[4])
               };

    // define monster
    log.push('A ' + game.monsters[data.mob] + ' appears!');

    // attack!
    if (data.hero_attack > data.mob_attack) {
      log.push('Player hits the ' + game.monsters[data.mob] + ' causing ' + data.damage +' damage points.');
      log.push(game.monsters[data.mob].capitalize() + ' dies.');

      // calculate XP
      xp = (data.hero_attack - data.mob_attack) * 2;
      character.update('xp', xp, '+');
      log.push('Earned ' + xp + ' experience points.');

      // loot
      character.update('coins', data.coins, '+');
      log.push('Looted ' + data.coins + ' coins.');
    }
    else {
      // if damage is zero, deal one point of damage
      if (data.damage == 0) { data.damage = 1; };

      log.push('The ' + game.monsters[data.mob] + ' hits the player, hiding in the darkness after it.')
      log.push(data.damage + ' points of damage taken.');

      character.update('hp', data.damage, '-');

      if (character.isDead()) { log.push('Game over.') };
    }
    // print output
    game.printTurn(log);
    $('document').focus();
  },

  printTurn: function(log){
    $('#turn_log').html(log.join('<br/>'));
    $('#turn_log').show();
    $("#seed").val((""+Math.random()).substring(2,8));
  }
}

var character = {
  init: function(){
    if (store.get('character') === undefined) {
      character.new();
    } else {
      console.log('character loaded');
      character.stats = store.get('character');
      character.updateDisplay();
    }
  },

  update: function(stat, number, operation){
    if (operation == '+')      { character.stats[stat] += number }
    else if (operation == '-') { character.stats[stat] = character.stats[stat] - number };

    $('#'+stat).text(character.stats[stat]);

    store.set('character', character.stats);
  },

  new: function(){
    character.stats = store.set('character', { hp: 50, lv: 1, coins:0, xp: 0, to_level: 100 });
    character.updateDisplay();
    $('#turn_log').hide();
  },

  updateDisplay: function(){
    $('#hp').text(character.stats.hp)
    $('#lv').text(character.stats.lv)
    $('#coins').text(character.stats.coins)
    $('#xp').text(character.stats.xp)
    $('#to_level').text(character.stats.to_level)
  },

  isDead: function(){
    return (character.stats.hp < 0);
  }
}