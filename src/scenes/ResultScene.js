import gameState from "../state/GameState.js";
import gridConfig from "../state/GridConfig.js";
import LevelList from "../state/LevelList.js";


class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
        
    }
    
    preload() {
        const basePath = '../../assets/images/Game/';
        
        // Charger les images communes
        const images = [
            { key: 'Home', path: `${basePath}Home.png` },
            { key: 'réessayer_bouton', path: `${basePath}réessayer_bouton.png` },
            { key: 'game_background', path: '../../Accueil_background.jfif' },
            { key: 'success_interface', path: `${basePath}success_interface.png` },
            { key: 'failed_interface', path: `${basePath}failed_interface.png` },
            { key: 'star', path: `${basePath}star.png` },
            { key: 'star_success', path: `${basePath}star_success.png` },
            { key: 'Next_level', path: `${basePath}Next_level.png` }
        ];
        
        // Charger toutes les images dans la boucle
        images.forEach(img => this.load.image(img.key, img.path));
        
    }
    
    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'game_background').setOrigin(0.5);


        const centerX = this.cameras.main.width/2
        const centerY = this.cameras.main.height/2

        this.home = this.add.image(this.cameras.main.width / 4, this.cameras.main.height / 2 + 100, 'Home').setDepth(105).setInteractive()
        this.reesayer = this.add.image(this.cameras.main.width *3/ 4, this.cameras.main.height / 2 + 100, 'réessayer_bouton').setDepth(105).setScale(0).setInteractive()
        this.NextLevel = this.add.image(this.cameras.main.width *3/ 4, this.cameras.main.height / 2 + 100, 'Next_level').setDepth(105).setScale(0).setInteractive()

        this.successInterface = this.createInterface(centerX, centerY, 'success_interface', 99, 0);
        this.failedInterface = this.createInterface(centerX, centerY, 'failed_interface', 99, 0);

        const stars = [
            { x: centerX - 80, y: centerY - 80 },
            { x: centerX, y: centerY - 115 },
            { x: centerX + 80, y: centerY - 80 },
        ];
        
        stars.forEach((pos, index) => {
            this[`star${index + 1}`] = this.createStar(pos.x, pos.y, "star", 100);
            this[`star${index + 1}_success`] = this.createStar(pos.x, pos.y, "star_success", 101);
        });

        if(gameState.passed){
            this.interface = this.successInterface.setScale(1)
            this.NextLevel.setScale(1)
            this.animateSuccessUI()
        }else{
            this.interface = this.failedInterface.setScale(0)
            this.reesayer.setScale(1)
            this.animateSuccessUI()
        }


        this.home.on('pointerdown', () =>{
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.transition({
                target: "StartScene",
                duration: 500,
                moveAbove: true,
            });
        })

        this.reesayer.on('pointerdown', () =>{
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.transition({
                target: 'GameScene',
                duration: 500,
                moveAbove: true,
            });
        })

        this.NextLevel.on('pointerdown', () =>{
            gameState.LevelActually
            gridConfig.rows = LevelList[gameState.LevelActually].row;
            gridConfig.cols = LevelList[gameState.LevelActually].col;
            gridConfig.level = LevelList[gameState.LevelActually].level;
            gameState.levelTime = LevelList[gameState.LevelActually].time

            gridConfig.scale = Math.min(
                (this.cameras.main.width - 20 - 10 * (LevelList[gameState.LevelActually].row - 1)) / (gridConfig.cardWidth * LevelList[gameState.LevelActually].row),
                (this.cameras.main.height * 6.5 / 8 - 20 - 10 * (LevelList[gameState.LevelActually].col - 1)) / (gridConfig.cardWidth * LevelList[gameState.LevelActually].col)
                );
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.transition({
                target: 'GameScene',
                duration: 500,
                moveAbove: true,
            });
        })

    }


    createStar(x, y, texture, depth, scale = 0) {
        return this.add.image(x, y, texture)
            .setOrigin(0.5, 0.5)
            .setDepth(depth)
            .setScale(scale);
    }

    createInterface(x, y, texture, depth, scale = 1) {
        return this.add.image(x, y, texture)
            .setInteractive()
            .setDepth(depth)
            .setScale(scale);
    }

    animateSuccessUI() {
                this.tweens.add({
                    targets: [this.interface, this.star1, this.star2, this.star3],
                    scale: 1,
                    duration: 100,
                    onComplete: () => {
                        if(gameState.passed){
                            this.animateStarsSuccess();
                        }
                    }
                });
    }
    
    animateStarsSuccess() {
        let starTweens = [
            { target: this.star1_success, delay: 300 },
            { target: this.star2_success, delay: 800 },
            { target: this.star3_success, delay: 1300 }
        ];

        if(gameState.starNote < 0.15) {
            starTweens = starTweens.slice(0,1)
            localStorage.setItem(`level${++gameState.LevelActually}`, 1);
            LevelList[gameState.LevelActually - 1].star = 1
        }else if(gameState.starNote < 0.40){
            starTweens = starTweens.slice(0,2)
            localStorage.setItem(`level${++gameState.LevelActually}`, 2);
            LevelList[gameState.LevelActually - 1].star = 2
        }else{
            localStorage.setItem(`level${++gameState.LevelActually}`, 3);
            LevelList[gameState.LevelActually - 1].star = 3
        }

        console.log(LevelList)
         
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
        // Mettre à jour l'interface utilisateur si nécessaire
    }
}

export default ResultScene;

