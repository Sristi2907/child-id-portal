// Display names for each role
export const ROLE_LABELS = {
  admin: 'Admin',
  operator: 'Operator',
  parent: 'Parent',
}

// Sidebar menu for each role, split into groups
export const MENUS = {
  admin: [
    {
      group: 'Dashboard',
      items: [
        { key: 'profile', label: 'Profile' },
        { key: 'health', label: 'System health' },
        { key: 'contracts', label: 'Contracts' },
      ],
    },
    {
      group: 'Records',
      items: [
        { key: 'identities', label: 'Identities' },
        { key: 'cases', label: 'Cases' },
        { key: 'guardians', label: 'Guardians' },
        { key: 'consents', label: 'Consents' },
        { key: 'jobs', label: 'Match Jobs' },
      ],
    },
  ],
  operator: [
    {
      group: 'Dashboard',
      items: [
        { key: 'profile', label: 'Profile' },
        { key: 'health', label: 'System health' },
        { key: 'regchild', label: 'Reg. child' },
        { key: 'newchild', label: 'New child' },
      ],
    },
  ],
  parent: [
    {
      group: 'Dashboard',
      items: [
        { key: 'profile', label: 'Profile' },
        { key: 'health', label: 'System health' },
        { key: 'childs', label: 'Children' },
      ],
    },
    {
      group: 'Records',
      items: [
        { key: 'location', label: 'Location' },
        { key: 'cases', label: 'Cases' },
        { key: 'consents', label: 'Consents' },
        { key: 'jobs', label: 'Match Jobs' },
      ],
    },
  ],
}