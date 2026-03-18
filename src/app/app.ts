import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Keycloak from 'keycloak-js';
import { APP_CONFIG } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('loa-app');
  public tokenParsed: any;
  public readonly config: any = inject(APP_CONFIG);

  constructor(private readonly keycloak: Keycloak) {
    console.debug('tokenParsed', keycloak.tokenParsed);
    this.title = signal(keycloak.tokenParsed?.['given_name'])
    this.tokenParsed = keycloak.tokenParsed;
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }

  login() {
    const loa = this.config?.['loa'];
    this.keycloak.login({ acrValues: `aal${loa}`, acr: {values: [`aal${loa}`], essential: true} });
  }

  logout() {
    this.keycloak.logout();
  }

  getLoginLevelRequired() {
    const appLevel = this.config?.['loa'];
    console.debug('appLevel', appLevel);
    return appLevel;
  }

  getLoginLevel() {
    const loginLevel = parseInt(this.keycloak.tokenParsed?.acr?.replace('aal', '') ?? '0');
    console.debug('loginLevel', loginLevel);
    return loginLevel;
  }

  isValidACR() {
    return this.getLoginLevel() >= this.getLoginLevelRequired();
  }
}
