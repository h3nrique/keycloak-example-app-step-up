import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  provideKeycloak,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  includeBearerTokenInterceptor } from 'keycloak-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const APP_CONFIG = new InjectionToken<any>('APP_CONFIG');

export const appConfig = (config: any): ApplicationConfig => {
  const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: new RegExp(`^${config.api}(\/.*)?$`, 'i')
  });
  return {
    providers: [
      { provide: APP_CONFIG, useValue: config },
      provideKeycloak({
        config: {
          url: config.authConfig.url,
          realm: config.authConfig.realm,
          clientId: config.authConfig.clientId,
          ...(config.authConfig.clientSecret && { clientSecret: config.authConfig.clientSecret })
        },
        initOptions: {
          onLoad: 'check-sso'
        },
        providers: [
          {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [localhostCondition]
          }
        ]
      }),
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes),
      provideClientHydration(withEventReplay()),
      provideHttpClient(withInterceptors([includeBearerTokenInterceptor]))
    ]
  };
};
