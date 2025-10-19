"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, X, Code, Target, Users } from "lucide-react";
// --- STEP 1: Import the global User type ---
import { User } from "@/lib/features/user/types";

interface SkillsTabProps {
  profile: User | null;
  isEditing: boolean;
  onUpdate: (updates: Partial<User>) => void;
  userRole?: User["role"];
}

export function SkillsTab({
  profile,
  isEditing,
  onUpdate,
  userRole,
}: SkillsTabProps) {
  // Local state for the arrays, synced from props
  const [skills, setSkills] = useState<string[]>([]);
  const [hiringPreferences, setHiringPreferences] = useState<string[]>([]);

  // Local state for the input fields
  const [newSkill, setNewSkill] = useState("");
  const [newPreference, setNewPreference] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- STEP 2: Sync local state with the profile prop ---
  useEffect(() => {
    if (profile) {
      setSkills(profile.skills || []);
      setHiringPreferences(profile.hiringPreferences || []);
    }
  }, [profile]);

  // Predefined skill and preference suggestions (can be moved to a separate file)
  const skillSuggestions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "UI/UX Design",
  ];
  const preferenceSuggestions = [
    "Remote Work",
    "Hybrid Work",
    "Full-time",
    "Contract",
    "Senior Level",
    "Startup Experience",
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPreference = () => {
    if (
      newPreference.trim() &&
      !hiringPreferences.includes(newPreference.trim())
    ) {
      setHiringPreferences((prev) => [...prev, newPreference.trim()]);
      setNewPreference("");
    }
  };

  const handleRemovePreference = (index: number) => {
    setHiringPreferences((prev) => prev.filter((_, i) => i !== index));
  };

  // --- STEP 3: Refactor handleSave to call the onUpdate prop ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let updates: Partial<User> = {};
      if (userRole === "employee") {
        updates = { skills };
      } else if (userRole === "employer") {
        updates = { hiringPreferences };
      }
      await onUpdate(updates);
    } finally {
      setIsSaving(false);
    }
  };

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
  };

  const addSuggestedPreference = (preference: string) => {
    if (!hiringPreferences.includes(preference)) {
      setHiringPreferences((prev) => [...prev, preference]);
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Skills Section (for employees) */}
      {userRole === "employee" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Skills & Expertise
            </CardTitle>
            {isEditing && (
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Skills"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Skills</Label>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {skills.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No skills added yet.
                  </p>
                )}
              </div>
            </div>
            {isEditing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-skill">Add New Skill</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a skill"
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Popular Skills (click to add)</Label>
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions
                      .filter((skill) => !skills.includes(skill))
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => addSuggestedSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hiring Preferences Section (for employers) */}
      {userRole === "employer" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Hiring Preferences
            </CardTitle>
            {isEditing && (
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Hiring Preferences</Label>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                {hiringPreferences.map((preference, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {preference}
                    {isEditing && (
                      <button
                        onClick={() => handleRemovePreference(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {hiringPreferences.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No preferences added yet.
                  </p>
                )}
              </div>
            </div>
            {isEditing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-preference">Add New Preference</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-preference"
                      value={newPreference}
                      onChange={(e) => setNewPreference(e.target.value)}
                      placeholder="Enter a hiring preference"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddPreference()
                      }
                    />
                    <Button onClick={handleAddPreference} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Common Preferences (click to add)</Label>
                  <div className="flex flex-wrap gap-2">
                    {preferenceSuggestions
                      .filter((pref) => !hiringPreferences.includes(pref))
                      .map((preference) => (
                        <Badge
                          key={preference}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => addSuggestedPreference(preference)}
                        >
                          {preference}
                        </Badge>
                      ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informational Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {userRole === "employee"
              ? "Skill Development Tips"
              : "Hiring Best Practices"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userRole === "employee" ? (
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Keep your skills updated with current industry trends.</li>
              <li>
                Include both technical ("hard") skills and interpersonal
                ("soft") skills.
              </li>
              <li>
                Be specific (e.g., "React 18 with Hooks" instead of just
                "React").
              </li>
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Be clear about required vs. "nice-to-have" skills.</li>
              <li>
                Specify the work environment (e.g., remote, collaborative,
                fast-paced).
              </li>
              <li>Consider preferences related to diversity and inclusion.</li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
