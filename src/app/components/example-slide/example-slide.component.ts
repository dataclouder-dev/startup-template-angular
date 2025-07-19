import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example-slide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example-slide-content">
      <img *ngIf="data?.image" [src]="data.image" [alt]="data.title" />
      <h4>{{ data?.title ?? 'No Title' }}</h4>
      <p>{{ data?.description ?? 'No Description' }}</p>
    </div>
  `,
  styles: [
    `
      .example-slide-content {
        border: 1px solid lightcoral;
        padding: 10px;
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        background-color: #fff5f5;
      }
      img {
        max-width: 90%;
        max-height: 150px; /* Adjust as needed */
        height: auto;
        margin-bottom: 8px;
        object-fit: contain;
      }
      h4 {
        margin: 5px 0;
        font-size: 1.1em;
      }
      p {
        font-size: 0.9em;
        color: #555;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleSlideComponent {
  @Input() data: any; // Receives data for one slide
}
