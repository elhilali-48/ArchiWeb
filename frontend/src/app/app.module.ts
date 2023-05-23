import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

//import { FormsModule  } from '@angular/forms';
import { ReactiveFormsModule  } from '@angular/forms';

// import SwwetAlet2



// Materiel UI
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule} from '@angular/material/divider';
import { MatIconModule} from '@angular/material/icon';

//
import { CookieService } from 'ngx-cookie-service';
import { GuardLoginService } from './service/guard-login.service';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';



//

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ForgotPasswordComponent,

  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    //FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Materiel UI
    MatSlideToggleModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatIconModule

    //SweetAlert



  ],
  providers: [CookieService,GuardLoginService],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
