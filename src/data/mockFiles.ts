import { FileMetadata, FileType, FileCategory } from '../types';

const fileDescriptions: Record<FileCategory, string[]> = {
  pdf: [
    'Annual financial report with detailed analysis',
    'User manual for software installation',
    'Research paper on machine learning algorithms',
    'Project proposal for new initiative',
    'Technical documentation for API integration'
  ],
  doc: [
    'Meeting notes from quarterly review',
    'Draft proposal for client presentation',
    'Employee handbook updates',
    'Marketing strategy document',
    'Product requirements specification'
  ],
  docx: [
    'Contract template for new vendors',
    'Training materials for new employees',
    'Business plan for next fiscal year',
    'Policy updates and procedures',
    'Project timeline and milestones'
  ],
  txt: [
    'Configuration settings for deployment',
    'Log file from system monitoring',
    'Notes from brainstorming session',
    'Quick reference guide',
    'Troubleshooting checklist'
  ],
  jpg: [
    'Product photography for catalog',
    'Team photo from company retreat',
    'Screenshot of application interface',
    'Marketing banner for social media',
    'Event photos from conference'
  ],
  png: [
    'Logo design with transparent background',
    'UI mockup for mobile application',
    'Infographic for presentation',
    'Icon set for web interface',
    'Chart visualization of data'
  ],
  svg: [
    'Vector illustration for website',
    'Scalable icon for application',
    'Logo design in vector format',
    'Diagram for technical documentation',
    'Graphic element for user interface'
  ],
  ts: [
    'TypeScript utility functions',
    'API service layer implementation',
    'Custom React hook for data fetching',
    'Type definitions for application',
    'Configuration file for build process'
  ],
  tsx: [
    'React component for user interface',
    'Page component with routing logic',
    'Custom hook with TypeScript types',
    'Layout component for application',
    'Form component with validation'
  ],
  js: [
    'JavaScript utility functions',
    'Legacy code for compatibility',
    'Build script for deployment',
    'Configuration file for tools',
    'Helper functions for data processing'
  ],
  jsx: [
    'React component in JavaScript',
    'Legacy component for migration',
    'Third-party integration component',
    'Prototype component for testing',
    'Simple UI component'
  ],
  json: [
    'Configuration data for application',
    'API response sample data',
    'Translation files for localization',
    'Package dependencies manifest',
    'Test data for unit testing'
  ],
  csv: [
    'Sales data for quarterly analysis',
    'User analytics and metrics',
    'Product inventory spreadsheet',
    'Employee contact information',
    'Financial transactions log'
  ]
};

