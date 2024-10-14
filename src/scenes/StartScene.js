import gameState from "../state/GameState.js";

export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.windowMenu = [];
    }

    create() {
        this.addBackground();
        this.addLogo();
        this.addButtons();

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