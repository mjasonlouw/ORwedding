import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GuestService } from './guest.service';
import { RegistryComponent } from './registry/registry.component';
import { DefaultComponent } from './default/default.component';

const routes: Routes = [
  {
    matcher: (url) => {
        if(url.length == 2){
          if(url[0].path == 'welcome'){
            return {
              consumed: url,
              posParams: {
                name: new UrlSegment(url[1].path, {}),
              }
            };
          }
        }
      return null;
    },
    component: HomeComponent
  },
  {
    matcher: (url) => {
        if(url.length == 2){
          if(url[0].path == 'registry'){
            return {
              consumed: url,
              posParams: {
                name: new UrlSegment(url[1].path, {}),
              }
            };
          }
        }
      return null;
    },
    component: RegistryComponent
  },
  { path: '', component: DefaultComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
