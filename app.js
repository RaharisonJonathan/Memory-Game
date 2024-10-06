
let playMusic = true
let playSound = true
let levelTime = 1000
let unlocked = 1
let play = true

let currentLevelUnlocked = localStorage.getItem('currentLevel')

        if(currentLevelUnlocked){
            unlocked = currentLevelUnlocked
            console.log(currentLevelUnlocked)
        }
        else{
            localStorage.setItem("currentLevel", unlocked)
            currentLevelUnlocked = unlocked
        }


let music;
class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.windowMenu = [];
    }

    preload() {
        const assets = [
            // ['background', 'assets/Accueil/Accueil_background.svg'],
            ['background', 'Accueil_background.jfif'],
            ['Logo', 'assets/Accueil/Logo.png'],
            ['startButton', 'assets/Accueil/start_button.png'],
            ['settingButton', 'assets/Accueil/Setting_button.svg'],
            ['popupAccueil', 'assets/Accueil/Popup_accueil.png'],
            ['settingWindow', 'assets/Accueil/setting_window.png'],
            ['musicLabel', 'assets/Accueil/music_label.png'],
            ['soundLabel', 'assets/Accueil/sound_label.png'],
            ['okButton', 'assets/Accueil/ok_button.png'],
            ['cancelButton', 'assets/Accueil/cancel_button.png'],
            ['toggleOff', 'assets/Accueil/toggle_off.png'],
            ['toggleOn', 'assets/Accueil/toggle_on.png']
        ];
        
        assets.forEach(([key, path]) => this.load.image(key, path));
    }

    create() {
        
        this.addBackground();
        this.addLogo();
        this.addButtons();
        this.addPopup();
        this.addSettingsWindow();
        this.load.audio('music', 'assets/music1.mp3');
        this.load.start();

        this.load.on('complete', () => {
            music = this.sound.add('music', {loop : true, volume : 0.2});
            
            if(playMusic){
                music.play()
            }
        });

        this.tweens.add({
            targets: this.Logo,
            scale: 1.3, // La taille à atteindre (1.2 fois plus grand)
            ease: 'Sine.easeInOut', // Type d'animation pour l'effet pulsant
            duration: 800, // Durée de l'animation en ms
            yoyo: true, // Revenir à la taille initiale
            repeat: -1, // Répéter indéfiniment
        });

    
    }

    addBackground() {
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
            .setOrigin(0.5, 0.5)
            // .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    }

    addLogo() {
        this.Logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height * 3 / 10, 'Logo');
    }

    addButtons() {
        this.startButton = this.createButton('startButton', this.cameras.main.height * 5 / 7, this.startGame.bind(this)).setScale(0.9);
        // this.settingButton = this.createButton('settingButton', this.cameras.main.height * 4.8 / 7, this.showSettings.bind(this));
    }

    createButton(key, y, callback) {
        const button = this.add.image(this.cameras.main.width / 2, y, key).setInteractive();
        button.on('pointerdown', callback);
        return button;
    }

    addPopup() {
        this.popupAccueil = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'popupAccueil')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        .setInteractive();
        this.popupAccueil.scale = 0;
        this.windowMenu.push(this.popupAccueil)
        this.popupAccueil.on('pointerdown', this.hidePopup.bind(this));
    }

    addSettingsWindow() {
        this.settingWindow = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'settingWindow').setInteractive();
        this.settingWindow.scale = 0;
        this.windowMenu.push(this.settingWindow)
        this.addSettingsControls();
    }

    addSettingsControls() {
        const controls = [
            { key: 'soundLabel', x: this.cameras.main.width / 3, y: this.cameras.main.height / 2 - 50 },
            { key: 'musicLabel', x: this.cameras.main.width / 3 - 10, y: this.cameras.main.height / 2 },
            { key: 'toggleOn', x: this.cameras.main.width * 2 / 3 + 20, y: this.cameras.main.height / 2 - 50, toggle: true },
            { key: 'toggleOff', x: this.cameras.main.width * 2 / 3 + 20, y: this.cameras.main.height / 2, toggle: true },
            { key: 'cancelButton', x: this.cameras.main.width / 3, y: this.cameras.main.height / 2 + 100 },
            { key: 'okButton', x: this.cameras.main.width * 2 / 3, y: this.cameras.main.height / 2 + 100 }
        ];

        controls.forEach(({ key, x, y, toggle }) => {
            const image = this.add.image(x, y, key).setInteractive();
            image.scale = 0;
            this.windowMenu.push(image)
            if (toggle) {
                image.on('pointerdown', () => this.toggleImage(image));
            } else {
                image.on('pointerdown', this.hidePopup.bind(this));
            }
        });
    }

    toggleImage(image) {
        image.setTexture(image.texture.key === 'toggleOn' ? 'toggleOff' : 'toggleOn');
    }

    showSettings() {
        // if(playMusic){
        //     music.pause()
        //     playMusic = false
        // }
        // else{
        //     music.play()
        //     playMusic = true
        // }

        
        this.tweens.add({
            targets: this.settingButton ,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 100,
            onComplete: () => {
                this.tweens.add({
                    targets: this.settingButton,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.windowMenu,
                            scale: 1,
                            duration: 75
                        });
                    }
                });
            }
        });
    }

    hidePopup() {
        this.tweens.add({
            targets: this.windowMenu,
            scale: 0,
            duration: 75
        });
    }

    startGame() {
        this.tweens.add({
            targets: this.startButton,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 100,
            onComplete: () => {
                this.tweens.add({
                    targets: this.startButton,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    onComplete: () => {
                        this.cameras.main.fadeOut(500, 0, 0, 0);
                        this.scene.transition({
                            target: "TypesScene",
                            duration: 1000,
                            moveAbove: true,
                            onUpdate: (progress) => {
                                this.cameras.main.x = 800 * progress;
                            }
                        });
                    }
                });
            }
        });
    }
}



