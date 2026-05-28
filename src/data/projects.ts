export interface Project {
  id: string
  title: string
  highlightWord: string
  category: 'ai' | 'fullstack' | 'systems'
  githubUrl: string
  image?: string
}

export const projects: Project[] = [
  {
    id: 'seizure-detection',
    title: 'Deep Learning Seizure Detection',
    highlightWord: 'Learning',
    category: 'ai',
    githubUrl: 'https://github.com/RonenYakov/seizure-detection',
  },
  {
    id: 'text-classification',
    title: 'AI vs Human Text Classifier',
    highlightWord: 'Human',
    category: 'ai',
    githubUrl: 'https://github.com/RonenYakov/text-classification',
  },
  {
    id: 'social-platform',
    title: 'Social Media Management Platform',
    highlightWord: 'Media',
    category: 'fullstack',
    githubUrl: 'https://github.com/RonenYakov/social-platform',
  },
  {
    id: 'graph-server',
    title: 'Multithreaded Graph Server',
    highlightWord: 'Graph',
    category: 'systems',
    githubUrl: 'https://github.com/RonenYakov/graph-server',
  },
  {
    id: 'resnet-fashion',
    title: 'ResNet on FashionMNIST',
    highlightWord: 'Fashion',
    category: 'ai',
    githubUrl: 'https://github.com/RonenYakov/resnet-fashion',
  },
]
