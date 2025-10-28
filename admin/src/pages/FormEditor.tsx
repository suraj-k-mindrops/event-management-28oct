import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";

interface Field {
  id: number;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

const FormEditor = () => {
  const [formFields, setFormFields] = useState<Field[]>([]);

  // Add-custom form inputs
  const [newType, setNewType] = useState<string>("text");
  const [newLabel, setNewLabel] = useState<string>("New Field");

  // drag state
  const dragIndexRef = useRef<number | null>(null);

  // preview values for interactive checks (in-memory only)
  const [previews, setPreviews] = useState<Record<number, string>>({});
  // raw editing text for options (so typing/pasting comma + space works smoothly)
  const [optionsEdit, setOptionsEdit] = useState<Record<number, string>>({});

  const handleOptionsChange = (id: number, value: string) =>
    setOptionsEdit((p) => ({ ...p, [id]: value }));

  const commitOptions = (id: number) => {
    const raw = optionsEdit[id] ?? "";
    const parsed = stringToOptions(raw);
    // update field options and normalize displayed value
    handleUpdateField(id, { options: parsed });
    setOptionsEdit((p) => ({ ...p, [id]: optionsToString(parsed) }));
  };

  // keep optionsEdit initialized for fields that don't yet have an edit string
  useEffect(() => {
    setOptionsEdit((prev) => {
      const next = { ...prev };
      formFields.forEach((f) => {
        if (next[f.id] === undefined) next[f.id] = optionsToString(f.options);
      });
      // remove entries for deleted fields
      Object.keys(next).forEach((k) => {
        const idNum = Number(k);
        if (!formFields.find((ff) => ff.id === idNum)) delete next[idNum];
      });
      return next;
    });
  }, [formFields]);

  const setPreviewValue = (id: number, value: string) =>
    setPreviews((p) => ({ ...p, [id]: value }));

  useEffect(() => {
    // start empty in-memory (no localStorage/database)
    setFormFields([]);
  }, []);

  // persist now only updates in-memory state (no localStorage/database)
  const persist = (fields: Field[]) => {
    setFormFields(fields);
  };

  // Add a new field based on the compact custom form
  const handleAddCustom = () => {
    const field: Field = {
      id: Date.now(),
      type: newType,
      label: newLabel || `${newType} field`,
      placeholder: "",
      required: false,
      options: newType === "select" || newType === "radio" ? ["Option 1"] : undefined,
    };
    persist([...formFields, field]);
    // initialize the raw edit string for the new field so typing works immediately
    setOptionsEdit((p) => ({ ...p, [field.id]: optionsToString(field.options) }));
    setNewLabel("New Field");
  };

  const handleDeleteField = (id: number) => {
    persist(formFields.filter((f) => f.id !== id));
    setOptionsEdit((p) => {
      const copy = { ...p };
      delete copy[id];
      return copy;
    });
  };

  const handleUpdateField = (id: number, patch: Partial<Field>) => {
    persist(formFields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  // options provided as comma-separated string in the editor
  const optionsToString = (opts?: string[]) => (opts ? opts.join(", ") : "");

  const stringToOptions = (s: string) => {
    if (!s) return [];

    // Normalize invisible / non-standard spaces to plain space
    let normalized = s.replace(/[\u00A0\u200B\uFEFF\u2060]/g, " ");

    // Replace various comma-like / punctuation separators with a plain comma
    // (U+201A ‚ , U+FF0C fullwidth comma, U+3001 ideographic comma, semicolons, pipes, slashes, bullets, etc.)
    normalized = normalized.replace(/[\u201A\u2018\u2019\u201B\uFF0C\u3001\uFF1B\u2014\u2013]/g, ",");
    normalized = normalized.replace(/[;|\/\\•·\u2022]/g, ",");

    // Convert newlines to commas (paste often includes line breaks)
    normalized = normalized.replace(/[\r\n]+/g, ",");

    // Collapse whitespace around commas and collapse multiple commas
    normalized = normalized.replace(/\s*,\s*/g, ",").replace(/,+/g, ",");

    normalized = normalized.trim();
    if (!normalized) return [];

    return normalized.split(",").map((o) => o.trim()).filter(Boolean);
  };

  // Drag & drop handlers (simple HTML5 DnD)
  const onDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = dragIndexRef.current;
    if (dragIndex === null || dragIndex === undefined) return;
    if (dragIndex === dropIndex) return;
    const items = [...formFields];
    const [moved] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, moved);
    dragIndexRef.current = null;
    persist(items);
  };

  return (
    <Card className="container mx-auto mt-8 p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Form Editor</h1>

      {/* Add custom: single compact control for admin to choose type + label */}
      <div className="mb-4 p-4 border rounded">
        <Label className="text-sm font-medium mb-2">Add custom field</Label>
        <div className="flex flex-col sm:flex-row sm:items-end gap-2">
          <div className="flex-1">
            <Label className="text-xs">Type</Label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>

          <div className="flex-1">
            <Label className="text-xs">Label</Label>
            <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          </div>

          <div className="">
            <Button onClick={handleAddCustom} className="mt-1 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      <div>
        <h2 className="text-xl font-bold mb-3">Form (drag to reorder)</h2>
        <div className="space-y-3">
          {formFields.map((field, idx) => (
            <Card
              key={field.id}
              className="p-3 cursor-move"
              draggable
              onDragStart={(e) => onDragStart(e, idx)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, idx)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                      />
                    </div>

                    <div className="w-40">
                      <Label className="text-sm font-medium">Required</Label>
                      <div className="flex items-center mt-1">
                        <Checkbox
                          id={`req-${field.id}`}
                          checked={!!field.required}
                          onCheckedChange={(v) => handleUpdateField(field.id, { required: !!v })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Placeholder</Label>
                    <Input
                      value={field.placeholder ?? ""}
                      onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                    />
                  </div>

                  {/* Options editor + interactive preview for select/radio */}
                  {(field.type === "select" || field.type === "radio") && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Options (comma-separated)</Label>
                        <Input
                          value={optionsEdit[field.id] ?? optionsToString(field.options)}
                          onChange={(e) => handleOptionsChange(field.id, e.target.value)}
                          onBlur={() => commitOptions(field.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              // prevent form submit if inside a form; commit options
                              e.preventDefault();
                              commitOptions(field.id);
                            }
                          }}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Preview (interactive)</Label>
                        {field.type === "select" ? (
                          <select
                            className="w-full p-2 border rounded"
                            value={previews[field.id] ?? ""}
                            onChange={(e) => setPreviewValue(field.id, e.target.value)}
                          >
                            <option value="">{field.placeholder || field.label}</option>
                            {(field.options ?? []).map((o, i) => (
                              <option key={i} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="space-y-1">
                            {(field.options ?? []).map((o, i) => (
                              <label key={i} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`preview-radio-${field.id}`}
                                  value={o}
                                  checked={previews[field.id] === o}
                                  onChange={(e) => setPreviewValue(field.id, e.target.value)}
                                />
                                <span>{o}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteField(field.id)} className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                  <div className="text-xs text-muted-foreground">Drag to reorder</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FormEditor;
