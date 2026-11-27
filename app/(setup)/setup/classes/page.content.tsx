"use client";

import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  type Control,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import { confirm } from "@/components/ui/Confirm";
import { FileUrl } from "@/components/ui/FileUrl";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type TInput as OrgTInput,
  schema as orgSchema,
} from "@/configuration/organization";
import {
  defaultValues,
  schema,
  type TInput,
  type TOutput,
} from "@/configuration/organizations";
import { Identifier, useConfig } from "@/hooks/useConfig";
import { useConfigurationForm } from "@/hooks/useConfigurationForm";
import {
  createConfigurationId,
  withConfigurationId,
} from "@/lib/configurationUtils";
import { slugify } from "@/lib/slugs";
import { isNullOrWhitespace } from "@/lib/string";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const emptyOrg: NonNullable<TInput["organizations"]>[number] = {
  id: "",
  slugs: [],
  name: "",
  type: "Class",
  logo: "",
};

function OrgMetadataFields({
  control,
  index,
}: {
  control: Control<TInput>;
  index: number;
}) {
  return (
    <>
      <Controller
        control={control}
        name={`organizations.${index}.name`}
        render={({ field, fieldState: { error } }) => (
          <div className={"grid gap-2"}>
            <Label htmlFor={`organizations.${index}.name`}>Name</Label>
            <Input
              {...field}
              id={`organizations.${index}.name`}
              placeholder={"Grade 10 · Batch 2083"}
              className={cn("w-full", error && "border-destructive")}
            />
            {error && (
              <small className={"text-destructive"}>{error.message}</small>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name={`organizations.${index}.logo`}
        render={({ field, fieldState: { error } }) => (
          <div className={"grid gap-2"}>
            <Label htmlFor={`organizations.${index}.logo`}>
              Logo (optional)
            </Label>
            <FileUrl
              {...field}
              id={`organizations.${index}.logo`}
              placeholder={"https://example.com/logo.png"}
              className={cn("w-full", error && "border-destructive")}
            />
            {error && (
              <small className={"text-destructive"}>{error.message}</small>
            )}
          </div>
        )}
      />
    </>
  );
}

function OrgForm({
  orgIndex,
  onClose,
  onSave,
  onDelete,
  saving,
  deleting,
  hasMetadataChanges,
}: {
  orgIndex: number;
  onClose: () => void;
  onSave: () => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  saving: boolean;
  deleting: boolean;
  hasMetadataChanges: boolean;
}) {
  const { control, trigger } = useFormContext<TInput>();
  const selectedOrg = useWatch({ control, name: `organizations.${orgIndex}` });
  const selectedOrgId = selectedOrg?.id || "NA";

  const {
    config: orgConfig,
    isLoadingConfig: isLoadingOrgDetails,
    isSavingConfig: isSavingOrgDetails,
    saveConfig: saveOrgDetails,
  } = useConfig(Identifier.Organization, { id: selectedOrgId });

  const [details, setDetails] = useState<{
    summary: OrgTInput["summary"];
    people: { id: string; position: string; fieldArrayId: string }[];
  }>({ summary: "", people: [] });
  const prevConfigRef = useRef<typeof orgConfig | undefined>(undefined);

  useEffect(() => {
    if (orgConfig !== undefined && orgConfig !== prevConfigRef.current) {
      setDetails({
        summary: orgConfig.summary || "",
        people: (orgConfig.people || []).map((p) => ({
          ...p,
          fieldArrayId: crypto.randomUUID(),
        })),
      });
      prevConfigRef.current = orgConfig;
    }
  }, [orgConfig]);

  const hasDetailsChanges =
    details.summary !== (orgConfig?.summary || "") ||
    JSON.stringify(details.people.map(({ fieldArrayId, ...rest }) => rest)) !==
      JSON.stringify(orgConfig?.people || []);

  async function saveDetails() {
    if (!selectedOrg) {
      return;
    }
    await saveOrgDetails(orgSchema.parse(details));
  }

  async function saveMetadata() {
    if (!selectedOrg) {
      return;
    }
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    await onSave();
  }

  if (!selectedOrg) {
    return null;
  }

  return (
    <>
      <div className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
        <div
          className={"flex items-center justify-between gap-4 border-b pb-4"}
        >
          <div>
            <h2 className={"font-medium"}>
              {selectedOrg.name || "Untitled class"}
            </h2>
            <p className={"mt-1 text-sm text-muted-foreground"}>
              Class metadata
            </p>
          </div>

          <Button
            type={"button"}
            size={"icon-sm"}
            variant={"ghost"}
            className={"text-destructive cursor-pointer hover:-translate-y-px"}
            onClick={() => onDelete(orgIndex)}
            aria-label={"Delete class"}
            disabled={deleting}
          >
            {deleting ? <Spinner /> : <Trash2 />}
          </Button>
        </div>
        <OrgMetadataFields control={control} index={orgIndex} />

        <div className={"flex justify-end border-t pt-4"}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                type="button"
                disabled={saving || deleting || !hasMetadataChanges}
              >
                <Button
                  type={"button"}
                  size={"sm"}
                  variant={"outline"}
                  onClick={async () => await saveMetadata()}
                  className={
                    "cursor-pointer hover:-translate-y-px bg-primary text-secondary"
                  }
                  disabled={saving || deleting || !hasMetadataChanges}
                >
                  {saving ? <Spinner /> : "Save"}
                </Button>
              </TooltipTrigger>
              {!hasMetadataChanges && !saving && (
                <TooltipContent>No metadata changes to save</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}>
        <div className={"border-b pb-4"}>
          <h2 className={"font-medium"}>Class details</h2>
          <p className={"mt-1 text-sm text-muted-foreground"}>
            Description and associated people
          </p>
        </div>

        <div className={"grid gap-2"}>
          <Label>Description</Label>
          {isLoadingOrgDetails ? (
            <div
              className={
                "flex min-h-40 items-center justify-center rounded-lg border"
              }
            >
              <Spinner />
            </div>
          ) : (
            <RichTextEditor
              key={selectedOrg.id}
              value={details.summary || ""}
              onChange={(value) =>
                setDetails((prev) => ({ ...prev, summary: value }))
              }
              className={"min-h-40"}
            />
          )}
        </div>

        <div className={"grid gap-2"}>
          <Label>People</Label>
          {isLoadingOrgDetails ? (
            <div
              className={
                "flex min-h-20 items-center justify-center rounded-lg border"
              }
            >
              <Spinner />
            </div>
          ) : (
            <PeopleField
              people={details.people || []}
              onChange={(people) => setDetails((prev) => ({ ...prev, people }))}
            />
          )}
        </div>

        <div className={"flex justify-end gap-2"}>
          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={onClose}
            className={"cursor-pointer hover:-translate-y-px mt-2"}
            disabled={hasDetailsChanges || hasMetadataChanges}
          >
            Close
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                type="button"
                disabled={
                  isSavingOrgDetails ||
                  isLoadingOrgDetails ||
                  !hasDetailsChanges
                }
              >
                <Button
                  type={"button"}
                  size={"sm"}
                  variant={"outline"}
                  onClick={async () => await saveDetails()}
                  className={
                    "cursor-pointer hover:-translate-y-px mt-2 bg-primary text-secondary"
                  }
                  disabled={
                    isSavingOrgDetails ||
                    isLoadingOrgDetails ||
                    !hasDetailsChanges
                  }
                >
                  {isSavingOrgDetails ? <Spinner /> : "Save"}
                </Button>
              </TooltipTrigger>
              {!hasDetailsChanges && !isSavingOrgDetails && (
                <TooltipContent>No details changes to save</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

function PeopleField({
  people,
  onChange,
}: {
  people: { id: string; position: string; fieldArrayId: string }[];
  onChange: (
    people: { id: string; position: string; fieldArrayId: string }[],
  ) => void;
}) {
  const { config: peopleConfig } = useConfig(Identifier.People);
  const peopleOptions = peopleConfig?.people || [];

  function movePerson(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= people.length) return;

    const updated = [...people];
    const current = updated[index];
    const adjacent = updated[nextIndex];
    if (!current || !adjacent) return;
    updated[index] = adjacent;
    updated[nextIndex] = current;
    onChange(updated);
  }

  return (
    <div className={"grid gap-2"}>
      {people.map((person, index) => (
        <div
          key={person.fieldArrayId}
          className={
            "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2"
          }
        >
          <Select
            value={person.id || ""}
            onValueChange={(value) => {
              const updated = people.map((p) =>
                p.fieldArrayId === person.fieldArrayId
                  ? { ...p, id: value || "" }
                  : p,
              );
              onChange(updated);
            }}
          >
            <SelectTrigger
              className={"w-full"}
              aria-label={`Person ${index + 1}`}
            >
              <SelectValue placeholder={"Select a person"} />
            </SelectTrigger>
            <SelectContent>
              {peopleOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} description={opt.id}>
                  {opt.name || `#${opt.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            aria-label={`Position for person ${index + 1}`}
            value={person.position || ""}
            onChange={(e) => {
              const updated = people.map((p) =>
                p.fieldArrayId === person.fieldArrayId
                  ? { ...p, position: e.target.value }
                  : p,
              );
              onChange(updated);
            }}
            placeholder={"Position"}
          />

          <div className={"flex flex-col"}>
            <Button
              type={"button"}
              size={"icon-sm"}
              variant={"ghost"}
              className={"text-muted-foreground"}
              onClick={() => movePerson(index, -1)}
              aria-label={`Move person ${index + 1} up`}
              disabled={index === 0}
            >
              <ChevronUp aria-hidden="true" />
            </Button>
            <Button
              type={"button"}
              size={"icon-sm"}
              variant={"ghost"}
              className={"text-muted-foreground"}
              onClick={() => movePerson(index, 1)}
              aria-label={`Move person ${index + 1} down`}
              disabled={index === people.length - 1}
            >
              <ChevronDown aria-hidden="true" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type={"button"}
        size={"sm"}
        variant={"outline"}
        onClick={() =>
          onChange([
            ...people,
            { id: "", position: "", fieldArrayId: crypto.randomUUID() },
          ])
        }
        className={"cursor-pointer hover:-translate-y-px self-start"}
      >
        <Plus className={"size-4"} />
        Add person
      </Button>
    </div>
  );
}

function OrgPreview({
  org,
}: {
  org: NonNullable<TInput["organizations"]>[number];
}) {
  return (
    <>
      <p className={"truncate font-medium text-muted-foreground"}>
        {org.name || "Untitled class"}
      </p>

      <p className={"truncate text-sm text-muted-foreground"}>Class</p>
    </>
  );
}

function OrgCardHeader({
  org,
  onEdit,
  onDelete,
}: {
  org: NonNullable<TInput["organizations"]>[number];
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0"}>
        <p className={"truncate font-medium text-muted-foreground"}>
          #{org.id}
        </p>
      </div>

      <div className={"flex shrink-0 gap-2"}>
        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          onClick={onEdit}
          className="cursor-pointer hover:-translate-y-px"
          aria-label={"Edit class"}
        >
          <Pencil />
        </Button>

        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          className={"text-destructive cursor-pointer hover:-translate-y-px"}
          onClick={onDelete}
          aria-label={"Delete class"}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

function PageContent() {
  const {
    isLoadingConfig,
    saveConfig,
    isSavingConfig,
    form,
    control,
    handleSubmit,
    formValues,
    hasChanges,
    originalConfig,
  } = useConfigurationForm(Identifier.Organizations, schema, defaultValues);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const {
    fields: orgs,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "organizations",
    keyName: "fieldArrayId",
  });
  const orgsWatch = useWatch({ control, name: "organizations" }) || [];

  const [deletingOrg, setDeletingOrg] = useState<boolean>(false);

  const classOrgs = (orgsWatch as NonNullable<TInput["organizations"]>).filter(
    (org) => org.type === "Class",
  );
  const allClassOrgs = (originalConfig?.organizations || []).filter(
    (org) => org.type === "Class",
  );

  async function deleteOrg(index: number) {
    setDeletingOrg(true);
    const approved = await confirm({
      title: "Delete class?",
      message:
        "Are you sure you want to delete this class? This action cannot be undone.",
      actions: [
        {
          label: "Cancel",
          buttonProps: { variant: "outline" },
          onClick: async () => false,
        },
        {
          label: "Delete",
          buttonProps: { variant: "destructive" },
          onClick: async () => true,
        },
      ],
    });

    if (!approved) {
      setDeletingOrg(false);
      return;
    }

    const org = orgs[index];
    if (!org) {
      setDeletingOrg(false);
      return;
    }

    const deletedOrgId = org.id;
    const wasPreviouslySaved =
      allClassOrgs.some((p) => p.id === deletedOrgId) ?? false;
    remove(index);
    if (wasPreviouslySaved) {
      await save(schema.parse(form.getValues()));
    }
    if (editingOrgId === deletedOrgId) {
      setEditingOrgId(null);
    }
    setDeletingOrg(false);
  }

  async function save(values: TOutput) {
    for (const org of values.organizations) {
      if (isNullOrWhitespace(org.id)) {
        org.id = createConfigurationId("org");
      }

      const exhaustedSlugsExceptThisOrg = new Set(
        values.organizations
          .filter((x) => x.id !== org.id)
          .flatMap((x) => x.slugs)
          .map((x) => x.slug),
      );
      const activeSlugCandidate = slugify(
        org.name,
        exhaustedSlugsExceptThisOrg,
      );
      let foundActiveSlug = false;
      for (const slugEntry of org.slugs) {
        if (slugEntry.slug === activeSlugCandidate) {
          slugEntry.isActive = true;
          foundActiveSlug = true;
          continue;
        }
        slugEntry.isActive = false;
      }
      if (!foundActiveSlug) {
        org.slugs.push({
          slug: activeSlugCandidate,
          isActive: true,
        });
      }
    }

    await saveConfig(values);
  }

  if (isLoadingConfig) {
    return (
      <FullScreenMessage>
        <Spinner className={"size-10"} />
      </FullScreenMessage>
    );
  }

  return (
    <ConfigurationFormWrapper
      className={styles.page}
      title={"Classes Configuration"}
      config={formValues}
      form={form}
    >
      <form
        onSubmit={handleSubmit(save)}
        className={cn(styles.form, "grid max-w-3xl gap-6")}
      >
        <div
          className={
            "flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
          }
        >
          <div>
            <Label>Classes</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>
              Manage school classes.
            </p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const org = withConfigurationId(emptyOrg, "org");
              append(org);
              setEditingOrgId(org.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add class
          </Button>
        </div>

        {editingOrgId === null ? (
          <>
            {classOrgs.map((org) => (
              <div
                key={org.id}
                className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}
              >
                <OrgCardHeader
                  org={org}
                  onEdit={() => setEditingOrgId(org.id)}
                  onDelete={() => {
                    const idx = orgs.findIndex((p) => p.id === org.id);
                    if (idx !== -1) deleteOrg(idx);
                  }}
                />

                <div className={"grid gap-1 border-t pt-4"}>
                  <OrgPreview org={org} />
                </div>
              </div>
            ))}

            {classOrgs.length === 0 && (
              <div
                className={
                  "rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"
                }
              >
                No classes yet. Add your first class.
              </div>
            )}

            <div className={"flex justify-end"}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    disabled={isSavingConfig || !hasChanges}
                  >
                    <Button
                      type={"submit"}
                      size={"sm"}
                      variant={"outline"}
                      className={
                        "cursor-pointer mt-2 bg-primary text-secondary hover:-translate-y-px"
                      }
                      disabled={isSavingConfig || !hasChanges}
                    >
                      {isSavingConfig ? <Spinner /> : "Save"}
                    </Button>
                  </TooltipTrigger>
                  {!hasChanges && !isSavingConfig && (
                    <TooltipContent>No changes to save</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        ) : (
          <OrgForm
            orgIndex={orgs.findIndex((org) => org.id === editingOrgId)}
            onClose={() => setEditingOrgId(null)}
            onSave={async () => await save(schema.parse(formValues))}
            onDelete={async (index) => await deleteOrg(index)}
            saving={isSavingConfig}
            deleting={deletingOrg}
            hasMetadataChanges={hasChanges}
          />
        )}
      </form>
    </ConfigurationFormWrapper>
  );
}

export default PageContent;
