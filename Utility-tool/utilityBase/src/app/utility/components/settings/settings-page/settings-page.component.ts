import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  settingsMenuItems = [
    { name: 'Configuration', link: 'configuration' },
    { name: 'Mail Listener', link: 'mail-listener' },
    { name: 'Sharepoint Listener', link: 'sharepoint-listener' },
    { name: 'Entity Routing', link: 'entity-routing' },
    { name: 'Open AI', link: 'openAI' },
    
  ]

  constructor(private sharedService : SharedService,
    private router : Router) { }

  ngOnInit(): void {
    if(this.sharedService.isAdmin == false){
      alert("Sorry!, access denied.");
      this.router.navigate(['IT_Utility/home'])
    } 
  }

}
