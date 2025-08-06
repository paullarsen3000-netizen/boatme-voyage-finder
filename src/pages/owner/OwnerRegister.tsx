import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

const steps = [
  { id: 1, title: "Personal Details", description: "Basic information" },
  { id: 2, title: "Document Upload", description: "Required documents" },
  { id: 3, title: "Agency Agreement", description: "Terms and authorization" },
  { id: 4, title: "Verification", description: "Complete registration" }
]

interface DocumentFile {
  name: string
  url: string
}

interface FormData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  idDocument: DocumentFile | null
  proofOwnership: DocumentFile | null
  cofDocument: DocumentFile | null
  insuranceDocument: DocumentFile | null
  agreementSigned: boolean
  legalName: string
}

export default function OwnerRegister() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    idDocument: null,
    proofOwnership: null,
    cofDocument: null,
    insuranceDocument: null,
    agreementSigned: false,
    legalName: ""
  })
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()

  // Load existing documents on mount
  useEffect(() => {
    const loadDocs = async () => {
      if (!user?.id) return

      try {
        // Query owner_documents table instead of storage directly
        const { data: docs, error: dbError } = await supabase
          .from('owner_documents')
          .select('*')
          .eq('owner_id', user.id)

        if (dbError) {
          console.error('Error loading docs from DB:', dbError)
          return
        }

        if (!docs) return

        const newFormData = { ...formData }
        
        for (const doc of docs) {
          const { data: urlData } = supabase
            .storage
            .from('owner-documents')
            .getPublicUrl(doc.file_path)

          const docObj = { name: doc.file_name, url: urlData.publicUrl }

          if (doc.document_type === 'idDocument') {
            newFormData.idDocument = docObj
          } else if (doc.document_type === 'proofOwnership') {
            newFormData.proofOwnership = docObj
          } else if (doc.document_type === 'cofDocument') {
            newFormData.cofDocument = docObj
          } else if (doc.document_type === 'insuranceDocument') {
            newFormData.insuranceDocument = docObj
          }
        }
        
        setFormData(newFormData)
      } catch (error) {
        console.error('Error loading documents:', error)
      }
    }

    loadDocs()
  }, [user?.id])

  const handleFileUpload = async (field: keyof FormData, file: File | null) => {
    if (!file) return
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB",
        variant: "destructive"
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload documents",
        variant: "destructive"
      })
      return
    }

    try {
      const fileName = `${field}-${Date.now()}-${file.name}`
      const filePath = `${user.id}/${fileName}`
      
      const { data, error: uploadError } = await supabase
        .storage
        .from('owner-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('owner-documents')
        .getPublicUrl(data.path)

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('owner_documents')
        .upsert({
          owner_id: user.id,
          document_type: field as string,
          file_name: file.name,
          file_path: data.path
        }, { 
          onConflict: 'owner_id,document_type' 
        })

      if (dbError) {
        console.error('Database error:', dbError)
        // Still update UI even if DB save fails
      }

      setFormData(prev => ({ 
        ...prev, 
        [field]: { name: file.name, url: urlData.publicUrl } 
      }))

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    toast({
      title: "Registration Successful!",
      description: "Your account has been created. Redirecting to dashboard..."
    })
    setTimeout(() => navigate("/owner/dashboard"), 2000)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
      case 2:
        return formData.idDocument && formData.proofOwnership && formData.cofDocument
      case 3:
        return formData.agreementSigned && formData.legalName
      default:
        return true
    }
  }

  const FileUploadCard = ({ 
    title, 
    description, 
    field, 
    file, 
    required = true 
  }: { 
    title: string
    description: string
    field: keyof FormData
    file: DocumentFile | null
    required?: boolean
  }) => (
    <Card className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="text-center">
          {file ? (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium underline hover:no-underline"
              >
                {file.name}
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
                {required && <p className="text-xs text-red-500">Required</p>}
              </div>
            </div>
          )}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null)}
            className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-brand font-bold text-primary mb-4">
              Become a BoatMe Partner
            </h1>
            <Progress value={(currentStep / 4) * 100} className="mb-4" />
            <div className="flex justify-between text-sm">
              {steps.map((step) => (
                <div key={step.id} className={`text-center ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-gray-200'}`}>
                    {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a secure password"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                    />
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Document Requirements</p>
                        <p className="text-sm text-blue-700">All documents must be valid, clear, and in PDF, JPEG, or PNG format (max 10MB each)</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploadCard
                      title="ID Document"
                      description="Valid South African ID or Passport"
                      field="idDocument"
                      file={formData.idDocument}
                    />
                    <FileUploadCard
                      title="Proof of Ownership"
                      description="Bill of Sale or Ownership Certificate"
                      field="proofOwnership"
                      file={formData.proofOwnership}
                    />
                    <FileUploadCard
                      title="Certificate of Fitness (COF)"
                      description="Valid COF for your vessel"
                      field="cofDocument"
                      file={formData.cofDocument}
                    />
                    <FileUploadCard
                      title="Insurance Documents"
                      description="Boat insurance policy (recommended)"
                      field="insuranceDocument"
                      file={formData.insuranceDocument}
                      required={false}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Agency Agreement */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>BoatMe Rental Agency Agreement</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg text-sm">
                        <h3 className="font-bold mb-2">RENTAL AGENCY AGREEMENT</h3>
                        <p className="mb-2">This agreement authorizes BoatMe (Pty) Ltd to act as your exclusive rental agent for the vessel(s) listed in your account.</p>
                        <h4 className="font-semibold">Key Terms:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>BoatMe will handle all bookings, payments, and customer communication</li>
                          <li>You retain full ownership and liability insurance responsibility</li>
                          <li>BoatMe commission: 15% of rental fees</li>
                          <li>You maintain the right to block dates for personal use</li>
                          <li>All renters are verified and require valid licenses where applicable</li>
                          <li>BoatMe provides 24/7 emergency support during rentals</li>
                          <li>Either party may terminate with 30 days written notice</li>
                        </ul>
                        <p className="mt-4 text-gray-600">Full agreement available for download after registration</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="legalName">Legal Name for E-Signature *</Label>
                          <Input
                            id="legalName"
                            value={formData.legalName}
                            onChange={(e) => setFormData(prev => ({ ...prev, legalName: e.target.value }))}
                            placeholder="Enter your full legal name exactly as on ID"
                          />
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="agreement"
                            checked={formData.agreementSigned}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreementSigned: !!checked }))}
                          />
                          <Label htmlFor="agreement" className="text-sm leading-relaxed">
                            I have read, understood, and agree to the BoatMe Rental Agency Agreement. 
                            By typing my legal name above, I digitally sign this agreement and authorize 
                            BoatMe to rent my vessel(s) on my behalf under the terms specified.
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 4: Verification */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Registration Complete!</h3>
                    <p className="text-muted-foreground">
                      Your documents are being reviewed. You'll receive an email confirmation within 24-48 hours.
                      Once approved, you can start listing your boats for rent.
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Next Steps:</strong> Check your email for verification status updates. 
                      You can access your dashboard immediately to prepare your boat listings.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button onClick={handleSubmit}>
                    Complete Registration
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