const gridConfig = {
    rows: 1,
    cols: 1,    
    cardWidth: 150,
    cardHeight: 150,
    spacingX: 5,
    spacingY: 5,
    scale : 1,
    level : 1,
};

const Data = [
    { key: 'lion' }, { key: 'éléphant' },
    { key: 'tigre' },
    { key: 'ours' }, { key: 'singe' },
    { key: 'zèbre' }, { key: 'panda' },
    { key: 'vache' }, { key: 'mouton' },
    { key: 'cheval' }, { key: 'cochon' },
    { key: 'poulet' },
    { key: 'chèvre' }, { key: 'lapin' },
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

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.pairsLeft = gridConfig.cols * gridConfig.rows/2;
        this.cards = [];
        this.firstCard = null;
        this.secondCard = null;
        this.canFlip = true;
        this.timeText = null; // Texte pour afficher le temps
        this.timerEvent = null; // Événement de minuterie
    }

    preload() {
        // this.load.audio('cardFlip', 'assets/retournement.mp3');
        this.load.image('game_background', 'Accueil_background.jfif');
        this.load.image('dos', 'assets/Game/back_card.png');
        this.load.image('music_off', 'assets/Game/music_off.png');
        this.load.image('music_on', 'assets/Game/music_on.png');
        this.load.image('Pause_button', 'assets/Game/Pause_button.png');
        this.load.image('sound_off', 'assets/Game/sound_off.png');
        this.load.image('sound_on', 'assets/Game/sound_on.png');
        this.load.image('Clock', 'assets/Game/Clock.png');
        this.load.image('Clock_progression_bar', 'assets/Game/Clock_progression_bar.png');
        this.load.image('pause_interface', 'assets/Game/pause_interface.png' )

        this.load.image('Home', 'assets/Game/Home.png' )
        this.load.image('réessayer_bouton', 'assets/Game/réessayer_bouton.png' )
        this.load.image('Replay_button', 'assets/Game/Replay_button.png' )

        this.load.audio('flip', 'assets/retournement.mp3');
        this.load.audio('correct', 'assets/correct.mp3');
        this.load.audio('start', 'assets/game-start.mp3');
        Data.forEach(data => this.load.image(data.key, `assets/Game/animals/${data.key}.png`));
    }
    
    create() {
        this.timeLeft = levelTime; // Temps initial en secondes
        
        // this.cardFlipSound = this.sound.add('cardFlip');
        
        this.load.start();
        
        // Jouer la musique de fond après avoir fini de la charger
        this.cardFlipSound = this.sound.add('flip');
        this.correct = this.sound.add('correct');
        this.start = this.sound.add('start');
        if(playSound){
            this.start.play()
        }
        
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'game_background')
        .setOrigin(0.5)
        // .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        this.createUI();
        this.cards = this.createCardsGrid();
        this.addCardEvents();
        
        
        // this.timeText = this.add.text(16, 16, `Time: ${this.timeLeft}`, {
        //     fontSize: '32px',
        //     fill: '#fff'
        // });

        // // Démarrer la minuterie pour mettre à jour le temps
        this.timerEvent = this.time.addEvent({
            delay: 1, // Mettre à jour toutes les secondes
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });
    }

    createUI() {
        this.home = this.add.image(this.cameras.main.width/4, this.cameras.main.height/2, "Home").setInteractive().setOrigin(0.5, 0).setDepth(100).setScale(0)

        this.replay = this.add.image(this.cameras.main.width*3/4, this.cameras.main.height/2, "Replay_button").setInteractive().setOrigin(0.5, 0).setDepth(100).setScale(0)

        this.reesayer = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, "réessayer_bouton").setInteractive().setOrigin(0.5, 0).setDepth(100).setScale(0)

        this.sound = this.add.image(this.cameras.main.width - 10, 10, "sound_on").setInteractive().setOrigin(1, 0)

        this.sound = this.add.image(this.cameras.main.width - 10, 10, "sound_on").setInteractive().setOrigin(1, 0)

        this.music = this.add.image(this.cameras.main.width - 70, 10, "music_on").setInteractive().setOrigin(1, 0)

        const pauseButton = this.add.image(10, 10, "Pause_button").setInteractive().setOrigin(0, 0);

        this.pauseInterface = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'pause_interface').setInteractive().setDepth(99).setScale(0)

        this.add.image(this.cameras.main.width/2, this.cameras.main.height/7, "Clock").setInteractive().setOrigin(0.5, 0.5);

        this.clock_progression = this.add.image(this.cameras.main.width/2 - 94, this.cameras.main.height/7, "Clock_progression_bar").setInteractive().setOrigin(0, 0.5);

        this.sound.on('pointerup', () => {
            if(playSound){
                this.sound.setTexture("sound_off")
                playSound = false
            }else{
                this.sound.setTexture("sound_on")
                playSound = true
            }
        });

        this.music.on('pointerup', () => {
            if(playMusic){
                this.music.setTexture("music_off")
                playMusic = false
                music.pause()
            }else{
                this.music.setTexture("music_on")
                music.play()
                playMusic = true
            }
        });

        pauseButton.on('pointerdown', () =>{
            play = !play
            this.tweens.add({
                targets: [this.pauseInterface, this.replay, this.reesayer, this.home],
                scale: 1,
                duration: 100
            });
        })
    }


    

    createCardsGrid() {
        let cards = this.generateCardPairs();
        Phaser.Utils.Array.Shuffle(cards);

        const cardObjects = [];
        let id = 0;

        for (let row = 0; row < gridConfig.rows; row++) {
            for (let col = 0; col < gridConfig.cols; col++) {
                const card = this.createCard(row, col, cards[id], id++);
                cardObjects.push(card);
            }
        }

        return cardObjects;
    }

    generateCardPairs() {
        const animalKeys = [
            'lion', 'éléphant', 'tigre', 'ours', 'singe', 'panda', 'vache', 'mouton',
            'cheval', 'cochon', 'poulet', 'chèvre', 'lapin', 'chien', 'chat', 'dauphin',
            'tortue', 'crabe', 'baleine', 'étoile', 'cerf', 'renard', 'loup', 'hibou',
            'écureuil', 'hérisson', 'castor', 'lynx', 'sanglier', 'kangourou', 'koala',
            'paresseux', 'ara'
        ];

        let pairs = [];
        animalKeys.forEach(key => pairs.push({ key }, { key }));
        return pairs.slice(0, gridConfig.rows * gridConfig.cols);
    }

    createCard(row, col, cardData, id) {
        const x = (this.cameras.main.width - ( gridConfig.cardWidth*gridConfig.scale*gridConfig.rows + gridConfig.spacingX*(gridConfig.rows-1)))/2 + row*(gridConfig.spacingX + gridConfig.cardWidth*gridConfig.scale) + gridConfig.cardWidth*gridConfig.scale/2;

        const y = (this.cameras.main.height - (gridConfig.cardHeight*gridConfig.scale*gridConfig.cols + gridConfig.spacingY*(gridConfig.cols-1)))/2 + col*(gridConfig.spacingY + gridConfig.cardHeight*gridConfig.scale) +gridConfig.cardHeight*gridConfig.scale/2 + 60 ;

        const card = this.add.image(x, y, "dos").setInteractive().setScale(0).setDepth(1).setOrigin(0.5);
        card.id = id;
        card.label = cardData.key;

        this.tweens.add({
            targets: card,
            scale: gridConfig.scale,
            duration: 500
        });

        return card;
    }

    addCardEvents() {
        this.cards.forEach(card => {
            card.on('pointerdown', () => this.flipCard(card, card.label));
        });
    }

    flipCard(card, cardChange) {
        if (!this.canFlip || card === this.firstCard || card === this.secondCard) return;

        if (!this.firstCard) {
            this.firstCard = card;
        } else {
            this.secondCard = card;
            this.canFlip = false;
            this.checkForMatch();
        }

        this.animateFlip(card, cardChange);
        
        if(playSound){
            this.cardFlipSound.play();
        }
    }

    animateFlip(card, cardChange) {
        this.tweens.add({
            targets: card,
            scaleX: 0,
            duration: 100,
            onComplete: () => {
                card.setTexture(cardChange);
                this.tweens.add({
                    targets: card,
                    scaleX: gridConfig.scale,
                    duration: 100
                });
            }
        });
    }

    checkForMatch() {
        if (this.firstCard && this.secondCard) {
            this.tweens.add({
                targets: [this.firstCard, this.secondCard],
                scale: gridConfig.scale,
                duration: 500,
                onComplete: () => this.handleMatch()
            });
        }
    }

    handleMatch() {
        if (this.firstCard.label === this.secondCard.label) {
            this.matchSuccess();
        } else {
            this.matchFail();
        }
    }

    matchSuccess() {
        // this.tweens.add({
        //     targets: [this.firstCard, this.secondCard],
        //     x: this.cameras.main.width / 2,
        //     y: this.cameras.main.height / 2,
        //     onStart: () => {
        //         this.firstCard.setDepth(10);
        //         this.secondCard.setDepth(10);
        //     },
        //     duration: 200,
        //     onComplete: () => {
            if(playSound){
                this.correct.play()
            }
            this.tweens.add({
                    targets: [this.firstCard, this.secondCard],
                    scale: 0,
                    duration: 200,
                    onComplete: () => {
                        this.firstCard.setVisible(false);
                        this.secondCard.setVisible(false);
                        this.cards = this.cards.filter(card => card !== this.firstCard && card !== this.secondCard);
                        this.firstCard = null;
                        this.secondCard = null;
                        this.canFlip = true;
                        this.pairsLeft--
                        this.checkForWin();
                    }
                });
        //     }
        // });
    }

    matchFail() {
        this.tweens.add({
            targets: [this.firstCard, this.secondCard],
            scaleX: 0,
            duration: 100,
            onStart : () =>{
                if(playSound){
                    this.cardFlipSound.play()
                }
            },
            onComplete: () => {
                this.firstCard.setTexture('dos');
                this.secondCard.setTexture('dos');
                this.tweens.add({
                    targets: [this.firstCard, this.secondCard],
                    scaleX: gridConfig.scale,
                    duration: 100,
                    onComplete: () => {
                        this.tweens.add({
                            targets: [this.firstCard, this.secondCard],
                            scale: gridConfig.scale,
                            duration: 200,
                            onComplete: () => {
                                this.firstCard = null;
                                this.secondCard = null;
                                this.canFlip = true;
                            }
                        });
                    }
                });
            }
        });
    }

    checkForWin() {
        
        if (this.cards.length === 0) {
        console.log(currentLevelUnlocked, gridConfig.level)
            if(currentLevelUnlocked == gridConfig.level){
                unlocked++;
                console.log(unlocked)
                localStorage.setItem("currentLevel", unlocked)
            }

            console.log("Gagner");
            // Optionally, start a win scene or display a win message
        }
    }

    update() {
        // Optionnel: Réinitialiser les cartes non sélectionnées
        if (!this.secondCard && !this.firstCard) {
            this.cards.forEach(card => card.setTexture('dos'));
        }

        // this.timeText.setText(`Time: ${this.timeLeft}`);

        this.clock_progression.scaleX = this.timeLeft/levelTime
        // // Vérifier si le temps est écoulé
        if (this.timeLeft <= 0) {
            this.endGame(); // Appeler la méthode de fin de jeu
        }
    }

    updateTime() {
       if(play){
        if (this.timeLeft > 0) {
            this.timeLeft -= 1/1000;
            this.cards.map((card) =>{
                card.setVisible(true)
            })
        }
       }
       else{
        this.cards.map((card) =>{
            card.setVisible(false)
        })
       }

    }

    endGame() {
        this.timerEvent.remove(); // Arrêter la minuterie
        console.log("Temps écoulé !"); // Afficher un message ou une scène de fin de jeu
        // Optionnel : Ajouter des effets ou transitions de fin de jeu ici
        // this.add.text(this.cameras.main.width/2, this.cameras.main.height/2, `Le temps est écoulé`, {
        //     fontSize: '30px',
        //     fill: '#fff'
        // }).setDepth(20).setOrigin(0.5, 0.5);

        this.cards.map((card) =>{
            card.setVisible(false)
        })
        
    }
    // Activation de la qualité de l'image
    
}


