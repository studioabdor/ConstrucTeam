"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText, 
  Plus,
  X,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { ProjectRequestForm } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required").max(100, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description too long"),
  category: z.enum([
    "residential",
    "commercial", 
    "industrial",
    "infrastructure",
    "interior",
    "landscape",
    "structural",
    "mep",
    "consultation"
  ], { message: "Please select a project category" }),
  subcategory: z.string().optional(),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
  }),
  budgetRange: z.object({
    min: z.number().min(1000, "Minimum budget should be at least ₹1,000"),
    max: z.number().min(1000, "Maximum budget should be at least ₹1,000"),
    currency: z.literal("INR"),
  }).refine(data => data.max >= data.min, {
    message: "Maximum budget should be greater than or equal to minimum budget",
    path: ["max"],
  }),
  timeline: z.object({
    expectedDuration: z.number().min(1, "Duration should be at least 1 day"),
    isFlexible: z.boolean(),
  }),
  requirements: z.array(z.string().min(1, "Requirement cannot be empty")).min(1, "At least one requirement is needed"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const projectCategories = [
  { id: "residential", label: "Residential", icon: "🏠" },
  { id: "commercial", label: "Commercial", icon: "🏢" },
  { id: "industrial", label: "Industrial", icon: "🏭" },
  { id: "infrastructure", label: "Infrastructure", icon: "🛤️" },
  { id: "interior", label: "Interior Design", icon: "🛋️" },
  { id: "landscape", label: "Landscape", icon: "🌳" },
  { id: "structural", label: "Structural", icon: "🏗️" },
  { id: "mep", label: "MEP Engineering", icon: "⚡" },
  { id: "consultation", label: "Consultation", icon: "💭" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, userProfile } = useAuth();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      location: {
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
      budgetRange: {
        min: 50000,
        max: 500000,
        currency: "INR",
      },
      timeline: {
        expectedDuration: 30,
        isFlexible: true,
      },
      requirements: [""],
      tags: [],
    },
  });

  const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control: form.control,
    name: "requirements"
  });

  const steps = [
    { title: "Basic Info", icon: FileText },
    { title: "Location", icon: MapPin },
    { title: "Budget & Timeline", icon: DollarSign },
    { title: "Requirements", icon: CheckCircle },
  ];

  const nextStep = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await form.trigger(stepFields);
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepFields = (step: number): (keyof ProjectFormData)[] => {
    switch (step) {
      case 0: return ["title", "description", "category"];
      case 1: return ["location"];
      case 2: return ["budgetRange", "timeline"];
      case 3: return ["requirements"];
      default: return [];
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!user || !userProfile) return;

    setIsSubmitting(true);
    try {
      // Here you would submit to Firebase
      console.log("Project data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to feed or success page
      // router.push('/feed');
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to post a project
          </p>
          <Link href="/">
            <Button variant="glass">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h1 className="text-3xl font-bold gradient-text mb-2">Post a Project</h1>
            <p className="text-muted-foreground">
              Tell us about your project and connect with qualified consultants
            </p>
          </motion.div>
        </div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-0.5 w-12 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-8 mb-8"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., 3BHK Apartment Interior Design"
                      className="glass"
                      {...form.register("title")}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <textarea
                      id="description"
                      placeholder="Describe your project in detail..."
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Project Category</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {projectCategories.map((category) => (
                        <label key={category.id} className="cursor-pointer">
                          <input
                            type="radio"
                            value={category.id}
                            {...form.register("category")}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-lg border text-center transition-all hover:scale-105 ${
                            form.watch("category") === category.id 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}>
                            <div className="text-2xl mb-2">{category.icon}</div>
                            <div className="text-sm font-medium">{category.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {form.formState.errors.category && (
                      <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Location Details</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      className="glass"
                      {...form.register("location.address")}
                    />
                    {form.formState.errors.location?.address && (
                      <p className="text-sm text-destructive">{form.formState.errors.location.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        className="glass"
                        {...form.register("location.city")}
                      />
                      {form.formState.errors.location?.city && (
                        <p className="text-sm text-destructive">{form.formState.errors.location.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        placeholder="110001"
                        className="glass"
                        {...form.register("location.pincode")}
                      />
                      {form.formState.errors.location?.pincode && (
                        <p className="text-sm text-destructive">{form.formState.errors.location.pincode.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <select
                      id="state"
                      className="flex w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...form.register("location.state")}
                    >
                      <option value="">Select a state</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {form.formState.errors.location?.state && (
                      <p className="text-sm text-destructive">{form.formState.errors.location.state.message}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Budget & Timeline</h2>
                  
                  <div className="space-y-4">
                    <Label>Budget Range (INR)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minBudget">Minimum</Label>
                        <Input
                          id="minBudget"
                          type="number"
                          placeholder="50,000"
                          className="glass"
                          {...form.register("budgetRange.min", { valueAsNumber: true })}
                        />
                        {form.formState.errors.budgetRange?.min && (
                          <p className="text-sm text-destructive">{form.formState.errors.budgetRange.min.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxBudget">Maximum</Label>
                        <Input
                          id="maxBudget"
                          type="number"
                          placeholder="5,00,000"
                          className="glass"
                          {...form.register("budgetRange.max", { valueAsNumber: true })}
                        />
                        {form.formState.errors.budgetRange?.max && (
                          <p className="text-sm text-destructive">{form.formState.errors.budgetRange.max.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Expected Duration (days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="30"
                        className="glass"
                        {...form.register("timeline.expectedDuration", { valueAsNumber: true })}
                      />
                      {form.formState.errors.timeline?.expectedDuration && (
                        <p className="text-sm text-destructive">{form.formState.errors.timeline.expectedDuration.message}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="flexible"
                        className="rounded border-gray-300"
                        {...form.register("timeline.isFlexible")}
                      />
                      <Label htmlFor="flexible">Timeline is flexible</Label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Requirements & Tags</h2>
                  
                  <div className="space-y-4">
                    <Label>Project Requirements</Label>
                    {requirementFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder={`Requirement ${index + 1}`}
                          className="glass flex-1"
                          {...form.register(`requirements.${index}`)}
                        />
                        {requirementFields.length > 1 && (
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
                      onClick={() => appendRequirement("")}
                      className="glass"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Requirement
                    </Button>
                    {form.formState.errors.requirements && (
                      <p className="text-sm text-destructive">{form.formState.errors.requirements.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (optional)</Label>
                    <Input
                      id="tags"
                      placeholder="modern, luxury, eco-friendly (comma separated)"
                      className="glass"
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        form.setValue('tags', tags);
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Add tags to help consultants find your project
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="glass-card p-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="glass"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="glass"
                className="bg-blue-500/20 hover:bg-blue-500/30"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Project'}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                variant="glass"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
