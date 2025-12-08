import { Component, inject } from '@angular/core';
import { LangService } from '../../../services/lang-service';
import { ChatRoomComponent } from '../../../shared/components/chat/chat-room.component';

@Component({
  selector: 'app-home-page',
  imports: [ChatRoomComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  standalone: true,
})
export class HomePageComponent {
  protected readonly langService = inject(LangService);

  ngOnInit(): void {}
}
