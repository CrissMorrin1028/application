import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import InspectModule from 'docxtemplater/js/inspect-module.js'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
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
  const tags = iModule.getAllTags() // Extraer placeholders

  // Opcional: Guardar los placeholders localmente
  const placeholdersPath = join(process.cwd(), 'public', 'placeholders.json')
  await writeFile(placeholdersPath, JSON.stringify(tags, null, 2))

  // Retornar los placeholders al cliente
  return NextResponse.json(tags, { status: 200 })
}
