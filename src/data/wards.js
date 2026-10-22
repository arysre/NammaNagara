export const wards = [
  { id: 'all', label: 'All Bengaluru', coords: [12.9716, 77.5946] },
  { id: 'ward-151', label: 'Ward 151 · Koramangala', coords: [12.9346, 77.6113] },
  { id: 'ward-174', label: 'Ward 174 · HSR Layout', coords: [12.9166, 77.6388] },
  { id: 'ward-80', label: 'Ward 80 · Indiranagar', coords: [12.9719, 77.6412] },
  { id: 'ward-154', label: 'Ward 154 · Jayanagar', coords: [12.925, 77.5838] },
  { id: 'ward-84', label: 'Ward 84 · Whitefield', coords: [12.9698, 77.75] },
  { id: 'ward-4', label: 'Ward 4 · Yelahanka', coords: [13.1007, 77.5963] },
  { id: 'ward-19', label: 'Ward 19 · Hebbal', coords: [13.0358, 77.597] },
  { id: 'ward-188', label: 'Ward 188 · BTM Layout', coords: [12.9166, 77.6101] },
  { id: 'ward-65', label: 'Ward 65 · Malleshwaram', coords: [13.0031, 77.5704] },
]

export const departments = [
  'All departments',
  'Roads',
  'Solid waste',
  'BESCOM',
  'BWSSB',
  'Traffic',
  'Parks and trees',
]

export const wardName = (id) => wards.find((ward) => ward.id === id)?.label.replace(/^Ward \d+ · /, '') || 'Bengaluru'
export const wardCoordinates = (id) => wards.find((ward) => ward.id === id)?.coords || wards[0].coords
