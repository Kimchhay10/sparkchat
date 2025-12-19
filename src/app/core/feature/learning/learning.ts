import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from '../../../shared/ui/button/button';

interface Course {
  id: string;
  title: string;
  titleKm: string;
  description: string;
  descriptionKm: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  progress?: number;
  thumbnail: string;
  instructor: string;
  rating: number;
}

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [CommonModule, TranslateModule, Button],
  templateUrl: './learning.html',
  styleUrl: './learning.css',
})
export class LearningComponent {
  stats = signal([
    {
      label: 'Enrolled Courses',
      value: '12',
      icon: '📚',
      trend: '+3 this month',
    },
    { label: 'Hours Learned', value: '48', icon: '⏱️', trend: '+12 this week' },
    { label: 'Certificates', value: '5', icon: '🏆', trend: '2 in progress' },
    { label: 'Skill Score', value: '850', icon: '⭐', trend: 'Top 10%' },
  ]);

  categories = signal([
    { name: 'Coding', icon: '💻', courses: 45, color: 'bg-blue-500' },
    {
      name: 'Digital Marketing',
      icon: '📱',
      courses: 32,
      color: 'bg-purple-500',
    },
    { name: 'Design', icon: '🎨', courses: 28, color: 'bg-pink-500' },
    { name: 'Business', icon: '💼', courses: 38, color: 'bg-green-500' },
    { name: 'English', icon: '🗣️', courses: 25, color: 'bg-yellow-500' },
    { name: 'Soft Skills', icon: '🤝', courses: 20, color: 'bg-orange-500' },
  ]);

  featuredCourses = signal<Course[]>([
    {
      id: '1',
      title: 'Web Development Fundamentals',
      titleKm: 'មូលដ្ឋានគ្រឹះនៃការអភិវឌ្ឍគេហទំព័រ',
      description: 'Learn HTML, CSS, and JavaScript from scratch',
      descriptionKm: 'រៀន HTML, CSS និង JavaScript ពីផ្នែកគ្រឹះ',
      category: 'Coding',
      level: 'Beginner',
      duration: '8 weeks',
      students: 1250,
      progress: 60,
      thumbnail: '💻',
      instructor: 'Sok Dara',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Digital Marketing Mastery',
      titleKm: 'ជំនាញទីផ្សារឌីជីថល',
      description: 'Master social media, SEO, and content marketing',
      descriptionKm: 'ជំនាញទីផ្សារលើបណ្តាញសង្គម SEO និងទីផ្សារមាតិកា',
      category: 'Marketing',
      level: 'Intermediate',
      duration: '6 weeks',
      students: 980,
      progress: 30,
      thumbnail: '📱',
      instructor: 'Chea Sreymom',
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Business English Communication',
      titleKm: 'ការទំនាក់ទំនងអាជីវកម្មជាភាសាអង់គ្លេស',
      description: 'Professional English for workplace success',
      descriptionKm: 'ភាសាអង់គ្លេសវិជ្ជាជីវៈសម្រាប់ជោគជ័យនៅកន្លែងធ្វើការ',
      category: 'English',
      level: 'Intermediate',
      duration: '10 weeks',
      students: 2100,
      thumbnail: '🗣️',
      instructor: 'Lim Bopha',
      rating: 4.7,
    },
  ]);

  enrolledCourses = signal<Course[]>([
    {
      id: '1',
      title: 'Web Development Fundamentals',
      titleKm: 'មូលដ្ឋានគ្រឹះនៃការអភិវឌ្ឍគេហទំព័រ',
      description: 'Learn HTML, CSS, and JavaScript',
      descriptionKm: 'រៀន HTML, CSS និង JavaScript',
      category: 'Coding',
      level: 'Beginner',
      duration: '8 weeks',
      students: 1250,
      progress: 60,
      thumbnail: '💻',
      instructor: 'Sok Dara',
      rating: 4.8,
    },
  ]);
}
