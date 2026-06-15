export const STAGE_COLORS = {
  preprocess: '#4fc3f7',
  lead: '#ffb74d',
  zinc: '#ef5350',
};

export const nodes = [
  { id: '原矿', label: '原矿', stage: 'preprocess', pos: [-13, 0, 2.4] },
  { id: '球磨机', label: '球磨机/旋流器', stage: 'preprocess', pos: [-9.5, 0, 2.4] },
  { id: '铅快粗选', label: '铅快粗选', stage: 'lead', pos: [-6, 0, 2.4] },
  { id: '铅粗选', label: '铅粗选', stage: 'lead', pos: [-2.5, 0, 2.4] },
  { id: '铅扫选', label: '铅扫选', stage: 'lead', pos: [1, 0, 2.4] },
  { id: '铅快精选', label: '铅快精选', stage: 'lead', pos: [-2.5, 1.2, 4.7] },
  { id: '铅精选', label: '铅精选', stage: 'lead', pos: [1, 1.2, 4.7] },
  { id: '铅精矿', label: '铅精矿', stage: 'lead', product: true, pos: [4.6, 1.4, 2.4] },
  { id: '锌快粗选', label: '锌快粗选', stage: 'zinc', pos: [1, 0, -2.4] },
  { id: '锌粗选', label: '锌粗选', stage: 'zinc', pos: [-2.5, 0, -2.4] },
  { id: '锌扫选', label: '锌扫选', stage: 'zinc', pos: [-6, 0, -2.4] },
  { id: '锌精选', label: '锌精选', stage: 'zinc', pos: [-9.5, 0, -2.4] },
  { id: '锌精矿', label: '锌精矿', stage: 'zinc', product: true, pos: [-13, 1.4, -2.4] },
];

export const links = [
  { from: '原矿', to: '球磨机', type: 'slurry' },
  { from: '球磨机', to: '铅快粗选', type: 'slurry' },
  { from: '铅快粗选', to: '铅粗选', type: 'slurry' },
  { from: '铅粗选', to: '铅扫选', type: 'slurry' },
  { from: '铅扫选', to: '锌快粗选', type: 'slurry' },
  { from: '锌快粗选', to: '锌粗选', type: 'slurry' },
  { from: '锌粗选', to: '锌扫选', type: 'slurry' },
  { from: '锌扫选', to: '锌精选', type: 'slurry' },
  { from: '铅快粗选', to: '铅快精选', type: 'foam' },
  { from: '铅快精选', to: '铅精选', type: 'foam' },
  { from: '铅精选', to: '铅精矿', type: 'foam' },
  { from: '锌精选', to: '锌精矿', type: 'foam' },
];

export const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
