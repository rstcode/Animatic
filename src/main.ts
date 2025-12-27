import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Initialize Firebase (side-effect import)
import './app/firebase';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
