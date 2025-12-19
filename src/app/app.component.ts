import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastContainer } from './shared/ui/toast/toast-container';
import { ToastService } from './services/toast-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule, ToastContainer],
})
export class AppComponent {
  readonly toastService = inject(ToastService);
  title = 'Phenka ផែនការ';

  onToastClose = (id: string) => {
    this.toastService.dismiss(id);
  };
}