class TypesScene extends Phaser.Scene {
    
    constructor() {
        super({ key: 'TypesScene' });
        this.setScale = false; // Initialize the scaling direction
    }
    
    preload() {
        // Preload all assets
        //this.load.image('cochon', `assets/animals/cochon.png`);
        const assets = {
            // 'background_types': 'assets/Types.png',
            'background_types': 'Accueil_background',
            'Grid_entete': 'assets/entete.png',
            'return': 'assets/Next.png',
            'Type_entete': 'assets/Type.png',
            'game_background': 'Accueil_background.jfif',
            'Fruits': 'assets/Types/Fruits.png',
            'Animals': 'assets/Types/Animals.png',
            'Vegetables': 'assets/Types/Vegetables.png',
            'Home': 'assets/Home.png'
        };
        
        for (const [key, path] of Object.entries(assets)) {
            this.load.image(key, path);
        }
    }
    
    create() {
        // Set up background and UI elements
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'game_background')
        .setOrigin(0.5, 0.5)
        
        const graphics = this.add.graphics();
        graphics.fillStyle(0xd9d9d9, 0.25);
        graphics.fillRect(0, 0, this.cameras.main.width, 100);
        
        this.add.text(this.cameras.main.width / 2, 30, 'Categories', { 
            fontSize: '50px', 
            fill: '#FFA800', 
            fontStyle: 'bold', 
            fontFamily: 'Rubik'  // Ajoutez ici le font-family souhaité
        }).setOrigin(0.5, 0);
        
        
        this.retour = this.add.image(20, 30, 'return').setOrigin(0, 0).setInteractive();
        this.retour.scale = 0.8
        
