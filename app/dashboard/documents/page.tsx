'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Download, Trash2 } from 'lucide-react'

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [newDocumentName, setNewDocumentName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('isLoggedIn')
      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch documents. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setNewDocumentName(e.target.files[0].name)
    }
  }

  const handleUpload = async () => {
    if (!file || !newDocumentName) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', newDocumentName)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Document uploaded successfully.",
        })
        setNewDocumentName('')
        setFile(null)
        fetchDocuments()
      } else {
        toast({
          title: "Error",
          description: "Failed to upload document. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (document: Document) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/documents/download/${document.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = document.name
        window.document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        toast({
          title: "Error",
          description: "Failed to download document. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Document deleted successfully.",
        })
        fetchDocuments()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete document. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-red-950 border-red-800 text-red-100">
      <CardHeader>
        <CardTitle className="text-2xl">Dragon's Archives</CardTitle>
        <CardDescription className="text-red-300">Safeguard your treasured scrolls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Input
              type="text"
              placeholder="Document name"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              className="bg-red-900/50 border-red-800 text-red-100 placeholder-red-400"
            />
            <div className="relative">
              <Input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-700 text-red-100 hover:bg-red-600 h-10 px-4 py-2"
              >
                <Upload className="mr-2 h-4 w-4" /> File
              </label>
            </div>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !file || !newDocumentName}
              className="bg-red-700 text-red-100 hover:bg-red-600 "
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-red-300">Name</TableHead>
                <TableHead className="text-red-300">Upload Date</TableHead>
                <TableHead className="text-red-300">Size</TableHead>
                <TableHead className="text-red-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDownload(doc)}
                        className="bg-red-700 text-red-100 hover:bg-red-600"
                        size="sm"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(doc.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}