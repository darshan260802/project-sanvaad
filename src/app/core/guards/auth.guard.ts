import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { FirebaseService } from '../services/firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private fbService:FirebaseService) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    if(state.url.includes('login')){
      if(await this.fbService.isLoggedIn()){
        this.router.navigate(['']);
        return false;
      }
      return true;
    }


    if(await this.fbService.isLoggedIn()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
