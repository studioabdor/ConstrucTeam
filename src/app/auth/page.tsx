"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  User,
  MapPin,
  Briefcase,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { ConsultantProfile } from "@/types";
// import { ConsultantOnboardingForm } from "@/types";

const onboardingSchema = z.object({
  services: z.array(z.string()).min(1, "Please select at least one service"),
  specializations: z.array(z.object({
    value: z.string().min(1, "Specialization cannot be empty")
  })).min(1, "Please add at least one specialization"),
  experience: z.number().min(0, "Experience cannot be negative").max(50, "Experience seems too high"),
  location: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
  }),
  portfolioLinks: z.array(z.object({
    value: z.string().url("Please enter valid URLs")
  })).optional(),
  preferredProjectSize: z.enum(["small", "medium", "large", "any"]),
  useAlias: z.boolean(),
  aliasName: z.string().optional(),
}).refine((data) => {
  if (data.useAlias && !data.aliasName) {
    return false;
  }
  return true;
}, {
  message: "Alias name is required when using alias",
  path: ["aliasName"],
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const serviceCategories = [
  { id: "architecture", label: "Architecture", icon: "🏛️" },
  { id: "interior-design", label: "Interior Design", icon: "🛋️" },
  { id: "structural", label: "Structural Engineering", icon: "🏗️" },
  { id: "mep", label: "MEP Engineering", icon: "⚡" },
  { id: "landscape", label: "Landscape Design", icon: "🌳" },
  { id: "project-management", label: "Project Management", icon: "📋" },
  { id: "urban-planning", label: "Urban Planning", icon: "🏙️" },
  { id: "sustainability", label: "Sustainability Consulting", icon: "🌱" },
  { id: "visualization", label: "3D Visualization", icon: "🎨" },
  { id: "construction", label: "Construction Services", icon: "🔨" },
];

const projectSizes = [
  { id: "small", label: "Small", description: "₹1L - ₹10L", icon: "🏠" },
  { id: "medium", label: "Medium", description: "₹10L - ₹1Cr", icon: "🏢" },
  { id: "large", label: "Large", description: "₹1Cr+", icon: "🏗️" },
  { id: "any", label: "Any Size", description: "All projects", icon: "⭐" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get("type") as "client" | "consultant" | null;
  const { user, userProfile, updateUserProfile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      services: [],
      specializations: [{ value: "" }],
      experience: 5,
      location: {
        city: "",
        state: "",
        pincode: "",
      },
      portfolioLinks: [{ value: "" }],
      preferredProjectSize: "any",
      useAlias: false,
      aliasName: "",
    },
  });

  const { fields: specializationFields, append: appendSpecialization, remove: removeSpecialization } = useFieldArray({
    control: form.control,
    name: "specializations"
  });

  const { fields: portfolioFields, append: appendPortfolio, remove: removePortfolio } = useFieldArray({
    control: form.control,
    name: "portfolioLinks"
  });

  const steps = [
    { title: "Services", icon: Briefcase },
    { title: "Expertise", icon: Star },
    { title: "Location", icon: MapPin },
    { title: "Profile", icon: User },
  ];

  useEffect(() => {
    // Redirect if already onboarded
    if (user && userProfile && userProfile.userType === "consultant") {
      router.push("/feed");
    }
  }, [user, userProfile, router]);

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

  const getStepFields = (step: number): (keyof OnboardingFormData)[] => {
    switch (step) {
      case 0: return ["services"];
      case 1: return ["specializations", "experience"];
      case 2: return ["location"];
      case 3: return ["preferredProjectSize", "useAlias"];
      default: return [];
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Clean up empty strings
      const cleanData = {
        ...data,
        specializations: data.specializations
          .map(s => s.value.trim())
          .filter(s => s !== ""),
        portfolioLinks: data.portfolioLinks
          ?.map(link => link.value.trim())
          .filter(link => link !== "") || [],
      };

      // Update user profile with onboarding data
      await updateUserProfile({
        userType: "consultant",
        services: cleanData.services,
        specializations: cleanData.specializations,
        experience: cleanData.experience,
        location: {
          address: `${cleanData.location.city}, ${cleanData.location.state}`,
          city: cleanData.location.city,
          state: cleanData.location.state,
          pincode: cleanData.location.pincode,
        },
        preferredProjectSize: cleanData.preferredProjectSize,
        useAlias: cleanData.useAlias,
        aliasName: cleanData.useAlias ? cleanData.aliasName : undefined,
        isVerified: false,
        rating: 0,
        completedProjects: 0,
        portfolio: [],
      } as Partial<ConsultantProfile>);

      router.push("/feed");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if checking auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect non-consultants
  if (userType !== "consultant") {
    router.push("/feed");
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold gradient-text ml-2">ConstrucTeam</span>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Welcome to ConstrucTeam!</h1>
          <p className="text-muted-foreground text-center">
            Let&apos;s set up your consultant profile to start receiving project opportunities
          </p>
        </motion.div>

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
                  <h2 className="text-2xl font-bold mb-6">What services do you offer?</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {serviceCategories.map((service) => (
                      <label key={service.id} className="cursor-pointer">
                        <input
                          type="checkbox"
                          value={service.id}
                          {...form.register("services")}
                          className="sr-only"
                        />
                        <div className={`p-4 rounded-lg border text-center transition-all hover:scale-105 ${
                          form.watch("services")?.includes(service.id)
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}>
                          <div className="text-2xl mb-2">{service.icon}</div>
                          <div className="text-sm font-medium">{service.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {form.formState.errors.services && (
                    <p className="text-sm text-destructive">{form.formState.errors.services.message}</p>
                  )}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Tell us about your expertise</h2>
                  
                  <div className="space-y-4">
                    <Label>Specializations</Label>
                    {specializationFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder={`Specialization ${index + 1}`}
                          className="glass flex-1"
                          {...form.register(`specializations.${index}.value`)}
                        />
                        {specializationFields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeSpecialization(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendSpecialization({ value: "" })}
                      className="glass"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Specialization
                    </Button>
                    {form.formState.errors.specializations && (
                      <p className="text-sm text-destructive">{form.formState.errors.specializations.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      max="50"
                      className="glass"
                      {...form.register("experience", { valueAsNumber: true })}
                    />
                    {form.formState.errors.experience && (
                      <p className="text-sm text-destructive">{form.formState.errors.experience.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Portfolio Links (optional)</Label>
                    {portfolioFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder="https://your-portfolio.com"
                          className="glass flex-1"
                          {...form.register(`portfolioLinks.${index}.value`)}
                        />
                        {portfolioFields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removePortfolio(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendPortfolio({ value: "" })}
                      className="glass"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Portfolio Link
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Where are you located?</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Mumbai"
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
                        placeholder="400001"
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
                      className="flex w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Final preferences</h2>
                  
                  <div className="space-y-4">
                    <Label>Preferred project size</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {projectSizes.map((size) => (
                        <label key={size.id} className="cursor-pointer">
                          <input
                            type="radio"
                            value={size.id}
                            {...form.register("preferredProjectSize")}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-lg border text-center transition-all hover:scale-105 ${
                            form.watch("preferredProjectSize") === size.id 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}>
                            <div className="text-2xl mb-2">{size.icon}</div>
                            <div className="text-sm font-medium mb-1">{size.label}</div>
                            <div className="text-xs text-muted-foreground">{size.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="useAlias"
                        className="rounded border-gray-300"
                        {...form.register("useAlias")}
                      />
                      <Label htmlFor="useAlias">Use an alias (for privacy)</Label>
                    </div>

                    {form.watch("useAlias") && (
                      <div className="space-y-2">
                        <Label htmlFor="aliasName">Alias Name</Label>
                        <Input
                          id="aliasName"
                          placeholder="Your professional alias"
                          className="glass"
                          {...form.register("aliasName")}
                        />
                        {form.formState.errors.aliasName && (
                          <p className="text-sm text-destructive">{form.formState.errors.aliasName.message}</p>
                        )}
                      </div>
                    )}
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
                {isSubmitting ? 'Setting up...' : 'Complete Setup'}
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
