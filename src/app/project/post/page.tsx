"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod"; // Temporarily removed due to type conflicts
// import { z } from "zod"; // Temporarily removed - not using Zod validation
import { 
  Plus, 
  X, 
  ArrowLeft, 
  ArrowRight,
  Send,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectSlip, type ProjectSlip as ProjectSlipType } from "@/components/projects/project-slip";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// Form validation schema (temporarily commented out due to resolver type conflicts)
// const projectSchema = z.object({
//   title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title too long"),
//   description: z.string().min(50, "Description must be at least 50 characters").max(1000, "Description too long"),
//   category: z.enum(["interior-design", "architecture", "structural", "electrical", "plumbing", "landscaping", "other"], {
//     message: "Please select a valid category"
//   }),
//   projectType: z.enum(["residential", "commercial", "industrial", "renovation"], {
//     message: "Please select a project type"
//   }),
//   location: z.object({
//     city: z.string().min(2, "City is required"),
//     state: z.string().min(2, "State is required"),
//     pincode: z.string().min(1, "Pincode is required")
//   }),
//   budget: z.object({
//     min: z.number().min(1000, "Minimum budget should be at least ₹1,000"),
//     max: z.number().min(1000, "Maximum budget should be at least ₹1,000"),
//     currency: z.literal("INR")
//   }),
//   timeline: z.string().min(5, "Timeline is required"),
//   urgency: z.enum(["low", "medium", "high"], {
//     message: "Please select urgency level"
//   }),
//   size: z.string().min(1, "Project size is required"),
//   requirements: z.array(z.object({
//     value: z.string().min(1, "Requirement cannot be empty")
//   })).min(1, "At least one requirement is needed")
// });

// Simple type definition for form data
interface ProjectFormData {
  title: string;
  description: string;
  category: "interior-design" | "architecture" | "structural" | "electrical" | "plumbing" | "landscaping" | "other";
  projectType: "residential" | "commercial" | "industrial" | "renovation";
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  urgency: "low" | "medium" | "high";
  size: string;
  requirements: { value: string }[];
}

const categories = [
  { value: "interior-design", label: "Interior Design" },
  { value: "architecture", label: "Architecture" },
  { value: "structural", label: "Structural Engineering" },
  { value: "electrical", label: "Electrical Work" },
  { value: "plumbing", label: "Plumbing" },
  { value: "landscaping", label: "Landscaping" },
  { value: "other", label: "Other" }
];

const projectTypes = [
  { value: "residential", label: "🏠 Residential" },
  { value: "commercial", label: "🏢 Commercial" },
  { value: "industrial", label: "🏭 Industrial" },
  { value: "renovation", label: "🔨 Renovation" }
];

const urgencyLevels = [
  { value: "low", label: "🟢 Low Priority", desc: "Flexible timeline" },
  { value: "medium", label: "🟡 Medium Priority", desc: "Preferred timeline" },
  { value: "high", label: "🔴 High Priority", desc: "Urgent requirement" }
];

