import gameState from "../state/GameState.js";

export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.windowMenu = [];
    }

    preload() {
        const assets = [
            ['background', '../../assets/images/Accueil_background.jfif'],
            ['Logo', '../../assets/images/Accueil/Logo.png'],
            ['startButton', '../../assets/images/Accueil/start_button.png'],
        ];

        assets.forEach(([key, path]) => this.load.image(key, path));

        // Audio files
        this.load.audio('music', '../../assets/audio/music.mp3');
        this.load.audio('flip', '../../assets/audio/retournement.mp3');
        this.load.audio('correct', '../../assets/audio/correct.mp3');
        this.load.audio('start', '../../assets/audio/game-start.mp3');
        this.load.audio('success', '../../assets/audio/success.mp3');
        this.load.audio('fail', '../../assets/audio/fail.mp3');
    }

    create() {
        this.addBackground();
        this.addLogo();
        this.addButtons();
        this.addPopup();
        this.addSettingsWindow();

        // Add sounds
        gameState.music = this.sound.add('music', { loop: true, volume: 0.2 });
        gameState.flip = this.sound.add('flip', { volume: 0.5 });
        gameState.correct = this.sound.add('correct', { volume: 0.5 });
        gameState.start = this.sound.add('start', { volume: 0.5 });
        gameState.success = this.sound.add('success', { volume: 1 });
        gameState.fail = this.sound.add('fail', { volume: 1 });

        if (gameState.playMusic) gameState.music.play();

        // Animate logo
        this.tweens.add({
            targets: this.Logo,
            scale: 1.3,
            ease: 'Sine.easeInOut',
            duration: 800,
            yoyo: true,
            repeat: -1,
        });
    }

    addBackground() {
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background').setOrigin(0.5);
    }

    addLogo() {
        this.Logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height * 0.3, 'Logo');
    }

    addButtons() {
        this.createButton('startButton', this.cameras.main.height * 5 / 7, this.startGame.bind(this)).setScale(0.9);
    }

    createButton(key, y, callback) {
        const button = this.add.image(this.cameras.main.width / 2, y, key).setInteractive();
        button.on('pointerdown', callback);
        return button;
    }

    addPopup() {
        this.popupAccueil = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'popupAccueil')
            .setOrigin(0.5)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
            .setInteractive()
            .setScale(0);

        this.windowMenu.push(this.popupAccueil);
        this.popupAccueil.on('pointerdown', this.hidePopup.bind(this));
    }

    addSettingsWindow() {
        this.settingWindow = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'settingWindow')
            .setInteractive()
            .setScale(0);

        this.windowMenu.push(this.settingWindow);
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
            const image = this.add.image(x, y, key).setInteractive().setScale(0);
            this.windowMenu.push(image);
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
        this.animateButton(this.settingButton, () => {
            this.tweens.add({ targets: this.windowMenu, scale: 1, duration: 75 });
        });
    }

    hidePopup() {
        this.tweens.add({ targets: this.windowMenu, scale: 0, duration: 75 });
    }

    startGame() {
        this.animateButton(this.startButton, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.transition({
                target: "LevelSelectScene",
                duration: 1000,
                moveAbove: true,
            });
        });
    }

    animateButton(button, onComplete) {
        this.tweens.add({
            targets: button,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 100,
            onComplete: () => {
                this.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    onComplete
                });
            }
        });
    }
}


export default StartScene;