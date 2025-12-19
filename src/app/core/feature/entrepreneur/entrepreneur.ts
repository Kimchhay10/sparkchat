import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from '../../../shared/ui/button/button';

interface StartupIdea {
  id: string;
  title: string;
  titleKm: string;
  description: string;
  category: string;
  stage: 'Idea' | 'Planning' | 'MVP' | 'Launch' | 'Growth';
  founder: string;
  teamSize: number;
  fundingNeeded: number;
  mentors: number;
  icon: string;
}

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  company: string;
  experience: string;
  availability: string;
  rating: number;
  sessionsCompleted: number;
  avatar: string;
}

interface FundingOpportunity {
  id: string;
  title: string;
  type: 'Grant' | 'Competition' | 'Investor' | 'Accelerator';
  amount: string;
  deadline: string;
  eligibility: string;
  provider: string;
}

@Component({
  selector: 'app-entrepreneur',
  standalone: true,
  imports: [CommonModule, TranslateModule, Button],
  templateUrl: './entrepreneur.html',
  styleUrl: './entrepreneur.css',
})
export class EntrepreneurComponent {
  stats = signal([
    {
      label: 'Active Startups',
      value: '342',
      icon: '🚀',
      trend: '+28 this month',
    },
    {
      label: 'Mentors Available',
      value: '89',
      icon: '👨‍🏫',
      trend: '+12 new this week',
    },
    {
      label: 'Funding Secured',
      value: '$2.3M',
      icon: '💰',
      trend: '+$450K this quarter',
    },
    { label: 'Success Rate', value: '67%', icon: '📈', trend: 'Above average' },
  ]);

  categories = signal([
    { name: 'Tech', icon: '💻', startups: 85, color: 'bg-blue-500' },
    { name: 'E-commerce', icon: '🛒', startups: 62, color: 'bg-purple-500' },
    { name: 'Agriculture', icon: '🌾', startups: 45, color: 'bg-green-500' },
    { name: 'Education', icon: '📚', startups: 58, color: 'bg-yellow-500' },
    { name: 'Health', icon: '⚕️', startups: 32, color: 'bg-red-500' },
    { name: 'Social', icon: '🤝', startups: 40, color: 'bg-pink-500' },
  ]);

  featuredStartups = signal<StartupIdea[]>([
    {
      id: '1',
      title: 'FarmTech Cambodia',
      titleKm: 'បច្ចេកវិទ្យាកសិកម្មកម្ពុជា',
      description:
        'Mobile app connecting farmers with modern agricultural techniques',
      category: 'Agriculture',
      stage: 'MVP',
      founder: 'Sok Pisey',
      teamSize: 4,
      fundingNeeded: 10000,
      mentors: 2,
      icon: '🌾',
    },
    {
      id: '2',
      title: 'KhmerLearn',
      titleKm: 'ខ្មែររៀន',
      description: 'Online learning platform for Cambodian students',
      category: 'Education',
      stage: 'Launch',
      founder: 'Chea Dara',
      teamSize: 6,
      fundingNeeded: 15000,
      mentors: 3,
      icon: '📚',
    },
    {
      id: '3',
      title: 'LocalCraft Marketplace',
      titleKm: 'ផ្សារសិប្បកម្មក្នុងស្រុក',
      description: 'E-commerce for Cambodian artisans and crafts',
      category: 'E-commerce',
      stage: 'Growth',
      founder: 'Lim Bopha',
      teamSize: 8,
      fundingNeeded: 25000,
      mentors: 4,
      icon: '🎨',
    },
  ]);

  topMentors = signal<Mentor[]>([
    {
      id: '1',
      name: 'Dr. Sokha Phan',
      expertise: ['Business Strategy', 'Marketing', 'Fundraising'],
      company: 'Tech Startup Inc.',
      experience: '15 years',
      availability: 'Weekly sessions',
      rating: 4.9,
      sessionsCompleted: 124,
      avatar: '👨‍💼',
    },
    {
      id: '2',
      name: 'Sreymom Chea',
      expertise: ['Product Development', 'UX Design', 'Tech'],
      company: 'Innovation Labs',
      experience: '10 years',
      availability: 'Bi-weekly',
      rating: 4.8,
      sessionsCompleted: 89,
      avatar: '👩‍💻',
    },
  ]);

  fundingOpportunities = signal<FundingOpportunity[]>([
    {
      id: '1',
      title: 'Youth Innovation Fund',
      type: 'Grant',
      amount: '$5,000 - $15,000',
      deadline: '2026-02-28',
      eligibility: 'Youth-led startups under 2 years',
      provider: 'Cambodia Development Fund',
    },
    {
      id: '2',
      title: 'ASEAN Startup Competition',
      type: 'Competition',
      amount: '$50,000 prize',
      deadline: '2026-03-15',
      eligibility: 'Tech startups in ASEAN region',
      provider: 'ASEAN Foundation',
    },
  ]);

  learningResources = signal([
    { title: 'Business Plan Template', type: 'Document', icon: '📄' },
    { title: 'Pitch Deck Guide', type: 'Video', icon: '🎥' },
    { title: 'Financial Modeling', type: 'Course', icon: '📊' },
    { title: 'Legal Basics', type: 'Guide', icon: '⚖️' },
  ]);
}
