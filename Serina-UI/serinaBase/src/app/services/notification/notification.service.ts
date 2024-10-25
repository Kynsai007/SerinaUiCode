import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  apiVersion = environment.apiVersion;
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  getTemplateGroup(){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/templates`).pipe(retry(3));
  }
  getEmailTemplate(tempgropid){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/get_template_datas/${tempgropid}`).pipe(retry(3));
  }
  getEmailTemplateSpec(tempnameid){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/getTemplateData/${tempnameid}`).pipe(retry(3));
  }
  createNewEmailTemplate(data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Notification/create_template`, data).pipe(retry(3));
  }
  editEmailTemplate(data,tempgropid,tempnameid){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Notification/updateTemplate/${tempgropid}/${tempnameid}`, data).pipe(retry(3));
  }
  deleteEmailTemplate(tempgropid,tempnameid){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Notification/delete_template/${tempgropid}/${tempnameid}`, {}).pipe(retry(3));
  }
  getEmailRecipients(){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/get_Recipients`).pipe(retry(3));
  }
  setEmailRecipients(data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Notification/createRecipientsGroup`, data).pipe(retry(3));
  }
  getEmailRecipientsSpec(tempnameid){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/getRecipientsGroup/${tempnameid}`).pipe(retry(3));
  }
  updateEmailRecipients(tempnameid,recgrpid,data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Notification/updateRecipients/${tempnameid}/${recgrpid}`, data).pipe(retry(3));
  }
  deleteEmailRecipients(tempnameid,recgrpid){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Notification/deleteRecieptsGroups/${tempnameid}/${recgrpid}`, {}).pipe(retry(3));
  }
}
