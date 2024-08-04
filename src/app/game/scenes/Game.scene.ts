export class GameScene extends Phaser.Scene {

    public limit: Phaser.GameObjects.Rectangle;
    public notes: Phaser.Physics.Arcade.Group;
    public readonly noteSprite: string = "note";

    constructor() {
        super({key: 'game'});
    }

    preload() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.notes = this.physics.add.group();
        for(let i = 0; i < 17; i++){
            this.createNote(i);
        }

        this.limit = this.add.rectangle(285, 127, 2, 457).setOrigin(0,0);
        this.physics.add.existing(this.limit, true);
    }

    create() {

    }

    override update() {
        this.physics.overlap(this.notes, this.limit, this.removeNote, undefined, this);
    }

    public createNote(y: number = -1): void {
        if (y === -1) {
            y = Phaser.Math.Between(0, 16)*20;
        } else {
            y *= 20;
        }
        y += 203;
        const xOffset = Phaser.Math.Between(0, 10)*10;
        this.notes.create(980-xOffset, y, 'note').setVelocityX(-500).setBounceX(1);
    }

    public removeNote(limit: any, note: any): void {
        note.destroy();
        this.createNote();
    }

}