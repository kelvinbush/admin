// Query key factory for consistent key management
export const queryKeys = {
  // User related queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.users.lists(), JSON.stringify(filters || {})] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: (id: string) => [...queryKeys.users.all, 'profile', id] as const,
    documents: () => [...queryKeys.users.all, 'documents'] as const,
  },
  
  // Loan applications
  loanApplications: {
    all: ['loan-applications'] as const,
    lists: () => [...queryKeys.loanApplications.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.loanApplications.lists(), JSON.stringify(filters || {})] as const,
    details: () => [...queryKeys.loanApplications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.loanApplications.details(), id] as const,
    documents: (id: string) => [...queryKeys.loanApplications.detail(id), 'documents'] as const,
    status: (id: string) => [...queryKeys.loanApplications.detail(id), 'status'] as const,
  },
  
  // Loan products
  loanProducts: {
    all: ['loan-products'] as const,
    lists: () => [...queryKeys.loanProducts.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.loanProducts.lists(), JSON.stringify(filters || {})] as const,
    details: () => [...queryKeys.loanProducts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.loanProducts.details(), id] as const,
    requirements: (id: string) => [...queryKeys.loanProducts.detail(id), 'requirements'] as const,
    fees: (id: string) => [...queryKeys.loanProducts.detail(id), 'fees'] as const,
  },
  
  // Organizations
  organizations: {
    all: ['organizations'] as const,
    lists: () => [...queryKeys.organizations.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.organizations.lists(), JSON.stringify(filters || {})] as const,
    details: () => [...queryKeys.organizations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.organizations.details(), id] as const,
  },
  
  // Partners
  partners: {
    all: ['partners'] as const,
    lists: () => [...queryKeys.partners.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.partners.lists(), JSON.stringify(filters || {})] as const,
    details: () => [...queryKeys.partners.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.partners.details(), id] as const,
  },
  
  // User groups
  userGroups: {
    all: ['user-groups'] as const,
    lists: () => [...queryKeys.userGroups.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.userGroups.lists(), JSON.stringify(filters || {})] as const,
    details: () => [...queryKeys.userGroups.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.userGroups.details(), id] as const,
    permissions: (id: string) => [...queryKeys.userGroups.detail(id), 'permissions'] as const,
  },
  
  // Dashboard analytics
  dashboard: {
    all: ['dashboard'] as const,
    overview: () => [...queryKeys.dashboard.all, 'overview'] as const,
    analytics: () => [...queryKeys.dashboard.all, 'analytics'] as const,
    loanAnalytics: () => [...queryKeys.dashboard.analytics(), 'loan'] as const,
    smeAnalytics: () => [...queryKeys.dashboard.analytics(), 'sme'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },
  
  // Documents
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.documents.lists(), JSON.stringify(filters || {})] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.documents.details(), id] as const,
    user: (userId: string) => [...queryKeys.documents.all, 'user', userId] as const,
    application: (applicationId: string) => [...queryKeys.documents.all, 'application', applicationId] as const,
  },
  
  // Search
  search: {
    all: ['search'] as const,
    users: (query: string) => [...queryKeys.search.all, 'users', query] as const,
    loanApplications: (query: string) => [...queryKeys.search.all, 'loan-applications', query] as const,
    organizations: (query: string) => [...queryKeys.search.all, 'organizations', query] as const,
  },
} as const;
