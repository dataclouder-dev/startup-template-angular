import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';
import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { CubismFramework } from '@live2dframework/live2dcubismframework';
import { CSM_LOG_LEVEL, CSM_LOG_LEVEL_VERBOSE, CSM_LOG_LEVEL_DEBUG } from '@live2dframework/cubismframeworkconfig';

declare const Live2DCubismCore: any;

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, GenericListComponent, DialogModule, ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit {
  isDialogVisible: boolean = false;
  constructor() {}
  ngOnInit(): void {
    console.log('objecto', (window as any).Live2DCubismCore);
    // const version = Live2DCubismCore.Version;
    // console.log('version', version);
  }
}
