import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from '../../../shared/ui/button/button';

interface CommunityProject {
  id: string;
  title: string;
  titleKm: string;
  description: string;
  descriptionKm: string;
  category: string;
  location: string;
  status: 'Planning' | 'Active' | 'Completed';
  volunteers: number;
  volunteersNeeded: number;
  fundingGoal: number;
  fundingCurrent: number;
  impact: string;
  creator: string;
  createdDate: string;
  icon: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Reported' | 'In Progress' | 'Resolved';
  reportedBy: string;
  reportedDate: string;
  votes: number;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, TranslateModule, Button],
  templateUrl: './community.html',
  styleUrl: './community.css',
})
export class CommunityComponent {
  stats = signal([
    {
      label: 'Active Projects',
      value: '24',
      icon: '🚀',
      trend: '+5 this month',
    },
    {
      label: 'Volunteers',
      value: '1,250',
      icon: '🤝',
      trend: '+120 this week',
    },
    {
      label: 'Issues Solved',
      value: '156',
      icon: '✅',
      trend: '89% success rate',
    },
    {
      label: 'Funds Raised',
      value: '$45K',
      icon: '💰',
      trend: '+$12K this month',
    },
  ]);

  categories = signal([
    { name: 'Education', icon: '📚', projects: 12, color: 'bg-blue-500' },
    { name: 'Environment', icon: '🌱', projects: 8, color: 'bg-green-500' },
    {
      name: 'Infrastructure',
      icon: '🏗️',
      projects: 15,
      color: 'bg-orange-500',
    },
    { name: 'Health', icon: '⚕️', projects: 6, color: 'bg-red-500' },
    { name: 'Technology', icon: '💻', projects: 10, color: 'bg-purple-500' },
    { name: 'Community', icon: '🏘️', projects: 9, color: 'bg-pink-500' },
  ]);

  activeProjects = signal<CommunityProject[]>([
    {
      id: '1',
      title: 'Clean Water Initiative',
      titleKm: 'គំនិតផ្តួចផ្តើមទឹកស្អាត',
      description: 'Install water filtration systems in rural schools',
      descriptionKm: 'ដំឡើងប្រព័ន្ធច្រោះទឹកនៅសាលារៀនទីជនបទ',
      category: 'Infrastructure',
      location: 'Kampong Cham',
      status: 'Active',
      volunteers: 45,
      volunteersNeeded: 60,
      fundingGoal: 5000,
      fundingCurrent: 3200,
      impact: '500+ students',
      creator: 'Sok Chanthy',
      createdDate: '2025-12-01',
      icon: '💧',
    },
    {
      id: '2',
      title: 'Youth Coding Bootcamp',
      titleKm: 'ជំរុំកូដកម្មយុវជន',
      description: 'Free coding classes for rural youth',
      descriptionKm: 'ថ្នាក់រៀនកូដកម្មឥតគិតថ្លៃសម្រាប់យុវជនទីជនបទ',
      category: 'Education',
      location: 'Siem Reap',
      status: 'Active',
      volunteers: 12,
      volunteersNeeded: 15,
      fundingGoal: 2000,
      fundingCurrent: 1800,
      impact: '100+ youth trained',
      creator: 'Chea Dara',
      createdDate: '2025-11-15',
      icon: '💻',
    },
    {
      id: '3',
      title: 'Community Garden Project',
      titleKm: 'គម្រោងសួនសហគមន៍',
      description: 'Transform vacant lot into community vegetable garden',
      descriptionKm: 'ប្តូរដីទទេទៅជាសួនបន្លែសហគមន៍',
      category: 'Environment',
      location: 'Phnom Penh',
      status: 'Planning',
      volunteers: 8,
      volunteersNeeded: 20,
      fundingGoal: 1500,
      fundingCurrent: 600,
      impact: 'Fresh produce for 50 families',
      creator: 'Lim Bopha',
      createdDate: '2025-12-10',
      icon: '🌱',
    },
  ]);

  reportedIssues = signal<Issue[]>([
    {
      id: '1',
      title: 'Broken street lights on Main Road',
      description: 'Multiple street lights not working, safety concern',
      category: 'Infrastructure',
      location: 'Daun Penh',
      priority: 'High',
      status: 'Reported',
      reportedBy: 'Anonymous',
      reportedDate: '2025-12-15',
      votes: 45,
    },
    {
      id: '2',
      title: 'Trash accumulation near school',
      description: 'Need proper waste management solution',
      category: 'Environment',
      location: 'Chamkar Mon',
      priority: 'Medium',
      status: 'In Progress',
      reportedBy: 'Youth Group',
      reportedDate: '2025-12-10',
      votes: 32,
    },
  ]);

  myContributions = signal([
    { project: 'Clean Water Initiative', role: 'Volunteer', hours: 12 },
    { project: 'Coding Bootcamp', role: 'Mentor', hours: 8 },
  ]);
}
