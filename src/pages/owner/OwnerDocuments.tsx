import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Calendar,
  Eye
} from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  type: string
  title: string
  description: string
  required: boolean
  status: "approved" | "pending" | "rejected" | "expired" | "missing"
  uploadDate?: string
  expiryDate?: string
  filename?: string
  rejectionReason?: string
}

const mockDocuments: Document[] = [
  {
    id: "1",
    type: "id",
    title: "ID Document",
    description: "Valid South African ID or Passport",
    required: true,
    status: "approved",
    uploadDate: "2024-01-15",
    filename: "id_document.pdf"
  },
  {
    id: "2",
    type: "ownership",
    title: "Proof of Ownership",
    description: "Bill of Sale or Ownership Certificate",
    required: true,
    status: "approved",
    uploadDate: "2024-01-15",
    filename: "ownership_certificate.pdf"
  },
  {
    id: "3",
    type: "cof",
    title: "Certificate of Fitness (COF)",
    description: "Valid COF for your vessel",
    required: true,
    status: "expired",
    uploadDate: "2023-12-01",
    expiryDate: "2024-01-01",
    filename: "cof_2023.pdf"
  },
  {
    id: "4",
    type: "insurance",
    title: "Insurance Documents",
    description: "Boat insurance policy (recommended)",
    required: false,
    status: "pending",
    uploadDate: "2024-02-10",
    filename: "insurance_policy.pdf"
  },
  {
    id: "5",
    type: "license",
    title: "Skipper License",
    description: "Required if offering skippered services",
    required: false,
    status: "missing"
  }
]

export default function OwnerDocuments() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "rejected": return "bg-red-100 text-red-800"
      case "expired": return "bg-orange-100 text-orange-800"
      case "missing": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />
      case "pending": return <AlertTriangle className="w-4 h-4" />
      case "rejected": return <XCircle className="w-4 h-4" />
      case "expired": return <AlertTriangle className="w-4 h-4" />
      case "missing": return <Upload className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const handleFileUpload = (documentId: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB",
        variant: "destructive"
      })
      return
    }

    // Update document status
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { 
            ...doc, 
            status: "pending" as const,
            uploadDate: new Date().toISOString().split('T')[0],
            filename: file.name 
          }
        : doc
    ))

    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded and is pending review."
    })
  }

  const DocumentCard = ({ document }: { document: Document }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{document.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{document.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {document.required && (
              <Badge variant="outline" className="text-xs">Required</Badge>
            )}
            <Badge className={getStatusColor(document.status)}>
              {getStatusIcon(document.status)}
              <span className="ml-1 capitalize">{document.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {document.filename && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{document.filename}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}

        {document.uploadDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
          </div>
        )}

        {document.expiryDate && (
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span className={
              new Date(document.expiryDate) < new Date() 
                ? "text-red-600" 
                : new Date(document.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                ? "text-orange-600"
                : "text-muted-foreground"
            }>
              Expires: {new Date(document.expiryDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {document.rejectionReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Rejection Reason:</strong> {document.rejectionReason}
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-3">
          {document.status === "missing" || document.status === "rejected" || document.status === "expired" ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium mb-1">
                {document.status === "missing" ? "Upload Document" : "Upload New Document"}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                PDF, JPEG, or PNG (max 10MB)
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(document.id, file)
                  }
                }}
                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Need to update this document?
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(document.id, file)
                  }
                }}
                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const requiredDocs = documents.filter(doc => doc.required)
  const optionalDocs = documents.filter(doc => !doc.required)
  const approvedRequired = requiredDocs.filter(doc => doc.status === "approved").length
  const totalRequired = requiredDocs.length

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-brand font-bold text-primary">Document Management</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your verification documents
          </p>
        </div>

        {/* Status Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Verification Status</h3>
                <p className="text-muted-foreground">
                  {approvedRequired} of {totalRequired} required documents approved
                </p>
              </div>
              <div className="text-right">
                {approvedRequired === totalRequired ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Fully Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Verification Pending</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${(approvedRequired / totalRequired) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Required Documents
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requiredDocs.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </div>

        {/* Optional Documents */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Optional Documents
          </h2>
          <p className="text-muted-foreground mb-4">
            These documents help improve trust and may unlock additional features
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {optionalDocs.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Document Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">File Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Formats: PDF, JPEG, PNG</li>
                  <li>• Maximum size: 10MB per file</li>
                  <li>• Clear, readable images</li>
                  <li>• All information must be visible</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Processing Time</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Standard review: 24-48 hours</li>
                  <li>• You'll receive email notifications</li>
                  <li>• Rejected documents include feedback</li>
                  <li>• Contact support for urgent requests</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}