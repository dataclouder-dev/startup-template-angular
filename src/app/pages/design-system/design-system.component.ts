import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Tag } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    Tag,
    TooltipModule,
    RouterModule,
  ],
  templateUrl: './design-system.component.html',
  styleUrl: './design-system.component.css',
})
export class DesignSystemComponent implements OnInit {
  public isDarkMode = signal(false);
  public copiedText = signal<string | null>(null);

  // Estado para demostrar la navegación dinámica del patrón UX
  public currentContext = signal<'user' | 'admin'>('user');

  public brandColors = [
    { name: 'Primary Purple Accent', class: 'bg-primary-accent', value: '#2d0c62', varName: '--p-primary-color' },
    { name: 'Primary Dark Neon Mint', class: 'bg-neon-mint', value: '#4EF9BA', varName: '--primary-dark-color' },
    { name: 'Text Slate Light', class: 'bg-slate-light', value: '#475569', varName: '--text-color (light)' },
    { name: 'Surface Border', class: 'bg-surface-border', value: 'var(--surface-border)', varName: '--surface-border' },
    { name: 'Surface Ground', class: 'bg-surface-ground', value: 'var(--surface-ground)', varName: '--surface-ground' }
  ];

  public testDropdownOptions = [
    { label: 'Opción A', value: 'A' },
    { label: 'Opción B', value: 'B' },
    { label: 'Opción C', value: 'C' }
  ];

  ngOnInit() {
    this.isDarkMode.set(
      document.body.classList.contains('dark') || 
      document.documentElement.classList.contains('dark') || 
      document.documentElement.classList.contains('ion-palette-dark') ||
      localStorage.getItem('darkMode') === 'true'
    );
  }

  public toggleTheme() {
    const val = !this.isDarkMode();
    this.isDarkMode.set(val);
    document.documentElement.classList.toggle('ion-palette-dark', val);
    document.documentElement.classList.toggle('dark', val);
    document.body.classList.toggle('dark', val);
    localStorage.setItem('darkMode', val.toString());
  }

  public copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.copiedText.set(text);
    setTimeout(() => {
      this.copiedText.set(null);
    }, 2000);
  }

  public toggleContext() {
    this.currentContext.set(this.currentContext() === 'user' ? 'admin' : 'user');
  }

  public getMockBackLink(): string[] {
    return this.currentContext() === 'admin' 
      ? ['/page/admin/organizations'] 
      : ['/page/organization'];
  }

  public getMockEditLink(): string[] {
    return this.currentContext() === 'admin' 
      ? ['/page/admin/organizations/edit', '6a27c95e18f26467e443f298'] 
      : ['/page/organization/edit', '6a27c95e18f26467e443f298'];
  }

  public getMockDetailsLink(): string[] {
    return this.currentContext() === 'admin' 
      ? ['/page/admin/organizations/details', '6a27c95e18f26467e443f298'] 
      : ['/page/organization/details', '6a27c95e18f26467e443f298'];
  }
}
