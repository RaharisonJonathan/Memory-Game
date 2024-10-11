const gameState = {
    playMusic: true,
    playSound: true,
    levelTime: 1000,
    starNote: 0,
    unlocked: 1,
    play: true,
    passed: true,
    currentLevelUnlocked: localStorage.getItem('currentLevel') || 1,
    LevelActually: null, // Sera défini lors de la sélection du niveau
    music: null,
    flip: null,
    correct: null,
    start: null
};

// Sauvegarder le niveau actuel dans le localStorage au début
localStorage.setItem('currentLevel', gameState.currentLevelUnlocked);



export default gameState;
