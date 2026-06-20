/** Conditional className helper — no external dep needed */
export const cn = (...args) =>
  args
    .flat(Infinity)
    .filter(a => a && typeof a === 'string')
    .join(' ')
