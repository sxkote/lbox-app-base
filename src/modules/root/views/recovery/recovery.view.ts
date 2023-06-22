import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'lbox-recovery',
  templateUrl: './recovery.view.html',
  styleUrls: ['./recovery.view.scss'],
})
export class RecoveryView implements OnInit {
  activity?: string;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const params = await firstValueFrom(this.route.params);
    this.activity = params['activity'];
  }
}
