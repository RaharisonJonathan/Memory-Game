import gameState from "../state/GameState.js";
import gridConfig from "../state/GridConfig.js";
import LevelList from "../state/LevelList.js";

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
        this.levels = [];
        this.selectedLevel = null;
    }
    
    preload() {
        // Charger les assets nécessaires
        this.load.image('level_background', '../../Accueil_background.jfif');
        this.load.image('level_card', '../../assets/images/Levels/Level.png');
        this.load.image('locked_level', '../../assets/images/Levels/Lock.png');
        this.load.image('return', '../../assets/images/Next.png');
        this.load.image('starBar', '../../assets/images/Levels/starBar.png');
        this.load.image('starLevel', '../../assets/images/Levels/starLevel.png');
    }
    
    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Ajouter le fond d'écran de la scène de sélection des niveaux
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'level_background')
            .setOrigin(0.5)

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
        
        
        this.retour = this.add.image(20, 30, 'return').setOrigin(0, 0).setInteractive()
        this.retour.scale = 0.8

        this.retour.on('pointerdown', () =>{
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.transition({
                target: "StartScene",
                duration: 500,
                moveAbove: true,
            });
        })
    }

    createLevelGrid() {
        // Créer une grille de niveaux
        const rows = 4; // Nombre de rangées de niveaux
        const cols = 3; // Nombre de colonnes de niveaux
        
        const cardWidth = 80;
        const cardHeight = 80;
        const spacingX = 30;
        const spacingY = 40;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const levelIndex = row * cols + col + 1;
        
                // Calculer la position x et y des cartes en tenant compte du nombre total de cartes et de l'espace entre elles
                const x = this.cameras.main.width / 2 - (cols * (cardWidth + spacingX)) / 2 + (cardWidth / 2) + col * (cardWidth + spacingX) + 20;
                const y = this.cameras.main.height / 2 - (rows * (cardHeight + spacingY)) / 2 + (cardHeight / 2) + row * (cardHeight + spacingY) + 30;
        
                // Créer la carte de niveau
                const levelCard = this.add.image(x, y, 'level_card').setInteractive();
                levelCard.levelIndex = levelIndex;

                const stars = [
                    { x: x - 28, y: y + 40 },
                    { x: x, y: y + 40 },
                    { x: x + 28, y: y + 40 },
                ];
                
                
        
                // Verrouiller les niveaux si nécessaire
                if (levelIndex > this.unlockedLevels()) {
                    levelCard.setTexture('locked_level');
                    
                } else {
                    // Ajouter le texte avec le numéro de niveau
                    this.add.text(x, y, `${levelIndex}`, { font: '50px Arial', color: '#ffffff' })
                        .setOrigin(0.5);

                        // stars.forEach((pos, index) => {
                        //     this[`star${index + 1}`] = this.createStar(pos.x, pos.y, "star", 100);
                        //     this[`star${index + 1}_success`] = this.createStar(pos.x, pos.y, "star_success", 101,0);
                        // });

                        this.add.image(x, y + 40, "starBar")

        
                        stars.slice(0,LevelList[levelIndex - 1].star).forEach((pos, index) => {
                            this[`star${index + 1}_success`] = this.createStar(pos.x, pos.y, "starLevel", 101);
                        });
        
                    // Ajouter l'événement de clic sur les cartes de niveaux débloqués
                    levelCard.on('pointerdown', () => this.selectLevel(levelIndex));
                }
            }
        }
        
    }

    createStar(x, y, texture, depth) {
        return this.add.image(x, y, texture)
            .setOrigin(0.5, 0.5)
            .setDepth(depth)
            // .setScale(scale);
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
        let unlockLevels = localStorage.getItem('currentLevel')
        // Retourner le nombre de niveaux débloqués (logique simplifiée ici)
        return unlockLevels; // Exemple: 8 niveaux débloqués sur 16
    }

    selectLevel(levelIndex) {
        gameState.LevelActually = levelIndex - 1

        gridConfig.rows = LevelList[gameState.LevelActually].row;
        gridConfig.cols = LevelList[gameState.LevelActually].col;
        gridConfig.level = LevelList[gameState.LevelActually].level;
        gameState.levelTime = LevelList[gameState.LevelActually].time

        gridConfig.scale = Math.min(
            (this.cameras.main.width - 20 - 10 * (LevelList[gameState.LevelActually].row - 1)) / (gridConfig.cardWidth * LevelList[gameState.LevelActually].row),
            (this.cameras.main.height * 6.5 / 8 - 20 - 10 * (LevelList[gameState.LevelActually].col - 1)) / (gridConfig.cardWidth * LevelList[gameState.LevelActually].col)
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

export default LevelSelectScene;
