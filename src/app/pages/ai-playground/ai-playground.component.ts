import { Component, OnInit } from '@angular/core';
import { VertexAllModelsComponent } from '@dataclouder/ngx-ai-services';

@Component({
  selector: 'app-ai-playground',
  templateUrl: './ai-playground.component.html',
  styleUrls: ['./ai-playground.component.scss'],
  standalone: true,
  imports: [VertexAllModelsComponent],
})
export class AiPlaygroundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
