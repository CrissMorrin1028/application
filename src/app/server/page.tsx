import { writeFile } from 'fs/promises'
import { join } from 'path'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import InspectModule from 'docxtemplater/js/inspect-module.js'

export default function ServerUploadPage() {
  async function upload(data: FormData) {
    'use server'

    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      throw new Error('No file uploaded')
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const zip = new PizZip(buffer)
    const iModule = new InspectModule()
    const doc = new Docxtemplater(zip, {
      modules: [iModule],
      paragraphLoop: true,
      linebreaks: true,
    })

    doc.render()
    const tags = iModule.getAllTags()
    const placeholdersPath = join(process.cwd(), 'public', 'placeholders.json')
    await writeFile(placeholdersPath, JSON.stringify(tags, null, 2))

    return { success: true }
  }

  return (
    <form action="/api/upload" method="post" encType="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  )
}