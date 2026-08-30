export interface Project {
  id: string
  title: string
  highlightWord: string
  category: 'ai' | 'fullstack' | 'systems'
  description: string
  githubUrl?: string
  liveUrl?: string
  images?: string[]
  accent: string   // background color for the card image area
}

export const projects: Project[] = [
  {
    id: 'seizure-detection',
    title: 'Deep Learning Seizure Detection',
    highlightWord: 'Learning',
    category: 'ai',
    description: 'A spiking neural network that flags seizures from raw EEG signals in real time.',
    accent: '#dce8f7',   // medical blue
    githubUrl: 'https://github.com/RonenYakov/seizure-detection',
    images: [
      '/projects/seizure-detection/{A0D55C70-8636-452C-B010-7BBDA997E3C1}.png',
      '/projects/seizure-detection/{344A3D40-52FE-4CF7-B659-23C8C837098E}.png',
    ],
  },
  {
    id: 'text-classification',
    title: 'AI vs Human Text Classifier',
    highlightWord: 'Human',
    category: 'ai',
    description: 'Fine-tuned XLM-RoBERTa that tells machine-written text from human writing, benchmarked against classical ML.',
    accent: '#ede8f7',   // soft purple / NLP
    githubUrl: 'https://github.com/RonenYakov/human-vs-machine-text-classification-',
    images: [
      '/projects/text-classification/{D4E53499-DB45-41B5-A0A5-A2387C5B375B}.png',
      '/projects/text-classification/{BCC628CA-8A1F-4386-B16E-40CD11B1DD08}.png',
      '/projects/text-classification/{E436A91F-6EA3-4847-8839-3813E693EF33}.png',
    ],
  },
  {
    id: 'social-platform',
    title: 'Social Media Manager Platform',
    highlightWord: 'Media',
    category: 'fullstack',
    description: 'A fullstack site with a built-in CMS so the client can update her portfolio and content herself.',
    accent: '#fdf0e0',   // warm cream / social
    githubUrl: 'https://github.com/RonenYakov/social-platform',
    liveUrl: 'https://shani-page.vercel.app/',
    images: [
      '/projects/social-platform/hero-new.jpg',
      '/projects/social-platform/testimonials-new.jpg',
      '/projects/social-platform/{56E30E6B-2EA9-442D-88A8-573A25464117}.png',
    ],
  },
  {
    id: 'url-shortener',
    title: 'Tiny URL Shortener',
    highlightWord: 'URL',
    category: 'fullstack',
    description: 'A fast link shortener with a Node backend and its own client, containerized with Docker.',
    accent: '#e0f7f0',   // teal / dev tool
    githubUrl: 'https://github.com/RonenYakov/url-shortener',
    liveUrl: 'https://url-shortener-one-gules.vercel.app/',
    images: ['/projects/url-shortener/preview.jpg'],
  },
  {
    id: 'challenge-tracker',
    title: '60 Day Challenge Tracker',
    highlightWord: 'Challenge',
    category: 'fullstack',
    description: 'A self-directed accountability app in the spirit of 75 Hard, with custom rules, streaks, and grace tokens.',
    accent: '#f5f0e8',   // warm sand
    githubUrl: 'https://github.com/RonenYakov/challenge-tracker',
    liveUrl: 'https://challenge-tracker-ronens-projects-b6987686.vercel.app',
    images: ['/projects/challenge-tracker/preview.jpg'],
  },
  {
    id: 'vote-match',
    title: 'Israeli Vote Match',
    highlightWord: 'Vote',
    category: 'fullstack',
    description: 'A 16-question quiz that matches your answers to the closest Knesset parties, no spin, just data.',
    accent: '#e8ecf7',   // navy-tinted blue
    liveUrl: 'https://israel-vote-match.vercel.app/',
    images: ['/projects/vote-match/preview.jpg'],
  },
  {
    id: 'graph-server',
    title: 'Multithreaded Graph Server',
    highlightWord: 'Graph',
    category: 'systems',
    description: 'A TCP server that computes shortest paths for concurrent clients over a shared graph.',
    accent: '#e2f0e8',
    githubUrl: 'https://github.com/RonenYakov/MuMultiThreaded-Graph-Server-',
    images: ['/projects/graph-server/preview.png'],
  },
  {
    id: 'resnet-fashion',
    title: 'ResNet on FashionMNIST',
    highlightWord: 'Fashion',
    category: 'ai',
    description: 'A ResNet trained from scratch on FashionMNIST to compare against transfer-learning baselines.',
    accent: '#f7e8f0',   // dusty rose / fashion ML
    githubUrl: 'https://github.com/RonenYakov/DeepLearning-ResNet-',
    images: [
      '/projects/resnet-fashion/{7AE1AF1C-8B69-4184-A3EB-CB8C647FCA49}.png',
      '/projects/resnet-fashion/{516C842E-FFD4-42A4-BCF8-FFF816F21914}.png',
      '/projects/resnet-fashion/{F9398780-10E6-4DF7-9EF5-61439F6DE908}.png',
    ],
  },
  {
    id: 'stock-trading-agent',
    title: 'Stock Trading Agent',
    highlightWord: 'Trading',
    category: 'ai',
    description: 'A reinforcement-learning agent that trades on historical price data and tracks its own reward curve.',
    accent: '#e8f0e8',
    githubUrl: 'https://github.com/RonenYakov/Stock-Trading-Agent',
    images: ['/projects/stock-trading-agent/preview.png'],
  },
  {
    id: 'wedding-invitation',
    title: 'Wedding Invitation Site',
    highlightWord: 'Wedding',
    category: 'fullstack',
    description: 'A mobile-first invitation site with RSVP, gallery, and map, built for a real wedding.',
    accent: '#f5f0eb',
    githubUrl: 'https://github.com/RonenYakov/wedding-invitation',
    liveUrl: 'https://wedding-invitation-t-b.vercel.app/',
    images: [
      '/projects/wedding-invitation/{BC787B06-F313-42C4-8F63-7464684BFFAC}.png',
      '/projects/wedding-invitation/{33EA357A-F83A-4072-A5B5-D1C3A9F0DE43}.png',
      '/projects/wedding-invitation/{6A0A0324-586D-42C6-AD96-07E73C5B5C91}.png',
    ],
  },
  {
    id: 'assembly-project',
    title: 'Prime Checker & Caesar Cipher',
    highlightWord: 'Caesar',
    category: 'systems',
    description: 'An x86 assembly program that checks primality and encodes text with a Caesar cipher.',
    accent: '#f0ede8',
    githubUrl: 'https://github.com/RonenYakov/Assembly-Project',
    images: ['/projects/assembly-project/preview.png'],
  },
  {
    id: 'interactive-interpreter',
    title: 'Interactive Script Interpreter',
    highlightWord: 'Script',
    category: 'systems',
    description: 'A custom interpreter that parses and executes its own scripting language from the command line.',
    accent: '#e8edf0',   // cool slate / interpreter
    githubUrl: 'https://github.com/RonenYakov/Interactive-Interpreter',
  },
]
