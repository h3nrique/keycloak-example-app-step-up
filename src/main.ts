import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

const initializeApp = async () => {
  const config = await fetch(environment.configFile).then((res) => res?.json());

  await bootstrapApplication(App, appConfig(config));
};

initializeApp().catch((error) => console.error(`Failed to initialize the application. ${error.message || error}`));

