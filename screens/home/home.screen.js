console.log('🏠 Home screen loaded');

document.getElementById('play-btn')?.addEventListener('click', () => {
  loadScreen('screens/game/game.html');
});