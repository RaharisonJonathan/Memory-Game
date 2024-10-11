import gameState from "../state/GameState.js";
import gridConfig from "../state/GridConfig.js";


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

export class GameScene extends Phaser.Scene {
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
        const basePath = '../../assets/images/Game/';
        
        // Charger les images communes
        const images = [
            { key: 'game_background', path: '../../Accueil_background.jfif' },
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
            { key: 'star_success', path: `${basePath}star_success.png` }
        ];
    
        // Charger toutes les images dans la boucle
        images.forEach(img => this.load.image(img.key, img.path));
    
        // Charger les images des animaux
        Data.forEach(data => this.load.image(data.key, `${basePath}animals/${data.key}.png`));
    }
    
    
    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.timeLeft = gameState.levelTime; // Temps initial en secondes

        // Ajouter l'image de fond, centrée
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'game_background')
            .setOrigin(0.5);

        // Vérifier si le son doit être joué
        if(gameState.playSound){
            gameState.start.play()
        }

        // Créer l'interface utilisateur et les cartes
        this.createUI();
        this.cards = this.createCardsGrid();
        this.addCardEvents();

        // Démarrer la minuterie pour mettre à jour le temps restant
        this.timerEvent = this.time.addEvent({
            delay: 1, // Mettre à jour toutes les secondes (1000 ms)
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });
    }


    createUI() {
        // Création des boutons principaux
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.home = this.createButton(centerX / 2, centerY, "Home", 0);
        this.replay = this.createButton(centerX * 3 / 2, centerY, "Replay_button", 0);
        this.reesayer = this.createButton(centerX, centerY, "réessayer_bouton", 0);

        // Création des boutons de son et musique
        this.sound = this.createIconButton(this.cameras.main.width/2 + 80, 10, "sound_on", () => this.toggleSound());
        this.music = this.createIconButton(this.cameras.main.width/2 + 140, 10, "music_on", () => this.toggleMusic());

        // Pause et autres interfaces
        this.pauseButton = this.createIconButton(10, 10, "Pause_button", () => this.PauseMenu());
        this.pauseInterface = this.createInterface(centerX, centerY, 'pause_interface', 99, 0);
        this.successInterface = this.createInterface(centerX, centerY, 'success_interface', 99, 0);
        this.failedInterface = this.createInterface(centerX, centerY, 'failed_interface', 99, 0);

        // Chronomètre et barre de progression
        this.clock = this.add.image(centerX, this.cameras.main.height / 7, "Clock").setOrigin(0.5, 0.5);
        this.clock_progression = this.add.image(centerX - 94, this.cameras.main.height / 7, "Clock_progression_bar").setInteractive().setOrigin(0, 0.5);

        // Création des étoiles
            const stars = [
                { x: centerX - 80, y: centerY - 80 },
                { x: centerX, y: centerY - 115 },
                { x: centerX + 80, y: centerY - 80 },
            ];
            
            stars.forEach((pos, index) => {
                this[`star${index + 1}`] = this.createStar(pos.x, pos.y, "star", 100);
                this[`star${index + 1}_success`] = this.createStar(pos.x, pos.y, "star_success", 101);
            });

        // Gestion des événements pour les boutons
        this.replay.on('pointerdown', () => this.Replaygame());
        this.reesayer.on('pointerdown', () => this.restartGame());
        this.home.on('pointerdown', () => this.goHome());

    }

    // Fonctions utilitaires
    createButton(x, y, texture, scale = 1) {
        return this.add.image(x, y, texture)
            .setInteractive()
            .setOrigin(0.5, 0)
            .setDepth(100)
            .setScale(scale);
    }

    createIconButton(x, y, texture, callback) {
        return this.add.image(x, y, texture)
            .setInteractive()
            .setOrigin(0, 0)
            .on('pointerdown', callback);
    }

    createInterface(x, y, texture, depth, scale = 1) {
        return this.add.image(x, y, texture)
            .setInteractive()
            .setDepth(depth)
            .setScale(scale);
    }

    createStar(x, y, texture, depth, scale = 0) {
        return this.add.image(x, y, texture)
            .setOrigin(0.5, 0.5)
            .setDepth(depth)
            .setScale(scale);
    }

    // Fonction pour la gestion du son
    toggleSound() { 
        gameState.playSound = !gameState.playSound;
        this.sound.setTexture(gameState.playSound ? "sound_on" : "sound_off");
    }

    // Fonction pour la gestion de la musique
    toggleMusic() {
        gameState.playMusic = !gameState.playMusic;
        this.music.setTexture(gameState.playMusic ? "music_on" : "music_off");
        gameState.playMusic ? gameState.music.play() : gameState.music.pause();
    }

    // Masquage du menu pause
    PauseMenu() {
        gameState.play = false;
        this.tweens.add({
            targets: [this.pauseInterface, this.replay, this.reesayer, this.home],
            scale: 1,
            duration: 100,
        });
    }



    // Continuer le jeu
    Replaygame() {
        gameState.play = true;
        this.tweens.add({
            targets: [this.pauseInterface, this.replay, this.reesayer, this.home],
            scale: 0,
            duration: 100
        });
    }

    // Redémarrer le jeu
    restartGame() {
        gameState.play = true;
        this.tweens.add({
            targets: [this.pauseInterface, this.replay, this.reesayer, this.home],
            scale: 0,
            duration: 100,
            onComplete: () => this.scene.restart(),
        });
    }

    // Retour à l'écran d'accueil
    goHome() {
        gameState.play = true;
        gameState.music.stop();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.scene.transition({
            target: "StartScene",
            duration: 1000,
            moveAbove: true,
            onUpdate: (progress) => {
                this.cameras.main.x = 800 * progress;
            },
        });
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
        const x = (this.cameras.main.width - (gridConfig.cardWidth * gridConfig.scale * gridConfig.rows + gridConfig.spacingX * (gridConfig.rows - 1))) / 2
            + row * (gridConfig.spacingX + gridConfig.cardWidth * gridConfig.scale) + gridConfig.cardWidth * gridConfig.scale / 2;
    
        const y = (this.cameras.main.height - (gridConfig.cardHeight * gridConfig.scale * gridConfig.cols + gridConfig.spacingY * (gridConfig.cols - 1))) / 2
            + col * (gridConfig.spacingY + gridConfig.cardHeight * gridConfig.scale) + gridConfig.cardHeight * gridConfig.scale / 2 + 60;
    
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
    
        if (gameState.playSound) {
            gameState.flip.play();
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
            if (this.firstCard.label === this.secondCard.label) {
                this.matchSuccess();
            } else {
                this.matchFail();
            }
        }
    }
    
    matchSuccess() {
        this.animateMatch(this.firstCard, this.secondCard, true);
    }
    
    matchFail() {
        this.animateMatch(this.firstCard, this.secondCard, false);
        if (gameState.playSound) {
            gameState.flip.play();
        }
    }
    
    animateMatch(firstCard, secondCard, isMatch) {
        const tweenConfig = {
            targets: [firstCard, secondCard],
            scale: gridConfig.scale,
            duration: 500,
            onComplete: () => {
                if (isMatch) {
                    if (gameState.playSound) {
                        gameState.correct.play();
                    }
                    this.tweens.add({
                        targets: [this.firstCard, this.secondCard],
                        scale: 0,
                        duration: 200,
                        onComplete: () => {
                            this.cards = this.cards.filter(card => card !== this.firstCard && card !== this.secondCard);
                            this.pairsLeft--
                            this.checkForWin();
                            this.resetCards();
                        }
                    });
                } else  {
                    this.tweens.add({
                        targets: [this.firstCard, this.secondCard],
                        scaleX: 0,
                        duration: 100,
                        onStart : () =>{
                            if(gameState.playSound){
                                gameState.flip.play()
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
                                        duration: 100,
                                        onComplete: () => {
                                            this.resetCards();      
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        };
        this.tweens.add(tweenConfig);
    }
    
    resetCards() {
        this.firstCard = null;
        this.secondCard = null;
        this.canFlip = true;
    }
    
    checkForWin() {
        if (this.cards.length === 0) {
            this.resetCards()
            gameState.starNote = this.timeLeft / gameState.levelTime
            this.timerEvent.remove(); // Arrêter la minuterie
    
            // Animation de succès
            // this.animateSuccessUI();
            gameState.passed = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.transition({
                target: "ResultScene",
                duration: 500,
                // moveAbove: true,
            });
    
            let currentLevelUnlocked = localStorage.getItem('currentLevel');
            if (currentLevelUnlocked == gridConfig.level) {
                localStorage.setItem("currentLevel", ++currentLevelUnlocked);
            }
    
            console.log("Gagner");
        }
    }
    
    animateSuccessUI() {
        this.tweens.add({
            targets: [this.pauseInterface, this.replay, this.reesayer, this.home, this.pauseButton, this.clock_progression, this.music, this.sound, this.clock],
            scale: 0,
            duration: 10,
            onComplete: () => {
                this.tweens.add({
                    targets: [this.successInterface, this.star1, this.star2, this.star3],
                    scale: 1,
                    duration: 100,
                    onComplete: () => {
                        this.animateStarsSuccess();
                    }
                });
            }
        });
    }
    
    animateStarsSuccess() {
        const starTweens = [
            { target: this.star1_success, delay: 0 },
            { target: this.star2_success, delay: 400 },
            { target: this.star3_success, delay: 800 }
        ];
    
        starTweens.forEach(({ target, delay }) => {
            this.tweens.add({
                targets: target,
                scale: 1,
                duration: 400,
                delay
            });
        });
    }
    

    update() {
        // Réinitialisation des cartes visibles après une mauvaise correspondance
        if (!this.firstCard && !this.secondCard) {
            this.cards.forEach(card => card.setTexture('dos'));
        }
    
        // Mettre à jour la barre de progression du temps
        this.clock_progression.scaleX = this.timeLeft / gameState.levelTime;
    
        // Si le temps est écoulé, terminer le jeu
        if (this.timeLeft <= 0) {
            this.endGame(); // Appeler la méthode de fin de jeu
        }
    }
    
    updateTime() {
        if (gameState.play && this.timeLeft > 0) {
            this.timeLeft -= 1 / 1000;
    
            // Rendre les cartes visibles si le jeu est en cours
            // this.cards.forEach(card => card.setVisible(true));
        } else {
            // Optionnel: gestion lorsque le jeu est en pause
            // this.cards.forEach(card => card.setVisible(false));
        }
    }
    
    endGame() {
        // Arrêter la minuterie
        this.timerEvent.remove();
        this.resetCards()
        gameState.passed = false
        this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.transition({
                target: "ResultScene",
                duration: 500,
                // moveAbove: true,
            });
        console.log("Temps écoulé !");
    
        // Masquer toutes les cartes
    //     this.cards.forEach(card => card.setVisible(false));
    
    //     // Tweens pour masquer les éléments de l'interface et afficher l'écran de fin
    //     this.tweens.add({
    //         targets: [this.pauseInterface, this.replay, this.reesayer, this.home, this.pauseButton, this.clock_progression, this.music, this.sound, this.clock],
    //         scale: 0,
    //         duration: 100, // Temps raisonnable pour l'animation
    //         onComplete: () => {
    //             // Afficher l'interface de fin
    //             this.tweens.add({
    //                 targets: [this.failedInterface, this.star1, this.star2, this.star3],
    //                 scale: 1,
    //                 duration: 200
    //             });
    //         }
    //     });
     }    
    
}


export default GameScene;
