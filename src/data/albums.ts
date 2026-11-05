import manifest from './manifest.json'

const a = manifest.albums as Record<string, string[]>

export const albums: { id: string; title: string; files: string[] }[] = [
  { id: 'team-building', title: 'Team building', files: a['team-building'] },
  { id: 'noel-2025', title: 'Noel 2025', files: a['noel-2025'] },
  { id: 'tap-the-2026', title: 'Đại gia đình 3DTV', files: a['tap-the-2026'] },
]
