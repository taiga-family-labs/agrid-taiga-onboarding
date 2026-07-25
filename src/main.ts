import {provideAnimations} from '@angular/platform-browser/animations';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideTaiga} from '@taiga-ui/core';

import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [provideAnimations(), provideTaiga()],
}).catch(console.error);
