import { Component, OnInit } from '@angular/core';
import { Notes } from './models/note.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public processInterval: any;
  public renderInterval: any;
  public noteInterval: any;
  public readonly fps: number = 144;
  public isPaused : boolean = false;

  public canvas: HTMLCanvasElement;
  public canvasCtx: CanvasRenderingContext2D;

  // how fast the notes will be moving on the screen
  public readonly noteMovement: number = 2;
  // notes per second
  public readonly nps: number = 5;
  public noteArray: Notes[] = [];
  public readonly noteXRadius = 40;
  public readonly noteYRadius = 20;
  public readonly fontSize = 20;

  public readonly fixedRowsCount = 11;
  // where notes will spawn, will move the starting index to here
  public readonly startingRow = 5;
  public readonly rowSpacing = (this.noteYRadius*2);


  // x coord where the notes have to be pressed
  public xNoteCaptureRegion: number = 100;
  // margin of error of how much you can miss the press on a specific note
  public xNoteCaptureOffset: number = this.noteXRadius/3;

  protected processing = () => {
    this.moveNotes();
  }

  protected addNotes = () => {
    const chosenRow = this.getRandomInt(1, this.fixedRowsCount) + this.startingRow;
    const row = (chosenRow*this.rowSpacing);
    const isBmol: boolean = this.getRandomInt(0, 2) == 1;
    this.noteArray.push({ bmol: isBmol, x: this.canvas.width, y: row });
  }

  protected renderFrame = () => {
    this.clearFrame();
    this.renderObjects();
  }

  public ngOnInit(): void {
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.canvasCtx = this.canvas.getContext('2d');
    this.renderInterval = setInterval(this.renderFrame, 1000/this.fps);
    this.noteInterval = setInterval(this.addNotes, 1000/this.nps);
    this.processInterval = setInterval(this.processing, 1);

    this.canvasCtx.font = `${this.fontSize*2}px Arial`;
  }

  public renderObjects() {
    for(let i = 0; i < this.noteArray.length; i++){
      this.renderNote(this.noteArray[i]);
    }
    this.renderLines(1, this.fixedRowsCount, 0, this.canvas.width);
    this.renderCaptureLine();
  }

  public clearFrame() {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  protected moveNotes() {
    this.noteArray = this.noteArray.filter(note => note.x >= this.xNoteCaptureRegion);
    for(let i = 0; i < this.noteArray.length; i++){
      this.noteArray[i].x -= this.noteMovement;
    }
  }

  protected renderNote(note: Notes) {
    this.canvasCtx.fillStyle = "black";
    this.canvasCtx.beginPath();
    this.canvasCtx.ellipse(note.x, note.y, this.noteXRadius, this.noteYRadius, 0, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    const lineOverflow = 20;
    this.renderLines(this.fixedRowsCount+1, note.y/this.rowSpacing, note.x-this.noteXRadius-lineOverflow, note.x+this.noteXRadius+lineOverflow);
    if(!note.bmol) return;
    this.canvasCtx.fillText("♭", note.x-(this.noteXRadius+this.fontSize/2), note.y+this.noteYRadius+this.fontSize/2);
  }

  /**
   * draws lines on the screen
   * @param yStartIndex the Y index where the line starts, inclusive
   * @param yEndIndex the Y index where the line ends, inclusive
   * @param xStartPos the X start position of the line
   * @param xEndPos the X end position of the line
   */
  protected renderLines(yStartIndex: number, yEndIndex: number, xStartPos: number, xEndPos: number) {
    for(let i = yStartIndex; i <= yEndIndex; i++){
      if(i%2 != 0){
        this.canvasCtx.globalAlpha = 0;
      }else{
        this.canvasCtx.globalAlpha = 1;
      }
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(xStartPos, i*this.rowSpacing);
      this.canvasCtx.lineTo(xEndPos, i*this.rowSpacing);
      this.canvasCtx.stroke();
    }
    this.canvasCtx.globalAlpha = 1;
  }

  protected renderCaptureLine() {

  }

  /**
   * Gera um número aleatório de min(inclusive) até max(exclusive)
   */
  public getRandomInt(min: number = 0, max: number): number {
    return min + Math.floor(Math.random() * max);
  }

  // debug info
  public manualStep(){
    this.processing();
  }

  public printInfo(){
    console.log(this.noteArray);
  }

  public toggleDebug(){
    if(this.isPaused){
      this.debugOff();
    } else {
      this.debugOn();
    }
  }

  public debugOn() {
    this.isPaused = true;
    clearInterval(this.noteInterval);
    clearInterval(this.processInterval);
  }

  public debugOff() {
    this.isPaused = false;
    this.ngOnInit();
  }

}
