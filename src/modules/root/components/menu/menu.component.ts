import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from 'lbox-shared';
import { AuthService } from 'lbox-auth';

@Component({
  selector: 'lbox-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements AfterViewInit {
  menuHidden = true;

  constructor(
    private configService: ConfigurationService,
    private authService: AuthService,
    private router: Router,
    private elem: ElementRef
  ) {}

  ngAfterViewInit() {
    const elements = this.elem.nativeElement.querySelectorAll('.menu-link');
    elements.forEach((e: any) => e.addEventListener('click', this.hideMenu.bind(this)));
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  hideMenu() {
    this.menuHidden = true;
  }

  toggleTheme() {
    this.configService.toggleTheme();
  }

  get currentThemeIcon(): string {
    return this.configService.currentTheme?.icon ?? '';
  }

  get userName(): string {
    const authToken = this.authService.currentAuthToken;
    return authToken?.name ?? '';
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }
}
