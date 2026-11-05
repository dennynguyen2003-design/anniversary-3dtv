import manifest from './manifest.json'

const a = manifest.albums as Record<string, string[]>

export const albums: { id: string; title: string; files: string[] }[] = [
  { id: 'team-building', title: 'Team building', files: a['team-building'] },
  { id: 'noel-2025', title: 'Noel 2025', files: a['noel-2025'] },
  { id: 'tap-the-2026', title: 'Đại gia đình 3DTV', files: a['tap-the-2026'] },
  { id: 'khoanh-khac-3dtv', title: 'Khoảnh khắc 3DTV', files: a['khoanh-khac-3dtv'] },
]

export const albumFiles = (id: string): string[] => albums.find((x) => x.id === id)?.files ?? []
