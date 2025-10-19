"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, Edit, Trash2, Briefcase, Calendar } from "lucide-react";
import { Experience, User } from "@/lib/features/user/types";

interface ExperienceTabProps {
  profile: User | null;
  isEditing: boolean;
  onUpdate: (updates: Partial<User>) => void;
}

const initialFormState: Omit<Experience, "_id"> = {
  company: "",
  jobTitle: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  jobDescription: "",
};

export function ExperienceTab({
  profile,
  isEditing,
  onUpdate,
}: ExperienceTabProps) {
  // Local state for the list, synced from props
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Local state for the add/edit form
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] =
    useState<Omit<Experience, "_id">>(initialFormState);

  // Global saving state for the tab
  const [isSaving, setIsSaving] = useState(false);

  // --- STEP 2: Sync local `experiences` state with the profile prop ---
  useEffect(() => {
    if (profile?.experience) {
      setExperiences(profile.experience);
    }
  }, [profile]);

  const resetForm = () => {
    setFormData(initialFormState);
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const handleInputChange = (
    field: keyof Omit<Experience, "_id">,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (index: number) => {
    const { _id, ...experienceToEdit } = experiences[index];
    setFormData(experienceToEdit);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  // --- STEP 3: Refactor save/delete to call the `onUpdate` prop ---
  const handleSave = async () => {
    let updatedExperiences: Experience[];

    const finalFormData = {
      ...formData,
      // If it's a current role, clear the end date
      endDate: formData.currentlyWorking ? "" : formData.endDate,
    };

    if (editingIndex !== null) {
      updatedExperiences = experiences.map((exp, index) =>
        index === editingIndex
          ? { ...experiences[index], ...finalFormData }
          : exp
      );
    } else {
      const newExperienceEntry: Omit<Experience, "_id"> = {
        ...finalFormData,
      };
      updatedExperiences = [...experiences, newExperienceEntry];
    }

    setIsSaving(true);
    try {
      await onUpdate({ experience: updatedExperiences });
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (indexToDelete: number) => {
    const updatedExperiences = experiences.filter(
      (_, i) => i !== indexToDelete
    );

    setIsSaving(true);
    try {
      await onUpdate({ experience: updatedExperiences });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (
    startDate: string | undefined,
    endDate: string | undefined,
    isCurrent: boolean
  ) => {
    /* ... unchanged ... */
  };

  if (!profile) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Work Experience
        </CardTitle>
        {isEditing && (
          <Button
            onClick={() => {
              setShowAddForm(true);
              setEditingIndex(null);
              setFormData(initialFormState);
            }}
            disabled={showAddForm}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add/Edit Form */}
        {isEditing && showAddForm && (
          <Card className="border-2 border-primary/20 bg-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingIndex !== null
                  ? "Edit Experience"
                  : "Add New Experience"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    disabled={formData.currentlyWorking}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="currentlyWorking"
                  checked={formData.currentlyWorking}
                  onCheckedChange={(checked) =>
                    handleInputChange("currentlyWorking", !!checked)
                  }
                />
                <Label htmlFor="currentlyWorking">I currently work here</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) =>
                    handleInputChange("jobDescription", e.target.value)
                  }
                  placeholder="Describe your responsibilities, achievements, and key projects..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience List */}
        <div className="space-y-4">
          {experiences.length === 0 && !isEditing ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No work experience added yet.</p>
            </div>
          ) : (
            experiences.map((experience, index) => (
              <Card key={experience._id || index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {experience.jobTitle}
                        </h3>
                        {experience.currentlyWorking && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                      </div>
                      <p className="text-primary font-medium mb-2">
                        {experience.company}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(experience.startDate)} -{" "}
                            {experience.currentlyWorking
                              ? "Present"
                              : formatDate(experience.endDate)}
                          </span>
                        </div>
                      </div>
                      {experience.jobDescription && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {experience.jobDescription}
                        </p>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDelete(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
