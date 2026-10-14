"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AppShell } from "@/components/site-shell";

type ProfileValues = {
  full_name: string;
  study_level: string;
  institution: string;
  major: string;
  study_year: string;
  gpa: string;
  citizenship_region: string;
  activity_tags: string;
  financial_need: boolean;
};

type ProfileErrors = Partial<Record<keyof ProfileValues, string>>;

const initialValues: ProfileValues = {
  full_name: "Alex Morgan",
  study_level: "undergraduate",
  institution: "",
  major: "Environmental Science",
  study_year: "2",
  gpa: "",
  citizenship_region: "",
  activity_tags: "Sustainability, mentoring, community projects",
  financial_need: false,
};

function FieldLabel({ htmlFor, children, required = false }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return <label htmlFor={htmlFor}>{children} {required ? <span className="required-mark" aria-hidden="true">*</span> : <span className="optional-label">Optional</span>}</label>;
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return message ? <span id={id} className="field-error" role="alert">{message}</span> : null;
}

export default function ProfilePage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof ProfileValues) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
    setValues(current => ({ ...current, [field]: value }));
    setSaved(false);
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: ProfileErrors = {};
    const name = values.full_name.trim();
    if (!name) nextErrors.full_name = "Enter your full name.";
    else if (name.length > 100) nextErrors.full_name = "Use 100 characters or fewer.";
    if (!values.study_level) nextErrors.study_level = "Choose your study level.";

    if (values.study_year) {
      const year = Number(values.study_year);
      if (!Number.isInteger(year) || year < 1 || year > 8) nextErrors.study_year = "Enter a whole number from 1 to 8.";
    }
    if (values.gpa) {
      const gpa = Number(values.gpa);
      if (!Number.isFinite(gpa) || gpa < 0 || gpa > 4) nextErrors.gpa = "Enter a GPA from 0 to 4.";
    }
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      const firstInvalid = Object.keys(nextErrors)[0];
      window.requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus());
      return;
    }
    setSaved(true);
  };

  return <AppShell active="My profile">
    <div className="page-content">
      <div className="page-header">
        <div>
          <div className="breadcrumb">Your information</div>
          <h1>Build your profile</h1>
          <p>A little context helps ScholarReady explain why an opportunity may fit.</p>
        </div>
      </div>
      <div className="profile-layout">
        <form className="form-panel" onSubmit={handleSubmit} noValidate>
          <div className="form-heading-row">
            <div>
              <h2>Academic profile</h2>
              <p className="form-helper"><span className="required-mark" aria-hidden="true">*</span> Required fields</p>
            </div>
          </div>
          {Object.keys(errors).length > 0 && <div className="form-error-summary" role="alert">Please review the highlighted fields before saving.</div>}
          <div className="form-two">
            <div className="field">
              <FieldLabel htmlFor="full_name" required>Full name</FieldLabel>
              <input id="full_name" name="full_name" value={values.full_name} onChange={updateField("full_name")} aria-invalid={Boolean(errors.full_name)} aria-describedby={errors.full_name ? "full_name-error" : undefined} autoComplete="name" />
              <ErrorText id="full_name-error" message={errors.full_name} />
            </div>
            <div className="field">
              <FieldLabel htmlFor="study_level" required>Study level</FieldLabel>
              <select id="study_level" name="study_level" value={values.study_level} onChange={updateField("study_level")} aria-invalid={Boolean(errors.study_level)} aria-describedby={errors.study_level ? "study_level-error" : undefined}>
                <option value="">Select a level</option><option value="undergraduate">Undergraduate</option>
              </select>
              <ErrorText id="study_level-error" message={errors.study_level} />
            </div>
            <div className="field"><FieldLabel htmlFor="institution">Institution</FieldLabel><input id="institution" name="institution" value={values.institution} onChange={updateField("institution")} placeholder="e.g. Example University" autoComplete="organization" /></div>
            <div className="field"><FieldLabel htmlFor="major">Major or field</FieldLabel><input id="major" name="major" value={values.major} onChange={updateField("major")} placeholder="e.g. Environmental Science" /></div>
            <div className="field">
              <FieldLabel htmlFor="study_year">Study year</FieldLabel>
              <input id="study_year" name="study_year" type="number" min="1" max="8" step="1" value={values.study_year} onChange={updateField("study_year")} aria-invalid={Boolean(errors.study_year)} aria-describedby={errors.study_year ? "study_year-error" : "study_year-help study_year-error"} />
              <span id="study_year-help" className="field-help">Use a whole number from 1 to 8.</span><ErrorText id="study_year-error" message={errors.study_year} />
            </div>
            <div className="field">
              <FieldLabel htmlFor="gpa">GPA</FieldLabel>
              <input id="gpa" name="gpa" type="number" min="0" max="4" step="0.01" value={values.gpa} onChange={updateField("gpa")} placeholder="e.g. 3.4" aria-invalid={Boolean(errors.gpa)} aria-describedby={errors.gpa ? "gpa-help gpa-error" : "gpa-help"} />
              <span id="gpa-help" className="field-help">Optional, on a 0–4 scale.</span><ErrorText id="gpa-error" message={errors.gpa} />
            </div>
            <div className="field"><FieldLabel htmlFor="citizenship_region">Citizenship region</FieldLabel><input id="citizenship_region" name="citizenship_region" value={values.citizenship_region} onChange={updateField("citizenship_region")} placeholder="e.g. North America" /></div>
          </div>
          <h2 className="form-section-title">About your interests</h2>
          <div className="field"><FieldLabel htmlFor="activity_tags">Activity tags</FieldLabel><input id="activity_tags" name="activity_tags" value={values.activity_tags} onChange={updateField("activity_tags")} /><span className="field-help">Separate activities with commas so matching explanations can stay specific.</span></div>
          <label className="checkbox-field"><input id="financial_need" name="financial_need" type="checkbox" checked={values.financial_need} onChange={updateField("financial_need")} /><span><strong>Include financial need in matching context</strong><small>This is optional and can be changed later.</small></span></label>
          <button className="button" type="submit">Save profile <span aria-hidden="true">→</span></button>
          {saved && <div className="notice" role="status"><span aria-hidden="true">✓</span><span>Your profile details are ready to use in your scholarship planning.</span></div>}
        </form>
        <aside className="side-callout"><strong>Why we ask</strong>These details help show which criteria are met, unknown, or not met. They are guidance only — not a prediction of an award decision.<br /><br /><strong>Keep it current</strong>You can update your profile as your studies, activities, and goals change.</aside>
      </div>
    </div>
  </AppShell>;
}
