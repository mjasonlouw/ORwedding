import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegistryComponent } from './registry/registry.component';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { DefaultComponent } from './default/default.component';
import { AdminComponent } from './admin/admin.component';

import { HeaderComponent } from './default/components/header/header.component';
import { RsvpFormComponent } from './default/components/rsvp-form/rsvp-form.component';
import { LandingPageComponent } from './default/components/landing-page/landing-page.component';
import { MusicSectionComponent } from './default/components/music-section/music-section.component';
import { WeddingDetailsComponent } from './default/components/wedding-details/wedding-details.component';
import { MenuComponent } from './default/components/menu/menu.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistryComponent,
    DefaultComponent,
    AdminComponent,
    HeaderComponent,
    RsvpFormComponent,
    LandingPageComponent,
    MusicSectionComponent,
    WeddingDetailsComponent,
    MenuComponent,
    NotFoundComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
