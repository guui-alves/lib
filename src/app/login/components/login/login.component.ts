import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorService } from 'src/app/core/services/error.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  configs = {
    isLogin: true,
    actionText: 'SignIn',
    buttonActionText: 'Create account'
  }

  private nameControl = new FormControl('', [Validators.required, Validators.minLength(5)])
  private alive =  true;

  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  onSubmit(): void {
    console.log(this.loginForm.value);

    const operation =
      (this.configs.isLogin)
        ? this.authService.signinUser(this.loginForm.value)
        : this.authService.signupUser(this.loginForm.value);

    operation.pipe(takeWhile(() => this.alive))
    .subscribe(res => {
      console.log('redirecting...', res);
    },
    err => console.log(this.errorService.getErrorMessage(err)))
  }

  changeAction(): void {
    this.configs.isLogin = !this.configs.isLogin;
    this.configs.actionText = !this.configs.isLogin ? 'SignUp' : 'SignIn';
    this.configs.buttonActionText = !this.configs.isLogin ? 'Already have an account' : 'Create account';
    !this.configs.isLogin ? this.loginForm.addControl('name', this.nameControl) : this.loginForm.removeControl('name');
  }

  get name(): FormControl {
    return <FormControl>this.loginForm.get('name');
  }
  get email(): FormControl {
    return <FormControl>this.loginForm.get('email');
  }
  get password(): FormControl {
    return <FormControl>this.loginForm.get('password');
  }
}
