import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GuestService } from './guest.service';
import { RegistryComponent } from './registry/registry.component';
import { DefaultComponent } from './default/default.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path:'admin', component: AdminComponent, pathMatch: 'full' },
  {
    matcher: (url) => {
        if(url.length == 2){
          if(url[1].path == 'welcome'){
            return {
              consumed: url,
              posParams: {
                name: new UrlSegment(url[0].path, {}),
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
          if(url[1].path == 'registry'){
            return {
              consumed: url,
              posParams: {
                name: new UrlSegment(url[0].path, {}),
              }
            };
          }
        }
      return null;
    },
    component: RegistryComponent
  },
  {
    matcher: (url) => {
        if(url.length == 1){
    
            return {
              consumed: url,
              posParams: {
                name: new UrlSegment(url[0].path, {}),
              }
            };
          
        }
      return null;
    },
    component: DefaultComponent
  },
  
  { path: '', component: NotFoundComponent, pathMatch: 'full'},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