        // this.retour = this.add.image(0,0, 'Type_entete').setOrigin(0, 0).setInteractive().setDisplaySize(this.cameras.main.width, 100);
        
        this.section_types = [
            { key: 'Fruits', x: this.cameras.main.width *1.5/6, y: 0.35 },
            { key: 'Animals', x: this.cameras.main.width*4.5/6, y: 0.35 },
            { key: 'Vegetables', x: this.cameras.main.width/2, y: 0.625 }
        ];
        
        this.section_types.forEach(section => {
            section.name = this.add.image(section.x, this.cameras.main.height * section.y, section.key).setInteractive();
            section.name.on('pointerdown', () => this.onSectionClick(section));
        });
        
        //this.add.image(this.cameras.main.width / 2, this.cameras.main.height /2, 'cochon').setOrigin(0.5, 0.5).setScale(2)

        this.retour.on('pointerdown', () => {
            this.scene.transition({
                target: 'StartScene',
                duration: 1000,
                moveAbove: true,
                moveBelow: false,
                onUpdate: (progress) => {
                    this.cameras.main.x = 800 * progress;
                }
            });
        });

        
        
        this.animation()
    }

    animation() {
        this.section_types.forEach(section => {
            // console.log(section)
            // this.tweens.add({
            //     targets: section.name,
            //     scale: 1.1, // La taille à atteindre (1.2 fois plus grand) // La taille à atteindre (1.2 fois plus grand)
            //     ease: 'Sine.easeInOut', // Type d'animation pour l'effet pulsant
            //     duration: 500, // Durée de l'animation en ms
            //     yoyo: true, // Revenir à la taille initiale
            //     repeat: -1, // Répéter indéfiniment
            // });
        });
    }
    
    
    onSectionClick(section) {
        this.tweens.add({
            targets: section.name,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 100,
            onComplete: () => {
                this.tweens.add({
                    targets: section.name,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    onComplete: () => {
                        this.scene.transition({
                            target: "LevelSelectScene",
                            duration: 1000,
                            moveAbove: true,
                            moveBelow: false,
                            onUpdate: (progress) => {
                                this.cameras.main.x = 800 * progress;
                            }
                        });
                    }
                });
            }
        });
    }
    
    update() {
        
    }
}


class GridScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GridScene' });
    }
    
    preload() {
        this.load.image('game_background', 'assets/Game_interface.png');
        this.load.image('grid_component', 'assets/Frame 48 (2).png');
        this.load.image('next_slide', 'assets/Next_slide.png');
        this.load.image('prev_slide', 'assets/Prev_slide.png');
        this.load.image('return', 'assets/return.png');
    }
    
    create() {
        // Liste des grilles
        const gridList = [
            { id: 0, row: 2, col: 2 },
            { id: 1, row: 2, col: 3 },
            { id: 2, row: 2, col: 4 },
            { id: 3, row: 2, col: 5 },
            { id: 4, row: 2, col: 6 },
            { id: 5, row: 2, col: 7 },
            { id: 6, row: 3, col: 4 },
            { id: 7, row: 3, col: 6 },
            { id: 8, row: 4, col: 4 },
            { id: 9, row: 4, col: 5 },
            { id: 10, row: 4, col: 6 },
            { id: 11, row: 4, col: 7 },
            { id: 12, row: 5, col: 6 },
        ];
        
        this.gridContainer = [[], [], [], []];
        this.arrowVisible = 0;
        
        // Ajouter les éléments de l'interface
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'game_background')
        .setOrigin(0.5, 0.5)
        // .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 0.5);
        graphics.fillRect(0, 0, this.cameras.main.width, 100);
        this.add.text(this.cameras.main.width / 2, 30, 'Grids', { 
            fontSize: '40px', 
            fill: '#FFE728', 
            fontStyle: 'bold', 
            fontFamily: 'Rubik'  // Ajoutez ici le font-family souhaité
        }).setOrigin(0.5, 0);
        this.return = this.add.image(20, 20, 'return').setOrigin(0, 0).setInteractive();
        
        this.nextSlide = this.add.image(this.cameras.main.width * 9 / 10, this.cameras.main.height / 2, 'next_slide').setInteractive();
        this.prevSlide = this.add.image(this.cameras.main.width * 1 / 10, this.cameras.main.height / 2, 'prev_slide').setInteractive();
        
        this.prevSlide.setDepth(10);
        this.nextSlide.setDepth(10);
        
        this.return.on('pointerdown', () => {
            this.scene.transition({
                target: 'TypesScene',
                duration: 1000,
                moveAbove: true,
                moveBelow: false,
                onUpdate: (progress) => {
                    this.cameras.main.x = 800 * progress;
                }
            });
        });
        
        // Créer les composants de grille
        gridList.forEach(grid => {
            const gridImage = this.add.image(
                this.cameras.main.width / 2 + this.cameras.main.width * Math.floor(grid.id / 3),
                this.cameras.main.height * 35 / 100 + 100 * (grid.id % 3),
                'grid_component'
                ).setInteractive();
                
                const gridText = this.add.text(
                    this.cameras.main.width / 2 + this.cameras.main.width * Math.floor(grid.id / 3),
                    this.cameras.main.height * 35 / 100 - 7 + 100 * (grid.id % 3) + 10,
                    `${grid.row} x ${grid.col}`,
                    { fontSize: '25px', fill: '#fff', fontStyle: 'bold' }
                    ).setOrigin(0.5, 0.5);
                    
                    gridImage.text = gridText;
                    this.gridContainer[Math.floor(grid.id / 5)].push(gridImage);
                    
                    // Ajouter les interactions pour les images de grille
                    gridImage.on('pointerdown', () => this.handleGridImageClick(grid, gridImage, gridText));
                });
                
                // Ajouter les interactions pour les flèches de navigation
                this.prevSlide.on('pointerdown', () => {
                    this.slideGrid(1);
                    this.arrowVisible--;
                });
                
                this.nextSlide.on('pointerdown', () => {
                    this.slideGrid(-1);
                    this.arrowVisible++;
                });
            }
            
            handleGridImageClick(grid, gridImage, gridText) {
                gridConfig.rows = grid.row;
                gridConfig.cols = grid.col;
                
                gridConfig.scale = Math.min(
                    (this.cameras.main.width - 20 - 10 * (grid.row - 1)) / (gridConfig.cardWidth * grid.row),
                    (this.cameras.main.height * 3 / 4 - 20 - 10 * (grid.col - 1)) / (gridConfig.cardWidth * grid.col)
                    );
                    
                    this.tweens.add({
                        targets: gridImage,
                        scaleX: 0.9,
                        scaleY: 0.9,
                        duration: 100,
                        onComplete: () => {
                            this.tweens.add({
                                targets: gridImage,
                                scaleX: 1,
                                scaleY: 1,
                                duration: 100,
                });
            }
        });
        
        this.tweens.add({
            targets: gridText,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 100,
            onComplete: () => {
                this.tweens.add({
                    targets: gridText,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    onComplete: () => {
                        this.scene.transition({
                            target: 'GameScene',
                            duration: 1000,
                            moveAbove: true,
                            moveBelow: false,
                            onUpdate: (progress) => {
                                this.cameras.main.x = 800 * progress;
                            }
                        });
                    }
                });
            }
        });
    }
    
    slideGrid(direction) {
        this.gridContainer.forEach(gridTable => {
            gridTable.forEach(gridLi => {
                this.tweens.add({
                    targets: [gridLi, gridLi.text],
                    x: gridLi.x + this.cameras.main.width * direction,
                    duration: 500,
                });
            });
        });
    }
    
    update() {
        this.prevSlide.setVisible(this.arrowVisible > 0);
        this.nextSlide.setVisible(this.arrowVisible < 3);
    }
}



