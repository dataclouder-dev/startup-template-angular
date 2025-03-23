import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';
import { GenericListComponent } from '../generics/generic-list/generic-list.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

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
    console.log('TestComponent');
    if (Capacitor.isNativePlatform()) {
      // this.startListening();
    } else {
      console.log('Not a native platform!');
    }
  }

  public async startListening() {
    const permission = await SpeechRecognition.checkPermissions();
    console.log('startListening', permission);

    const resultPermission = await SpeechRecognition.requestPermissions();
    console.log('startListening', resultPermission);

    console.log('startListening');
    const isAvalible = await SpeechRecognition.available();
    console.log('startListening', isAvalible);

    SpeechRecognition.start({
      language: 'en-US',
      maxResults: 2,
      prompt: 'Say something',
      partialResults: true,
      popup: true,
    });

    // listen to partial results

    SpeechRecognition.addListener('partialResults', (data: any) => {
      console.log('partialResults was fired', data.matches);
    });
  }

  // SpeechRecognition.available();
  // SpeechRecognition.start({
  //   language: "en-US",
  //   maxResults: 2,
  //   prompt: "Say something",
  //   partialResults: true,
  //   popup: true,
  // });
  // // listen to partial results
  // SpeechRecognition.addListener("partialResults", (data: any) => {
  //   console.log("partialResults was fired", data.matches);
  // });
}
