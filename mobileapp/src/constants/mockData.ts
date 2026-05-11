export interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  rating: number;
  enrolledCount: number;
  isPremium: boolean;
  category: string;
  thumbnail: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked: boolean;
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
}

export const CATEGORIES = ['All', 'Criminal Law', 'Civil Law', 'IPC', 'Family Law', 'Corporate Law'];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Mastering Indian Penal Code (IPC)',
    instructor: 'Adv. Rajesh Kumar',
    price: 2499,
    rating: 4.8,
    enrolledCount: 1250,
    isPremium: true,
    category: 'IPC',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    description: 'A comprehensive guide to the Indian Penal Code, covering all major sections and landmark judgments.',
  },
  {
    id: '2',
    title: 'Civil Procedure Code (CPC) Essentials',
    instructor: 'Dr. Anita Sharma',
    price: 1999,
    rating: 4.6,
    enrolledCount: 850,
    isPremium: false,
    category: 'Civil Law',
    thumbnail: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
    description: 'Learn the fundamentals of civil litigation in India, from filing a suit to execution of decree.',
  },
  {
    id: '3',
    title: 'Criminal Procedure Code (CrPC) for Beginners',
    instructor: 'Adv. Vikram Singh',
    price: 2199,
    rating: 4.9,
    enrolledCount: 2100,
    isPremium: true,
    category: 'Criminal Law',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    description: 'Understand the lifecycle of a criminal case, including investigation, trial, and sentencing.',
  },
];

export const MOCK_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Module 1: Introduction',
    lessons: [
      { id: 'l1', title: 'Welcome & Overview', duration: '5:30', isLocked: false, videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' },
      { id: 'l2', title: 'Basics of Legal Research', duration: '12:45', isLocked: true },
    ],
  },
  {
    id: 'm2',
    title: 'Module 2: Core Concepts',
    lessons: [
      { id: 'l3', title: 'Understanding Sections 1-10', duration: '15:20', isLocked: true },
      { id: 'l4', title: 'Case Study: State vs. XYZ', duration: '20:10', isLocked: true },
    ],
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    user: 'Amit Patel',
    avatar: 'https://i.pravatar.cc/150?u=amit',
    rating: 5,
    comment: 'Exceptional course! The instructor explains complex concepts with ease.',
  },
  {
    id: 'r2',
    user: 'Priya Sundar',
    avatar: 'https://i.pravatar.cc/150?u=priya',
    rating: 4,
    comment: 'Very informative. Could use more practical examples.',
  },
];

export const USER_DATA = {
  name: 'Sakthivasan',
  email: 'sakthi@lawapp.com',
  avatar: 'https://i.pravatar.cc/150?u=sakthi',
  walletBalance: 1250,
  watchProgress: 65,
  enrolledCourses: [
    { id: '1', title: 'Mastering IPC', progress: 0.75, thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' },
    { id: '3', title: 'CrPC for Beginners', progress: 0.30, thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80' },
  ],
};