const LevelList = [
    { "level": 1, "row": 2, "col": 2, "time": 10 },
    { "level": 2, "row": 2, "col": 3, "time": 18},
    { "level": 3, "row": 2, "col": 4, "time": 25 },
    { "level": 4, "row": 2, "col": 5, "time": 32 },
    { "level": 5, "row": 3, "col": 4, "time": 39 },
    { "level": 6, "row": 2, "col": 7, "time": 46 },
    { "level": 7, "row": 4, "col": 4, "time": 53 },
    { "level": 8, "row": 3, "col": 6, "time": 60 },
    { "level": 9, "row": 4, "col": 5, "time": 67 },
    { "level": 10, "row": 4, "col": 6, "time": 74 },
    { "level": 11, "row": 4, "col": 7, "time": 81 },
    { "level": 12, "row": 5, "col": 6, "time": 88 }
]

class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
        this.levels = [];
        this.selectedLevel = null;
    }
    
    preload() {
        // Charger les assets nécessaires
        this.load.image('level_background', 'Accueil_background.jfif');
        this.load.image('level_card', 'assets/Levels/Level.png');
        this.load.image('locked_level', 'assets/Levels/Lock.png');
        this.load.image('return', 'assets/Next.png');
    }
    
    create() {
        // Ajouter le fond d'écran de la scène de sélection des niveaux
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'level_background')
            .setOrigin(0.5)
            // .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Créer l'interface utilisateur pour sélectionner les niveaux
        this.createLevelGrid();
        // this.createBackButton();

        const graphics = this.add.graphics();
        graphics.fillStyle(0xd9d9d9, 0.25);
        graphics.fillRect(0, 0, this.cameras.main.width, 100);
        
        this.add.text(this.cameras.main.width / 2, 30, 'Levels', { 
            fontSize: '50px', 
            fill: '#FFA800', 
            fontStyle: 'bold', 
            fontFamily: 'Rubik'  // Ajoutez ici le font-family souhaité
        }).setOrigin(0.5, 0);
        
        
        this.retour = this.add.image(20, 30, 'return').setOrigin(0, 0).setInteractive();
        this.retour.scale = 0.8
    }

    createLevelGrid() {
        // Créer une grille de niveaux
        const rows = 4; // Nombre de rangées de niveaux
        const cols = 3; // Nombre de colonnes de niveaux
        const totalLevels = 12; // Total des niveaux affichés
        
        const cardWidth = 80;
        const cardHeight = 80;
        const spacingX = 20;
        const spacingY = 25;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const levelIndex = row * cols + col + 1;
        
                // Calculer la position x et y des cartes en tenant compte du nombre total de cartes et de l'espace entre elles
                const x = this.cameras.main.width / 2 - (cols * (cardWidth + spacingX)) / 2 + (cardWidth / 2) + col * (cardWidth + spacingX) + 20;
                const y = this.cameras.main.height / 2 - (rows * (cardHeight + spacingY)) / 2 + (cardHeight / 2) + row * (cardHeight + spacingY) + 30;
        
                // Créer la carte de niveau
                const levelCard = this.add.image(x, y, 'level_card').setInteractive();
                levelCard.levelIndex = levelIndex;
        
                // Verrouiller les niveaux si nécessaire
                if (levelIndex > this.unlockedLevels()) {
                    levelCard.setTexture('locked_level');
                } else {
                    // Ajouter le texte avec le numéro de niveau
                    this.add.text(x, y, `${levelIndex}`, { font: '50px Arial', color: '#ffffff' })
                        .setOrigin(0.5);
        
                    // Ajouter l'événement de clic sur les cartes de niveaux débloqués
                    levelCard.on('pointerdown', () => this.selectLevel(levelIndex));
                }
            }
        }
        
    }

    createBackButton() {
        // Créer un bouton pour retourner à la scène d'accueil
        const backButton = this.add.image(50, this.cameras.main.height - 50, 'back_button').setInteractive();
        
        backButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.transition({
                target: 'StartScene',
                duration: 500
            });
        });
    }

    unlockedLevels() {
        // Retourner le nombre de niveaux débloqués (logique simplifiée ici)
        return unlocked; // Exemple: 8 niveaux débloqués sur 16
    }

    selectLevel(levelIndex) {
        this.selectedLevel = levelIndex;

        gridConfig.rows = LevelList[levelIndex -1].row;
        gridConfig.cols = LevelList[levelIndex -1].col;
        gridConfig.level = LevelList[levelIndex -1].level;
        levelTime = LevelList[levelIndex -1].time

        gridConfig.scale = Math.min(
            (this.cameras.main.width - 20 - 10 * (LevelList[levelIndex -1].row - 1)) / (gridConfig.cardWidth * LevelList[levelIndex -1].row),
            (this.cameras.main.height * 6.5 / 8 - 20 - 10 * (LevelList[levelIndex -1].col - 1)) / (gridConfig.cardWidth * LevelList[levelIndex -1].col)
            );
        

        // Lancer la scène de jeu avec le niveau sélectionné
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.scene.transition({
            target: 'GameScene',
            duration: 500,
            moveAbove: true,
        });
    }

    update() {
        // Mettre à jour l'interface utilisateur si nécessaire
    }
}












// Déterminer les dimensions basées sur la taille de la fenêtre
const width = Math.min(window.innerWidth, 400); // Limiter la largeur à 400px si nécessaire
const height = Math.min(window.innerHeight, 800); // Limiter la hauteur à 750px si nécessaire

const config = {
    type: Phaser.AUTO,
    width: 400,  // Largeur fixe
    height: 800, // Hauteur fixe
    scale: {
        mode: Phaser.Scale.FIT,
    },
    audio: {
        disableWebAudio: false
    },
    scene: [StartScene, GameScene, TypesScene, GridScene, LevelSelectScene]
};
const game = new Phaser.Game(config);


