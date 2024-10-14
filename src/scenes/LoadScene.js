
//La liste des cartes utilisées
const Data = [
    { key: 'lion' }, { key: 'éléphant' },
    { key: 'tigre' },
    { key: 'ours' }, { key: 'singe' },
    { key: 'zèbre' }, { key: 'panda' },
    { key: 'vache' }, { key: 'mouton' },
    { key: 'cheval' }, { key: 'cochon' },
    { key: 'poulet' },, { key: 'lapin' },
    { key: 'chien' }, { key: 'chat' },
    { key: 'dauphin' }, { key: 'tortue' },
    { key: 'crabe' },
    { key: 'baleine' }, { key: 'étoile' },
    { key: 'cerf' }, { key: 'renard' },
    { key: 'loup' }, { key: 'hibou' },
    { key: 'écureuil' }, { key: 'hérisson' },
    { key: 'castor' }, { key: 'lynx' },
    { key: 'sanglier' },
    { key: 'kangourou' }, { key: 'koala' },
    { key: 'paresseux' }, { key: 'ara' }
]

export class LoadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'LoadScene' });
    }
  
    preload() {
      // Affichage de l'interface de chargement
      this.createInitialView()


      // Commencer à charger les autres éléments (images, sons, etc.)
      const assets = [
        ['Logo', '../../assets/images/Accueil/Logo.png'],
        ['startButton', '../../assets/images/Accueil/start_button.png'],
      ];
  
      assets.forEach(([key, path]) => this.load.image(key, path));
  
      // Charger les sons
      this.load.audio('music', '../../assets/audio/music.mp3');
      this.load.audio('flip', '../../assets/audio/retournement.mp3');
      this.load.audio('correct', '../../assets/audio/correct.mp3');
      this.load.audio('start', '../../assets/audio/game-start.mp3');
      this.load.audio('success', '../../assets/audio/success.mp3');
      this.load.audio('fail', '../../assets/audio/fail.mp3');
  
      const basePath = '../../assets/images/Game/';
      const images = [
        { key: 'dos', path: `${basePath}back_card.png` },
        { key: 'music_off', path: `${basePath}music_off.png` },
        { key: 'music_on', path: `${basePath}music_on.png` },
        { key: 'Pause_button', path: `${basePath}Pause_button.png` },
        { key: 'sound_off', path: `${basePath}sound_off.png` },
        { key: 'sound_on', path: `${basePath}sound_on.png` },
        { key: 'Clock', path: `${basePath}Clock.png` },
        { key: 'Clock_progression_bar', path: `${basePath}Clock_progression_bar.png` },
        { key: 'pause_interface', path: `${basePath}pause_interface.png` },
        { key: 'Home', path: `${basePath}Home.png` },
        { key: 'réessayer_bouton', path: `${basePath}réessayer_bouton.png` },
        { key: 'Replay_button', path: `${basePath}Replay_button.png` },
        { key: 'success_interface', path: `${basePath}success_interface.png` },
        { key: 'failed_interface', path: `${basePath}failed_interface.png` },
        { key: 'star', path: `${basePath}star.png` },
        { key: 'star', path: `${basePath}star.png` },
        { key: 'Next_level', path: `${basePath}Next_level.png` },
        { key: 'star_success', path: `${basePath}star_success.png` }
      ];
  
      images.forEach(img => this.load.image(img.key, img.path));

      
      Data.forEach(data => this.load.image(data.key, `${basePath}animals/${data.key}.png`));

      this.load.image('level_card', '../../assets/images/Levels/Level.png');
        this.load.image('locked_level', '../../assets/images/Levels/Lock.png');
        this.load.image('return', '../../assets/images/Next.png');
        this.load.image('starBar', '../../assets/images/Levels/StarBar.png');
        this.load.image('starLevel', '../../assets/images/Levels/starLevel.png');
        this.load.image('Reset', '../../assets/images/Levels/Reset.png');
  
      //progression de la barre de chargement pendant le chargement 
      this.load.on('progress', (percent) => {
        this.barProgress.scaleX = percent;
      });
  
      this.load.on('complete', () => {
        // Une fois le chargement terminé, passer à la StartScene
        this.scene.start('StartScene');
      });
    }
  
    createInitialView() {
      this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background').setOrigin(0.5);
      this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 , 'preloading').setOrigin(0.5);
      this.barProgress = this.add.image(this.cameras.main.width / 4 - 47, this.cameras.main.height *3/ 4 - 39 , 'bar_progress').setOrigin(0, 0.5);
      this.barProgress.scaleX = 0;
    }
  }
  