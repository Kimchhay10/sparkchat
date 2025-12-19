import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from '../../../shared/ui/button/button';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LangService } from '../../../services/lang-service';
import RoadMapData from './roadmap.data.json';
interface RoadmapStep {
  id: string;
  title: string;
  titleKm: string;
  description: string;
  descriptionKm: string;
  duration: string;
  durationKm: string;
  skills: string[];
  skillsKm: string[];
  resources: {
    title: string;
    titleKm: string;
    type: string;
    typeKm: string;
    description: string;
    descriptionKm: string;
    topics: string[];
    topicsKm: string[];
  }[];
}

interface CareerRoadmap {
  id: string;
  title: string;
  titleKm: string;
  category: string;
  categoryKm: string;
  icon: string;
  description: string;
  descriptionKm: string;
  demandLevel: 'High' | 'Medium' | 'Growing';
  demandLevelKm: string;
  averageSalary: string;
  averageSalaryKm: string;
  popularity: number;
  steps: RoadmapStep[];
}

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.css',
})
export class RoadmapComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly langService = inject(LangService);

  selectedRoadmap = signal<CareerRoadmap | null>(null);
  selectedStep = signal<RoadmapStep | null>(null);
  selectedCategory = signal<string>('All');
  showStepPopover = signal<boolean>(false);
  selectedResource = signal<any>(null);
  showResourceDetail = signal<boolean>(false);

  categories = signal<any[]>([]);
  roadmaps = signal<CareerRoadmap[]>([]);

  readonly isKhmer = computed(() => this.langService.isKhmer());

  ngOnInit(): void {
    this.categories.set(RoadMapData.categories);
    this.roadmaps.set(RoadMapData.roadmaps as any);
  }

  filteredRoadmaps = computed(() => {
    const selected = this.selectedCategory();
    if (selected === 'All') {
      return this.roadmaps();
    }
    return this.roadmaps().filter((r) => r.category === selected);
  });

  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }

  selectRoadmap(roadmap: CareerRoadmap) {
    this.selectedRoadmap.set(roadmap);
    this.selectedStep.set(null);
    this.showStepPopover.set(false);
  }

  backToList() {
    this.selectedRoadmap.set(null);
    this.selectedStep.set(null);
    this.showStepPopover.set(false);
  }

  selectStep(step: RoadmapStep) {
    this.selectedStep.set(step);
    this.showStepPopover.set(true);
  }

  closePopover() {
    this.showStepPopover.set(false);
    setTimeout(() => this.selectedStep.set(null), 200);
  }

  selectResource(resource: any) {
    this.selectedResource.set(resource);
    this.showResourceDetail.set(true);
  }

  closeResourceDetail() {
    this.showResourceDetail.set(false);
    setTimeout(() => this.selectedResource.set(null), 200);
  }
}
