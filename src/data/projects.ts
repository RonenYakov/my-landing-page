export interface Project {
  id: string
  title: string
  highlightWord: string
  category: 'ai' | 'fullstack' | 'systems'
  githubUrl: string
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
    title: 'Social Media Manager Landing Page',
    highlightWord: 'Media',
    category: 'fullstack',
    accent: '#fdf0e0',   // warm cream / social
    githubUrl: 'https://github.com/RonenYakov/social-platform',
    liveUrl: 'https://shani-page.vercel.app/',
    images: [
      '/projects/social-platform/{13E00A28-E5A6-4CB1-B8E3-95371255CCFD}.png',
      '/projects/social-platform/{77D12F66-F61F-4C65-B57B-06CDE7B03887}.png',
      '/projects/social-platform/{56E30E6B-2EA9-442D-88A8-573A25464117}.png',
    ],
  },
  {
    id: 'graph-server',
    title: 'Multithreaded Graph Server',
    highlightWord: 'Graph',
    category: 'systems',
    accent: '#e2f0e8',
    githubUrl: 'https://github.com/RonenYakov/MuMultiThreaded-Graph-Server-',
    images: ['/projects/graph-server/preview.png'],
  },
  {
    id: 'resnet-fashion',
    title: 'ResNet on FashionMNIST',
    highlightWord: 'Fashion',
    category: 'ai',
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
    accent: '#e8f0e8',
    githubUrl: 'https://github.com/RonenYakov/Stock-Trading-Agent',
    images: ['/projects/stock-trading-agent/preview.png'],
  },
  {
    id: 'wedding-invitation',
    title: 'Wedding Invitation Site',
    highlightWord: 'Wedding',
    category: 'fullstack',
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
    accent: '#f0ede8',
    githubUrl: 'https://github.com/RonenYakov/Assembly-Project',
    images: ['/projects/assembly-project/preview.png'],
  },
  {
    id: 'interactive-interpreter',
    title: 'Interactive Script Interpreter',
    highlightWord: 'Script',
    category: 'systems',
    accent: '#e8edf0',   // cool slate / interpreter
    githubUrl: 'https://github.com/RonenYakov/Interactive-Interpreter',
  },
]
