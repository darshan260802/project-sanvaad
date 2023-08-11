import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase/firebase.service';
import { CommonService } from './common/common.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  firebase:FirebaseService;
  common:CommonService;
  constructor(private fb:FirebaseService, private _common:CommonService) { 
    this.firebase = fb;
    this.common = _common;
  }
}
