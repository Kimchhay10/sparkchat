import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarWidgetComponent } from './sidebar-widget/sidebar-widget';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SafeHtmlPipe } from '../../../../pipe/safe-html.pipe';
import { SidebarService } from '../../../../services/sidebar-service';
import { AuthService } from '../../../../services/auth-service';
import { LangService } from '../../../../services/lang-service';
import { ThemeService, ThemeMode } from '../../../../services/theme-service';
import { Button } from '../../../ui/button/button';
import { Modal } from '../../../ui/modal/modal';
import { TranslateModule } from '@ngx-translate/core';
import { Icon, IconName } from '../../../ui/icon/icon';

type NavItem = {
  name: string;
  icon: IconName;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, Button, Modal, TranslateModule, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class AppSidebarComponent {
  private readonly authService = inject(AuthService);
  readonly langService = inject(LangService);
  readonly themeService = inject(ThemeService);
  openLogoutModal = signal<boolean>(false);

  // Navigation items
  navItems: NavItem[] = [
    {
      name: 'Dashboard',
      icon: 'dashboard',
      path: '/admin/dashboard',
    },
    {
      name: 'Learning',
      icon: 'users',
      path: '/admin/learning',
    },
    {
      name: 'Community',
      icon: 'orders',
      path: '/admin/community',
    },
    {
      name: 'Entrepreneur',
      icon: 'analytics',
      path: '/admin/entrepreneur',
    },
    {
      name: 'Settings',
      icon: 'settings',
      path: '/admin/settings',
    },
  ];

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

  ngOnInit() {}

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  getActiveIndex(): number {
    const currentRoute = this.router.url;
    const index = this.navItems.findIndex((item) => item.path === currentRoute);
    return index !== -1 ? index : 0;
  }

  onOpenLogoutModal(): void {
    this.openLogoutModal.set(true);
  }

  onCloseLogoutModal() {
    this.openLogoutModal.set(false);
  }

  onLogout(): void {
    this.authService.logout();
    this.openLogoutModal.set(false);
  }

  onNavItemClick(): void {
    // Close mobile sidebar when nav item is clicked
    if (window.innerWidth < 1024) {
      this.sidebarService.setMobileOpen(false);
    }
  }

  toggleLanguage(): void {
    this.langService.toggleLang();
  }

  cycleTheme(): void {
    this.themeService.toggleTheme();
  }

  get themeIcon(): IconName {
    return this.themeService.getThemeIcon() as IconName;
  }

  get themeLabel(): string {
    return this.themeService.getThemeLabel();
  }
}
