import {Component} from '@angular/core';
import {NativeScriptRouterModule } from 'nativescript-angular/router';

@Component({
    selector: "first",
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
        <Button text="GO TO SECOND" [nsRouterLink]="['/second']" class="link"></Button>
    </StackLayout>`
})
export class FirstComponent { }

@Component({
    selector: "second",
    template: `
    <StackLayout>
        <Label text="Second component" class="title"></Label>
        <Button text="GO TO FIRST" [nsRouterLink]="['/first']" class="link"></Button>
    </StackLayout>`
})
export class SecondComponent { }