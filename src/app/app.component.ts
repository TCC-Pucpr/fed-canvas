import { Component, OnInit } from '@angular/core';
import { Notes } from './models/note.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isPaused : boolean = false;
  public stepInterval: any;
  public noteInterval: any;
  public readonly fps: number = 144;

  public canvas: HTMLCanvasElement;
  public canvasCtx: CanvasRenderingContext2D;

  public captureLineX: number = 100;

  public readonly noteMovement: number = 10;
  public readonly nps: number = 8;
  public readonly noteRadius = 15;
  public readonly rowCount = 11;
  public readonly noteSpacing = (this.noteRadius*2)+10;
  public noteArray: Notes[] = [];


  public step = () => {
    this.clearFrame();
    this.moveNotes();
    this.renderFrame();
  }
  public addNotes = () => {
    const row = this.getRandomInt(1, this.rowCount)*this.noteSpacing;
    this.noteArray.push({ bmol: false, x: this.canvas.width, y: row });
  }

  public ngOnInit(): void {
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.canvasCtx = this.canvas.getContext('2d');
    this.stepInterval = setInterval(this.step, 1000/this.fps);
    this.noteInterval = setInterval(this.addNotes, 1000/this.nps);
  }

  public clearFrame() {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public moveNotes() {
    this.noteArray = this.noteArray.filter(note => note.x >= this.captureLineX);
    for(let i = 0; i < this.noteArray.length; i++){
      this.noteArray[i].x -= this.noteMovement;
    }
  }

  public renderNote(note: Notes) {
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(note.x, note.y, this.noteRadius, 0, 2 * Math.PI);
    this.canvasCtx.stroke();
  }

  public renderLines() {
    for(let i = 1; i <= this.rowCount; i++){
      if(i%2 != 0){
        this.canvasCtx.globalAlpha = 0;
      }else{
        this.canvasCtx.globalAlpha = 1;
      }
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(this.captureLineX, i*this.noteSpacing);
      this.canvasCtx.lineTo(this.canvas.width, i*this.noteSpacing);
      this.canvasCtx.stroke();
    }
    this.canvasCtx.globalAlpha = 1;
  }

  public renderFrame() {
    this.renderLines();
    for(let i = 0; i < this.noteArray.length; i++){
      this.renderNote(this.noteArray[i]);
    }
  }

  public getRandomInt(min: number = 0, max: number): number {
    return min + Math.floor(Math.random() * max);
  }

  public manualStep(){
    this.step();
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
    clearInterval(this.stepInterval);
  }

  public debugOff() {
    this.isPaused = false;
    this.ngOnInit();
  }

}
