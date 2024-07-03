import { Component, OnInit } from '@angular/core';
import { Notes } from './models/note.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isPaused : boolean = false;
  public processInterval: any;
  public renderInterval: any;
  public noteInterval: any;
  public readonly fps: number = 100;

  public canvas: HTMLCanvasElement;
  public canvasCtx: CanvasRenderingContext2D;

  public captureLineX: number = 100;

  public readonly noteMovement: number = 10;
  public readonly nps: number = 5;
  public readonly noteXRadius = 40;
  public readonly noteYRadius = 20;
  public readonly fontSize = 20;
  public readonly rowCount = 11;
  public readonly noteSpacing = (this.noteYRadius*2);
  public noteArray: Notes[] = [];


  protected processing = () => {
    this.moveNotes();
  }

  protected addNotes = () => {
    const row = this.getRandomInt(1, this.rowCount)*this.noteSpacing;
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
    this.renderLines();
    this.renderCaptureLine();
    for(let i = 0; i < this.noteArray.length; i++){
      this.renderNote(this.noteArray[i]);
    }
  }

  public clearFrame() {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  protected moveNotes() {
    this.noteArray = this.noteArray.filter(note => note.x >= this.captureLineX);
    for(let i = 0; i < this.noteArray.length; i++){
      this.noteArray[i].x -= this.noteMovement;
    }
  }

  protected renderNote(note: Notes) {
    this.canvasCtx.beginPath();
    this.canvasCtx.ellipse(note.x, note.y, this.noteXRadius, this.noteYRadius, 0, 0, 2 * Math.PI);
    this.canvasCtx.stroke();
    if(!note.bmol) return;
    this.canvasCtx.fillText("♭", note.x-(this.noteXRadius+this.fontSize/2), note.y+this.noteYRadius+this.fontSize/2);
  }

  protected renderLines() {
    for(let i = 1; i <= this.rowCount; i++){
      if(i%2 != 0){
        this.canvasCtx.globalAlpha = 0;
      }else{
        this.canvasCtx.globalAlpha = 1;
      }
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(0, i*this.noteSpacing);
      this.canvasCtx.lineTo(this.canvas.width, i*this.noteSpacing);
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
