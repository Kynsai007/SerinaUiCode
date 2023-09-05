import { ChartsService } from './../dashboard/charts.service';
import { DocumentService } from './../vendorPortal/document.service';
import { SharedService } from './../shared.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { environment1 } from 'src/environments/environment.prod';
import jwt_decode from "jwt-decode";

export interface User{
    id?: number;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    user_type? : string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private apiUrl = environment.apiUrl;
    private apiVersion = environment.apiVersion;

    constructor(private http: HttpClient,
        private router:Router,
        private docService : DocumentService,
        private chartService : ChartsService,
        private sharedService: SharedService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentLoginUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(data) {
        return this.http.post<any>(`${this.apiUrl}/${this.apiVersion}/login`, data)
            .pipe(map(user => {
                if (user['status']) {
                    return user;
                }
                this.dataFunc(user);

                return user
            }));
    }
    resendOTP(username){
        return this.http.post<any>(`${this.apiUrl}/${this.apiVersion}/resendOTP`,{'username':username},{headers:new HttpHeaders({'Content-Type':'application/json'})});
    }
    verifyOTP(otpObj){
        return this.http.post<any>(`${this.apiUrl}/${this.apiVersion}/verifyOTP`,otpObj,{headers:new HttpHeaders({'Content-Type':'application/json'})})
        .pipe(map(user => {
            if(user == "invalid" || user == "otp expired"){
                return user;
            }
           this.dataFunc(user);
            return user;
        }));
    }

    dataFunc(user){
        const decoded_permission = jwt_decode(user.x_api_token);
        const decoded_user = jwt_decode(user.token);
        user.permissioninfo= decoded_permission["sub"];
        user.userdetails = decoded_user["sub"];

        // store user details and jwt token in session storage to keep user logged in between page refreshes
        const userData = sessionStorage.setItem('currentLoginUser', JSON.stringify(user));
        this.sharedService.userId = user.userdetails?.idUser;
        this.docService.userId = user.userdetails?.idUser;
        this.chartService.userId = user.userdetails?.idUser;
        this.currentUserSubject.next(user);
        environment1.password = user.token;
    }
    async logout() {
        let userid = JSON.parse(sessionStorage.getItem('currentLoginUser')).userdetails?.idUser;
        await this.http.post(`${this.apiUrl}/${this.apiVersion}/logout/${userid}`,null).toPromise();
        this.router.navigate(['/']);
        sessionStorage.removeItem('currentLoginUser');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('messageBox');
        sessionStorage.clear();
        this.currentUserSubject.next(null);
    }
}