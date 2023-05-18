import { Component, OnInit } from '@angular/core';
import {User} from '../../models/User';
import {TokenStorageService} from '../../service/token-storage.service';
import {UserService} from '../../service/user.service';
import {Router} from '@angular/router';
import {ImageUploadService} from "../../service/image-upload.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  isUserDataLoaded = false;
  isLoggedIn = false;
  isDataLoaded = false;
  userProfileImage: File;
  user: User;
  previewImgURL: any;

  constructor(private tokenService: TokenStorageService,
              private userService: UserService,
              private imageService: ImageUploadService,
              private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenService.getToken();

    if(this.isLoggedIn) {
      this.userService.getCurrentUser()
        .subscribe(data => {
          this.user = data;
          this.isDataLoaded = true;
        })
    }

    this.userService.getCurrentUser()
      .subscribe(data => {
        this.user = data;
        this.isUserDataLoaded = true;
      });

    this.imageService.getProfileImage()
      .subscribe(data => {
        this.userProfileImage = data.imageBytes;
      });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }
}
