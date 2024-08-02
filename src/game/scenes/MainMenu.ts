import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    
    constructor () {
        super('MainMenu');
    }

    public create(): void {
        this.background = this.add.image(512, 384, 'background');
        
        let { width, height } = this.sys.game.canvas;
        this.logo = this.add.image(width, height/2, 'logo').setDepth(100);
        
        this.title = this.add.text(512, 460, 'teste123', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
    
    public changeScene(): void {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
        this.scene.start('GameOver');
    }
    
    public moveLogo (callback: ({ x, y }: { x: number, y: number }) => void): void {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 0, duration: 1000, ease: 'Sine.InOut'},
                y: { value: 0, duration: 750, ease: 'Quintic.InOut'},
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (callback)
                    {
                        callback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }

}
