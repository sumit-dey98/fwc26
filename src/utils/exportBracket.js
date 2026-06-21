import { toPng } from 'html-to-image'

async function waitForImages(node) {
  const imgs = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    imgs.map(img => (img.decode ? img.decode().catch(() => { }) : Promise.resolve()))
  )
}

export async function exportBracketPNG(node, targetWidth, filename = 'wc26-bracket.png') {
  if (!node) {
    console.warn('Bracket export: frame node not ready')
    return
  }
  await waitForImages(node)
  const nativeWidth = node.offsetWidth || node.getBoundingClientRect().width
  const pixelRatio = nativeWidth ? targetWidth / nativeWidth : 1

  try {
    const dataUrl = await toPng(node, { pixelRatio, cacheBust: true })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    link.click()
  } catch (err) {
    console.error('Bracket export failed:', err)
  }
}