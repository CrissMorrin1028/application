'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText } from "lucide-react"

export function DynamicWordFormPrototype() {
  const [file, setFile] = useState<File | null>(null)
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setIsLoading(true)
      setFile(files[0])

      // Cargar el archivo al servidor
      const formData = new FormData()
      formData.append('file', files[0])

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const extractedPlaceholders = await response.json()
          setPlaceholders(extractedPlaceholders)
          setFormData(Object.fromEntries(Object.keys(extractedPlaceholders).map(key => [key, ''])))
        } else {
          console.error('Error al procesar el archivo')
        }
      } catch (error) {
        console.error('Error al subir el archivo:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cargar Documento Word</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Haz clic para cargar</span> o arrastra y suelta</p>
                <p className="text-xs text-gray-500">WORD (DOC, DOCX)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} accept=".doc,.docx" />
            </label>
          </div>
          {file && (
            <div className="mt-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-500">{file.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      )}

      {Object.keys(placeholders).length > 0 && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Formulario Dinámico</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {Object.keys(placeholders).map((key) => (
                <div key={key} className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={key}>{key}</Label>
                  <Input
                    type="text"
                    id={key}
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </div>
              ))}
              <Button type="submit" className="w-full">Generar Contenido</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
