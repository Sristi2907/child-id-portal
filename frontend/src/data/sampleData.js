// Fake data for building the UI. It will be replaced by backend data later.
export const PARENT_DATA = {
  children: [
    { id: 'C-1001', name: 'Aarav', age: 7, registeredOn: '02 Nov 2026', status: 'Verified' },
    { id: 'C-1002', name: 'Meera', age: 5, registeredOn: '04 Nov 2026', status: 'Pending' },
  ],
  location: [
    { id: 'L-1', child: 'Aarav', place: 'Railway station area', seenAt: 'Today, 10:42 AM' },
    { id: 'L-2', child: 'Meera', place: 'Market area', seenAt: 'Today, 09:15 AM' },
  ],
  cases: [
    { id: 'K-210', child: 'Aarav', openedOn: '02 Nov 2026', status: 'Open' },
    { id: 'K-198', child: 'Meera', openedOn: '21 Oct 2026', status: 'Closed' },
  ],
  consents: [
    { id: 'R-55', child: 'Aarav', requestedBy: 'Operator 03', requestedOn: '02 Nov 2026', status: 'Waiting' },
    { id: 'R-56', child: 'Meera', requestedBy: 'Operator 01', requestedOn: '04 Nov 2026', status: 'Waiting' },
    { id: 'R-41', child: 'Aarav', requestedBy: 'Operator 03', requestedOn: '20 Oct 2026', status: 'Approved' },
  ],
  jobs: [
    { id: 'J-9001', child: 'Aarav', type: 'Fingerprint match', startedOn: '04 Nov 2026', status: 'Completed', result: 'No match' },
    { id: 'J-9002', child: 'Meera', type: 'Fingerprint match', startedOn: '05 Nov 2026', status: 'Running', result: '-' },
  ],
}