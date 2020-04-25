import { Component, OnInit, HostBinding } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { take } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorService } from 'src/app/core/services/error.service';
import { ImagePreviewComponent } from 'src/app/shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User;
  isEditing = false;
  isLoading = false;
  @HostBinding('class.app-user-profile') private applyHostClass = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private errorService: ErrorService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.user = JSON.parse(JSON.stringify(this.authService.authUser));
  }

  triggerInputFile(input: HTMLInputElement) {
    input.click();
  }

  onSelectImage(event) {
    const input: HTMLInputElement = <HTMLInputElement>event.target;
    const file: File = input.files[0];
    const dialogRef = this.dialog.open<ImagePreviewComponent, { image: File }, { canSave: boolean, selectedImage: File }>(ImagePreviewComponent,
       { data: { image: file }, panelClass: 'mat-dialog-no-padding', maxHeight: '80vh' });
    dialogRef.afterClosed().pipe(take(1)).subscribe(dialogData => {
      input.value = '';
    });
  }

  onSave() {
    this.isLoading = true;
    this.isEditing = false;
    let message;
    this.userService.updateUser(this.user).pipe(take(1)).subscribe((User: User) => {
      message = 'Profile Updated!';
    },
    error => {
      message = this.errorService.getErrorMessage(error);
    },
    () => {
      this.isLoading = false;
      this.snackBar.open(message, 'OK', { duration: 3000, verticalPosition: 'top' })
    })
  }

}
