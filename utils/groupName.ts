// utils/groupName.ts
export const getFullGroupName = (group: {
  grade: string
  name: string | null | undefined
}): string => {
  const suffix = group.name?.trim() ? ` - ${group.name}` : ''
  return `${group.grade}${suffix}`
}
