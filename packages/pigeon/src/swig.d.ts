declare module 'swig-templates' {
  const renderFile: (path: string, data: Record<string, any>) => string

  const setDefaults: (any) => void
}
