import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [AngularMaterialModule, CommonModule, FormsModule],
})
export class AuthModule {}
