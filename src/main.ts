import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideEventPlugins} from '@taiga-ui/event-plugins';

import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [provideAnimations(), provideEventPlugins()],
}).catch(console.error);
