import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProfilService} from "../services/profil.service";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {locate} from "ionicons/icons";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss']
})
export class ProfilPage implements OnInit {
  user: any = {}; // initialize user as an empty object

  constructor(private userService: ProfilService, private router: Router,private authService : AuthService, private cd: ChangeDetectorRef ) {
  }

  ngOnInit() {
    const userid = localStorage.getItem('user_id');
    if (userid) {
      this.userService.getUserProfile(userid).subscribe(
        response => {
          this.user = response; // les informations de l'utilisateur reçues du serveur
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  logout(): void {
    // Supprime les informations utilisateur du localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');

    //this.userService.logout().subscribe();

    this.authService.setLoggedOut(); // après une déconnexion réussie
    this.router.navigateByUrl('');
  }


}
