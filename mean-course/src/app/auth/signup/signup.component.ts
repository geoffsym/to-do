import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private authSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
