import {HostListener} from "@angular/core";
import { Component, OnInit } from '@angular/core';

@Component({
    template: ''
  })
export abstract class ComponentCanDeactivate {
 
  abstract  canDeactivate(): boolean;



    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue =true;
        }
    }
}