export const CATEGORIES = [
  { value: 'ANTIBIOTIC', label: 'Antibiotic' },
  { value: 'PAINKILLER', label: 'Painkiller' },
  { value: 'ANTIVIRAL', label: 'Antiviral' },
  { value: 'ANTIFUNGAL', label: 'Antifungal' },
  { value: 'VITAMIN_SUPPLEMENT', label: 'Vitamin / Supplement' },
  { value: 'CARDIOVASCULAR', label: 'Cardiovascular' },
  { value: 'DIABETES', label: 'Diabetes' },
  { value: 'RESPIRATORY', label: 'Respiratory' },
  { value: 'DERMATOLOGICAL', label: 'Dermatological' },
  { value: 'OTHER', label: 'Other' },
];

export const catLabel = (value) =>
  CATEGORIES.find((c) => c.value === value)?.label || value || 'N/A';

export const ROLES = ['STAFF', 'PHARMACIST', 'ADMIN'];
export const ROLE_LABEL = (role) =>
  ({ ADMIN: 'Admin', PHARMACIST: 'Pharmacist', STAFF: 'Staff' })[role] || role || 'Unknown';

export const roleColor = (role) =>
  role === 'ADMIN' ? '#7c3aed' : role === 'PHARMACIST' ? '#0284c7' : '#64748b';

// Turn a backend date string ("2026-08-02") into "02-08-2026"
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const s = String(dateStr);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()}`;
};

// Backend stores yyyy-mm-dd. Convert a JS Date back to that shape.
export const toApiDate = (date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
};
