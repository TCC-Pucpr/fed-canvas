export class GameScene extends Phaser.Scene {

    public pressArea: Phaser.GameObjects.Rectangle; 
    public limit: Phaser.GameObjects.Rectangle;
    public notes: Phaser.Physics.Arcade.Group;
    public readonly noteSprite: string = "note";
    public score: number;
    public inputs: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    public isPressed: boolean | undefined = false;
    public scoreText: Phaser.GameObjects.Text;

    constructor() {
        super({key: 'game'});
    }

    preload() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.notes = this.physics.add.group();
        for(let i = 0; i < 5; i++){
            this.createNote(i);
        }

        this.limit = this.add.rectangle(285, 127, 2, 457).setOrigin(0,0);
        this.pressArea = this.add.rectangle(287, 127, 60, 457).setOrigin(0,0);
        this.physics.add.existing(this.limit, true);
        this.physics.add.existing(this.pressArea, true);
        this.score = 0;

        this.inputs = this.input.keyboard?.createCursorKeys();
        this.scoreText = this.add.text(50, 50, '', { color: 'white' }).setOrigin(0, 0);
    }

    create() {

    }

    override update() {
        this.physics.overlap(this.notes, this.limit, this.removeNote, undefined, this);
        this.physics.overlap(this.notes, this.pressArea, this.pressedNote, undefined, this);
        if(this.isPressed && this.inputs?.space.isUp) {
            this.isPressed = false;
        }
        this.scoreText.setText(`Score: ${this.score}`);
    }

    public pressedNote(area: any, note: any){
        if(!this.isPressed && this.inputs?.space.isDown) {
            this.isPressed = true;
            note.destroy();
            this.createNote();
            this.score += 10;
        }
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
        this.score -= 1;
    }

}