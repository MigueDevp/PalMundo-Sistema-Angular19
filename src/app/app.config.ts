import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection, isDevMode } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
export function initializeIconLibrary(library: FaIconLibrary) {
  library.addIconPacks(fas); 
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(FontAwesomeModule),
    provideHttpClient(),
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        initializeIconLibrary(library);
        return library;
      }
    }, provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
};