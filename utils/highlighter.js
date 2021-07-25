import { getHighlighter } from 'shiki/dist/index.browser.mjs'

async function highlighter () {
  const hl = await getHighlighter({
    theme: 'dark-plus'
  })
  return (rawCode, lang, { fileName }) => {
    const html = hl.codeToHtml(rawCode, lang)
    return fileName ? `<div class="filename">${fileName}</div>` + html : html
  }
}

export default highlighter
