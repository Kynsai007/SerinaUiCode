// import { IMqttServiceOptions } from "ngx-mqtt";

export const environment = {
  production: true,
  apiUrl: `https://${location.href.split("https://")[1].split(".serinaplus.com")[0]}.centralindia.cloudapp.azure.com`,
  // apiUrl:"http://127.0.0.1:8000",
  apiVersion: "apiv1.1",
  userData: JSON.parse(localStorage.getItem('currentLoginUser')),
  userName: JSON.parse(localStorage.getItem('username'))
};

export const environment1  = {
  hostname: `${location.href.split("https://")[1].split(".serinaplus.com")[0]}.centralindia.cloudapp.azure.com/apiv1.1`,
  // port: 443,
  // protocol: 'wss',
  // path: '/console',
  // clientId: Math.floor(Math.random() * 100000).toString(),
  // keepalive:10,
  username: environment.userName ? environment.userName :'',
  password: environment.userData ? environment.userData.token : ''
 }
