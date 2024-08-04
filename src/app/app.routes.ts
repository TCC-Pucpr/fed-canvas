import { Routes } from "@angular/router";
import { NothingComponent } from "./nothing/nothing.component";
import { GameComponent } from "./game/game.component";

export const routes: Routes = [
    { path: 'game', component: GameComponent },
    { path: "nothing", component: NothingComponent },
    { path: "**", redirectTo: 'nothing' },
];