export default function PostProjectPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "interior-design",
      projectType: "residential",
      location: {
        city: "",
        state: "",
        pincode: ""
      },
      budget: {
        min: 50000,
        max: 200000,
        currency: "INR"
      },
      timeline: "",
      urgency: "medium",
      size: "1000-3000 sq ft",
      requirements: [{ value: "" }]
    }
  });

  const { fields: requirements, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control: form.control,
    name: "requirements"
  });

  // Redirect if not authenticated or not a client
  if (!user) {
    return (
      <AuthLayout>
        <PageContainer className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to post a project.</p>
        </PageContainer>
      </AuthLayout>
    );
  }

  if (userProfile?.userType !== 'client') {
    return (
      <AuthLayout>
        <PageContainer className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Client Access Only</h2>
          <p className="text-muted-foreground">Only clients can post projects. Switch to consultant view to browse projects.</p>
        </PageContainer>
      </AuthLayout>
    );
  }

  const generateSlipNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `CTC${timestamp}${random}`;
  };

  const formData = form.watch();

  // Create preview project slip
  const previewProject: ProjectSlipType = {
    id: "preview",
    title: formData.title || "Project Title",
    description: formData.description || "Project description will appear here...",
    category: categories.find(c => c.value === formData.category)?.label || "Interior Design",
    location: {
      city: formData.location.city || "City",
      state: formData.location.state || "State",
      pincode: formData.location.pincode
    },
    budget: {
      min: formData.budget.min,
      max: formData.budget.max,
      currency: formData.budget.currency
    },
    timeline: formData.timeline || "Timeline",
    requirements: formData.requirements.map(r => r.value).filter(Boolean),
    clientName: userProfile?.displayName || "Your Name",
    postedAt: new Date(),
    urgency: formData.urgency,
    projectType: formData.projectType,
    size: formData.size,
    slipNumber: generateSlipNumber()
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would save to Firebase/database
      console.log("Submitting project:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to feed after successful submission
      router.push('/feed?posted=true');
    } catch (error) {
      console.error("Error posting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPreview(!showPreview)}
      >
        <Eye className="h-4 w-4 mr-2" />
        {showPreview ? "Hide" : "Preview"} Slip
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push('/feed')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Cancel
      </Button>
    </div>
  );

  return (
    <AuthLayout>
      <PageHeader
        title="Post New Project"
        subtitle="Create a project request to connect with verified consultants"
        actions={headerActions}
      />

      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${currentStep >= step 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }
                  `}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`
                      flex-1 h-1 mx-4
                      ${currentStep > step ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}
                    `} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold mb-4">Project Details</h3>
                    
                    <div>
                      <Label htmlFor="title">Project Title *</Label>
                      <Input
                        id="title"
                        {...form.register("title")}
                        placeholder="e.g., Modern 3BHK Apartment Interior Design"
                      />
                      {form.formState.errors.title && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Project Description *</Label>
                      <textarea
                        id="description"
                        {...form.register("description")}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Describe your project requirements, style preferences, and any specific needs..."
                      />
                      {form.formState.errors.description && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <select
                          id="category"
                          {...form.register("category")}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="projectType">Project Type *</Label>
                        <select
                          id="projectType"
                          {...form.register("projectType")}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          {projectTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Location & Budget */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold mb-4">Location & Budget</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          {...form.register("location.city")}
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          {...form.register("location.state")}
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          {...form.register("location.pincode")}
                          placeholder="400001"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minBudget">Minimum Budget (₹) *</Label>
                        <Input
                          id="minBudget"
                          type="number"
                          {...form.register("budget.min", { valueAsNumber: true })}
                          placeholder="50000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxBudget">Maximum Budget (₹) *</Label>
                        <Input
                          id="maxBudget"
                          type="number"
                          {...form.register("budget.max", { valueAsNumber: true })}
                          placeholder="200000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timeline">Timeline *</Label>
                      <Input
                        id="timeline"
                        {...form.register("timeline")}
                        placeholder="e.g., 2-3 months, By December 2024"
                      />
                    </div>

                    <div>
                      <Label>Project Urgency *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        {urgencyLevels.map((level) => (
                          <label
                            key={level.value}
                            className={`
                              p-3 border rounded-lg cursor-pointer transition-all
                              ${form.watch("urgency") === level.value
                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-amber-300'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              {...form.register("urgency")}
                              value={level.value}
                              className="sr-only"
                            />
                            <div className="font-medium">{level.label}</div>
                            <div className="text-sm text-muted-foreground">{level.desc}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Requirements */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold mb-4">Requirements & Additional Info</h3>
                    
                    <div>
                      <Label htmlFor="size">Project Size (Optional)</Label>
                      <Input
                        id="size"
                        {...form.register("size")}
                        placeholder="e.g., 1200 sq ft, 3 rooms"
                      />
                    </div>

                    <div>
                      <Label>Specific Requirements *</Label>
                      <div className="space-y-3 mt-2">
                        {requirements.map((field, index) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <Input
                              {...form.register(`requirements.${index}.value`)}
                              placeholder="e.g., Modern minimalist design, Budget-friendly materials"
                            />
                            {requirements.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeRequirement(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendRequirement({ value: "" })}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Requirement</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Post Project</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div className="flex justify-center">
                <ProjectSlip 
                  project={previewProject}
                  showActions={false}
                />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </AuthLayout>
  );
}
