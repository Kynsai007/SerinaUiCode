import { Injectable } from '@angular/core';
import { CanDeactivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {ComponentCanDeactivate} from './component-can-deactivate';

@Injectable()
export class CanDeactivateGuard {
  canDeactivate:CanDeactivateFn<ComponentCanDeactivate> =   (
    component: ComponentCanDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean => {
   
    if(!component.canDeactivate()){
      if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
          return true;
      } else {
          return false;
      }
  }
  return true;
}
}
