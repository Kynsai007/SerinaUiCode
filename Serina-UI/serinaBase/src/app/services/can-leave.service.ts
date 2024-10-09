import { Injectable } from '@angular/core';
// import { CanDeactivate } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap, first, tap } from 'rxjs/operators';

export type CanLeaveType = boolean | Promise<boolean> | Observable<boolean>;

@Injectable({
  providedIn: 'root'
})
export class CanLeaveService  {

  private observer$ = new BehaviorSubject<CanLeaveType>(true);

  /** Pushes a guarding value into the guard observer to resolve when leaving the page */
  public allowDeactivation(guard: CanLeaveType) {
    this.observer$.next(guard);
  }

  // Implements the CanDeactivate interface to conditionally prevent leaving the page
  canDeactivate(): Observable<boolean> {
    // Debug
    console.log('canDeactivate:');
    
    // Returns an observable resolving into a suitable guarding value
    return this.observer$.pipe(
      // Merge the observer to a lower-order observable
      mergeMap(canLeave => typeof canLeave === 'boolean' ? of(canLeave) : canLeave),
      // Makes sure the observable always resolves
      first(),
      // Debug purposes only
      tap(allow => console.log(allow ? 'leave' : 'stay'))
    );
  }
}
