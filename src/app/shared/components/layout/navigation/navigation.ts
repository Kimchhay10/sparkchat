import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucideCircle,
  lucideInfo,
  lucideLink,
} from '@ng-icons/lucide';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';

@Component({
  standalone: true,
  templateUrl: './navigation.html',
  selector: 'app-navigation',
  imports: [BrnNavigationMenuImports],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideLink,
      lucideCircle,
      lucideCheck,
      lucideInfo,
    }),
  ],
})
export class Navigation {
  protected readonly _components = [
    {
      title: 'Alert Dialog',
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
      href: '/components/alert-dialog',
    },
    {
      title: 'Hover Card',
      description:
        'For sighted users to preview content available behind a link.',
      href: '/components/hover-card',
    },
    {
      title: 'Progress',
      description:
        'Displays an indicator showing the completion progress of a task.',
      href: '/components/progress',
    },
    {
      title: 'Scroll Area',
      description: 'Visually or semantically separates content.',
      href: '/components/scroll-area',
    },
    {
      title: 'Tabs',
      description: 'A set of layered content panels displayed one at a time.',
      href: '/components/tabs',
    },
    {
      title: 'Tooltip',
      description: 'A popup that displays information on hover or focus.',
      href: '/components/tooltip',
    },
  ];
}