const fileNames: Record<FileCategory, string[]> = {
  pdf: [
    'annual-report-2024', 'user-manual-v2', 'research-paper-ml', 'project-proposal',
    'api-documentation', 'financial-analysis', 'technical-specs', 'compliance-report',
    'training-guide', 'security-policy'
  ],
  doc: [
    'meeting-notes-q4', 'client-proposal-draft', 'employee-handbook', 'marketing-strategy',
    'requirements-doc', 'project-plan', 'budget-analysis', 'performance-review',
    'policy-update', 'vendor-agreement'
  ],
  docx: [
    'contract-template', 'training-materials', 'business-plan-2025', 'procedures-manual',
    'project-timeline', 'risk-assessment', 'quality-standards', 'operational-guide',
    'strategic-plan', 'compliance-checklist'
  ],
  txt: [
    'config-settings', 'system-log', 'brainstorm-notes', 'quick-reference',
    'troubleshooting-guide', 'deployment-notes', 'server-config', 'backup-log',
    'error-messages', 'changelog'
  ],
  jpg: [
    'product-photo-001', 'team-retreat-2024', 'app-screenshot', 'social-banner',
    'conference-photos', 'office-space', 'product-demo', 'event-coverage',
    'marketing-material', 'presentation-slide'
  ],
  png: [
    'company-logo-transparent', 'mobile-mockup', 'data-infographic', 'icon-set-v3',
    'sales-chart', 'ui-components', 'workflow-diagram', 'feature-comparison',
    'user-journey-map', 'dashboard-preview'
  ],
  svg: [
    'website-illustration', 'app-icon-scalable', 'vector-logo', 'technical-diagram',
    'ui-graphic-element', 'process-flowchart', 'organizational-chart', 'system-architecture',
    'brand-elements', 'navigation-icons'
  ],
  ts: [
    'utils', 'api-service', 'data-hooks', 'type-definitions',
    'build-config', 'validation-schemas', 'constants', 'helpers',
    'middleware', 'error-handlers'
  ],
  tsx: [
    'UserProfile', 'Dashboard', 'FileManager', 'Navigation',
    'SearchForm', 'DataTable', 'Modal', 'Layout',
    'Header', 'Sidebar'
  ],
  js: [
    'legacy-utils', 'build-script', 'tool-config', 'data-processor',
    'compatibility-layer', 'polyfills', 'vendor-integration', 'analytics',
    'performance-monitor', 'cache-manager'
  ],
  jsx: [
    'LegacyComponent', 'ThirdPartyWidget', 'PrototypeView', 'SimpleButton',
    'BasicForm', 'ListItem', 'Card', 'Badge',
    'Tooltip', 'Spinner'
  ],
  json: [
    'app-config', 'api-response-sample', 'translations-en', 'package',
    'test-data', 'schema-definition', 'environment-vars', 'feature-flags',
    'user-preferences', 'cache-manifest'
  ],
  csv: [
    'sales-q4-2024', 'user-analytics', 'product-inventory', 'employee-contacts',
    'transaction-log', 'performance-metrics', 'survey-results', 'budget-breakdown',
    'customer-feedback', 'market-research'
  ]
};

const tags = [
  'important', 'draft', 'review', 'archived', 'public', 'private',
  'urgent', 'completed', 'in-progress', 'deprecated', 'experimental',
  'production', 'development', 'testing', 'documentation', 'backup'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomSize(): number {
  // Generate realistic file sizes (in bytes)
  const sizeRanges = [
    { min: 1024, max: 10240 }, // 1KB - 10KB (small files)
    { min: 10240, max: 102400 }, // 10KB - 100KB (medium files)
    { min: 102400, max: 1048576 }, // 100KB - 1MB (large files)
    { min: 1048576, max: 10485760 }, // 1MB - 10MB (very large files)
  ];
  
  const range = getRandomElement(sizeRanges);
  return Math.floor(Math.random() * (range.max - range.min) + range.min);
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getCategoryType(category: FileCategory): FileType {
  if (['pdf', 'doc', 'docx', 'txt'].includes(category)) return 'document';
  if (['jpg', 'png', 'svg'].includes(category)) return 'image';
  if (['ts', 'tsx', 'js', 'jsx'].includes(category)) return 'code';
  if (['json', 'csv'].includes(category)) return 'data';
  return 'document';
}

export function generateMockFiles(count: number = 100): FileMetadata[] {
  const files: FileMetadata[] = [];
  const categories = Object.keys(fileNames) as FileCategory[];
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const type = getCategoryType(category);
    const baseName = getRandomElement(fileNames[category]);
    const description = getRandomElement(fileDescriptions[category]);
    const createdDate = getRandomDate(oneYearAgo, now);
    const modifiedDate = getRandomDate(createdDate, now);
    
    const file: FileMetadata = {
      id: `file-${i + 1}`,
      name: `${baseName}.${category}`,
      extension: category,
      size: getRandomSize(),
      dateCreated: createdDate,
      dateModified: modifiedDate,
      type,
      description,
      tags: getRandomElements(tags, Math.floor(Math.random() * 4) + 1),
      category,
    };

    files.push(file);
  }

  return files.sort((a, b) => a.name.localeCompare(b.name));
}