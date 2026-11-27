"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  defaultValues,
  schema,
  type TInput,
  type TOutput,
} from "@/configuration/people";
import {
  type TInput as PersonTInput,
  defaultValues as personDefaultValues,
  schema as personSchema,
} from "@/configuration/person";
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

const emptyPerson: NonNullable<TInput["people"]>[number] = {
  id: "",
  slugs: [],
  name: "",
};

function PersonMetadataFields({
  control,
  index,
}: {
  control: Control<TInput>;
  index: number;
}) {
  return (
    <Controller
      control={control}
      name={`people.${index}.name`}
      render={({ field, fieldState: { error } }) => (
        <div className={"grid gap-2"}>
          <Label htmlFor={`people.${index}.name`}>Name</Label>
          <Input
            {...field}
            id={`people.${index}.name`}
            placeholder={"Full name"}
            className={cn("w-full", error && "border-destructive")}
          />
          {error && (
            <small className={"text-destructive"}>{error.message}</small>
          )}
        </div>
      )}
    />
  );
}

function PersonForm({
  personIndex,
  onClose,
  onSave,
  onDelete,
  saving,
  deleting,
  hasMetadataChanges,
}: {
  personIndex: number;
  onClose: () => void;
  onSave: () => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  saving: boolean;
  deleting: boolean;
  hasMetadataChanges: boolean;
}) {
  const { control, trigger } = useFormContext<TInput>();
  const selectedPerson = useWatch({
    control,
    name: `people.${personIndex}`,
  });
  const selectedPersonId = selectedPerson?.id || "NA";

  const {
    config: personConfig,
    isLoadingConfig: isLoadingPersonDetails,
    isSavingConfig: isSavingPersonDetails,
    saveConfig: savePersonDetails,
  } = useConfig(Identifier.Person, { id: selectedPersonId });

  const [details, setDetails] = useState<PersonTInput>(personDefaultValues);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const prevConfigRef = useRef<typeof personConfig | undefined>(undefined);

  useEffect(() => {
    if (personConfig !== undefined && personConfig !== prevConfigRef.current) {
      setDetails({
        photo: personConfig.photo || "",
        phone: personConfig.phone || "",
        email: personConfig.email || "",
        schedules: personConfig.schedules || [],
      });
      setScheduleError(null);
      prevConfigRef.current = personConfig;
    }
  }, [personConfig]);

  const hasDetailsChanges =
    details.photo !== (personConfig?.photo || "") ||
    details.phone !== (personConfig?.phone || "") ||
    details.email !== (personConfig?.email || "") ||
    JSON.stringify(details.schedules) !==
      JSON.stringify(personConfig?.schedules || []);

  async function saveDetails() {
    if (!selectedPerson) {
      return;
    }
    const schedules = details.schedules || [];
    if (
      schedules.some(
        (schedule) =>
          !schedule.weekday.trim() ||
          !schedule.from.trim() ||
          !schedule.to.trim(),
      )
    ) {
      setScheduleError("Complete the day and time fields for each schedule.");
      return;
    }
    setScheduleError(null);
    await savePersonDetails(personSchema.parse(details));
  }

  function updateSchedule(
    index: number,
    updates: Partial<NonNullable<PersonTInput["schedules"]>[number]>,
  ) {
    setDetails((prev) => ({
      ...prev,
      schedules: (prev.schedules || []).map((schedule, scheduleIndex) =>
        scheduleIndex === index ? { ...schedule, ...updates } : schedule,
      ),
    }));
    setScheduleError(null);
  }

  async function saveMetadata() {
    if (!selectedPerson) {
      return;
    }
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    await onSave();
  }

  if (!selectedPerson) {
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
              {selectedPerson.name || "Untitled person"}
            </h2>
            <p className={"mt-1 text-sm text-muted-foreground"}>
              Person metadata
            </p>
          </div>

          <Button
            type={"button"}
            size={"icon-sm"}
            variant={"ghost"}
            className={"text-destructive cursor-pointer hover:-translate-y-px"}
            onClick={() => onDelete(personIndex)}
            aria-label={"Delete person"}
            disabled={deleting}
          >
            {deleting ? <Spinner /> : <Trash2 />}
          </Button>
        </div>
        <PersonMetadataFields control={control} index={personIndex} />

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
          <h2 className={"font-medium"}>Person details</h2>
          <p className={"mt-1 text-sm text-muted-foreground"}>
            Photo, contact information, and schedule
          </p>
        </div>

        <div className={"grid gap-3 md:grid-cols-2"}>
          <div className={"grid gap-2"}>
            <Label htmlFor={"person-photo"}>Photo</Label>
            {isLoadingPersonDetails ? (
              <div
                className={
                  "flex h-10 items-center justify-center rounded-lg border"
                }
              >
                <Spinner />
              </div>
            ) : (
              <FileUrl
                value={details.photo || ""}
                onChange={(value) =>
                  setDetails((prev) => ({ ...prev, photo: value }))
                }
                id={"person-photo"}
                placeholder={"https://example.com/person.jpg"}
              />
            )}
          </div>

          <div className={"grid gap-2"}>
            <Label>Phone</Label>
            {isLoadingPersonDetails ? (
              <div
                className={
                  "flex h-10 items-center justify-center rounded-lg border"
                }
              >
                <Spinner />
              </div>
            ) : (
              <Input
                value={details.phone || ""}
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder={"01-4XXXXXX"}
              />
            )}
          </div>

          <div className={"grid gap-2"}>
            <Label>Email</Label>
            {isLoadingPersonDetails ? (
              <div
                className={
                  "flex h-10 items-center justify-center rounded-lg border"
                }
              >
                <Spinner />
              </div>
            ) : (
              <Input
                value={details.email || ""}
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder={"person@school.edu.np"}
              />
            )}
          </div>
        </div>

        <div className={"grid gap-3"}>
          <div className={"flex items-center justify-between gap-4"}>
            <div>
              <Label>Schedule</Label>
              <p className={"mt-1 text-sm text-muted-foreground"}>
                Record office hours or other times this person is available.
              </p>
            </div>
            <Button
              type={"button"}
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                setDetails((prev) => ({
                  ...prev,
                  schedules: [
                    ...(prev.schedules || []),
                    { weekday: "", from: "", to: "", description: "" },
                  ],
                }));
                setScheduleError(null);
              }}
              disabled={isLoadingPersonDetails || isSavingPersonDetails}
              className={"shrink-0 cursor-pointer hover:-translate-y-px"}
            >
              <Plus aria-hidden="true" /> Add schedule
            </Button>
          </div>

          {isLoadingPersonDetails ? (
            <div
              className={
                "flex min-h-20 items-center justify-center rounded-lg border"
              }
            >
              <Spinner />
            </div>
          ) : (
            <div className={"grid gap-3"}>
              {(details.schedules || []).map((schedule, index) => (
                <div
                  key={`${selectedPersonId}-schedule-${JSON.stringify(schedule)}`}
                  className={"grid gap-3 rounded-lg border p-3"}
                >
                  <div className={"flex items-center justify-between gap-3"}>
                    <p className={"text-sm font-medium text-muted-foreground"}>
                      Schedule #{index + 1}
                    </p>
                    <Button
                      type={"button"}
                      size={"icon-sm"}
                      variant={"ghost"}
                      className={
                        "text-destructive cursor-pointer hover:-translate-y-px"
                      }
                      onClick={() => {
                        setDetails((prev) => ({
                          ...prev,
                          schedules: (prev.schedules || []).filter(
                            (_, scheduleIndex) => scheduleIndex !== index,
                          ),
                        }));
                        setScheduleError(null);
                      }}
                      aria-label={`Remove schedule ${index + 1}`}
                      disabled={isSavingPersonDetails}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>

                  <div className={"grid gap-3 sm:grid-cols-3"}>
                    <div className={"grid gap-2"}>
                      <Label htmlFor={`schedule-${index}-weekday`}>Day</Label>
                      <Input
                        id={`schedule-${index}-weekday`}
                        value={schedule.weekday}
                        onChange={(event) =>
                          updateSchedule(index, { weekday: event.target.value })
                        }
                        placeholder={"Monday"}
                        disabled={isSavingPersonDetails}
                      />
                    </div>
                    <div className={"grid gap-2"}>
                      <Label htmlFor={`schedule-${index}-from`}>From</Label>
                      <Input
                        id={`schedule-${index}-from`}
                        type={"time"}
                        value={schedule.from}
                        onChange={(event) =>
                          updateSchedule(index, { from: event.target.value })
                        }
                        disabled={isSavingPersonDetails}
                      />
                    </div>
                    <div className={"grid gap-2"}>
                      <Label htmlFor={`schedule-${index}-to`}>To</Label>
                      <Input
                        id={`schedule-${index}-to`}
                        type={"time"}
                        value={schedule.to}
                        onChange={(event) =>
                          updateSchedule(index, { to: event.target.value })
                        }
                        disabled={isSavingPersonDetails}
                      />
                    </div>
                  </div>

                  <div className={"grid gap-2"}>
                    <Label htmlFor={`schedule-${index}-description`}>
                      Description (optional)
                    </Label>
                    <Input
                      id={`schedule-${index}-description`}
                      value={schedule.description || ""}
                      onChange={(event) =>
                        updateSchedule(index, {
                          description: event.target.value,
                        })
                      }
                      placeholder={"Office hours"}
                      disabled={isSavingPersonDetails}
                    />
                  </div>
                </div>
              ))}

              {(details.schedules || []).length === 0 && (
                <p className={"text-sm text-muted-foreground"}>
                  No schedule added.
                </p>
              )}
            </div>
          )}

          {scheduleError && (
            <small className={"text-destructive"} role="alert">
              {scheduleError}
            </small>
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
                  isSavingPersonDetails ||
                  isLoadingPersonDetails ||
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
                    isSavingPersonDetails ||
                    isLoadingPersonDetails ||
                    !hasDetailsChanges
                  }
                >
                  {isSavingPersonDetails ? <Spinner /> : "Save"}
                </Button>
              </TooltipTrigger>
              {!hasDetailsChanges && !isSavingPersonDetails && (
                <TooltipContent>No details changes to save</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

function PersonPreview({
  person,
}: {
  person: NonNullable<TInput["people"]>[number];
}) {
  return (
    <p className={"truncate font-medium text-muted-foreground"}>
      {person.name || "Untitled person"}
    </p>
  );
}

function PersonCardHeader({
  person,
  onEdit,
  onDelete,
}: {
  person: NonNullable<TInput["people"]>[number];
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0"}>
        <p className={"truncate font-medium text-muted-foreground"}>
          #{person.id}
        </p>
      </div>

      <div className={"flex shrink-0 gap-2"}>
        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          onClick={onEdit}
          className="cursor-pointer hover:-translate-y-px"
          aria-label={"Edit person"}
        >
          <Pencil />
        </Button>

        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          className={"text-destructive cursor-pointer hover:-translate-y-px"}
          onClick={onDelete}
          aria-label={"Delete person"}
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
  } = useConfigurationForm(Identifier.People, schema, defaultValues);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const {
    fields: people,
    append,
    remove,
  } = useFieldArray({ control, name: "people", keyName: "fieldArrayId" });
  const peopleWatch = useWatch({ control, name: "people" }) || [];

  const [deletingPerson, setDeletingPerson] = useState<boolean>(false);

  async function deletePerson(index: number) {
    setDeletingPerson(true);
    const approved = await confirm({
      title: "Delete person?",
      message:
        "Are you sure you want to delete this person? This action cannot be undone.",
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
      setDeletingPerson(false);
      return;
    }

    const person = people[index];
    if (!person) {
      setDeletingPerson(false);
      return;
    }

    const deletedPersonId = person.id;
    const wasPreviouslySaved =
      originalConfig?.people?.some((p) => p.id === deletedPersonId) ?? false;
    remove(index);
    if (wasPreviouslySaved) {
      await save(schema.parse(form.getValues()));
    }
    if (editingPersonId === deletedPersonId) {
      setEditingPersonId(null);
    }
    setDeletingPerson(false);
  }

  async function save(values: TOutput) {
    for (const person of values.people) {
      if (isNullOrWhitespace(person.id)) {
        person.id = createConfigurationId("person");
      }

      const exhaustedSlugsExceptThisPerson = new Set(
        values.people
          .filter((x) => x.id !== person.id)
          .flatMap((x) => x.slugs)
          .map((x) => x.slug),
      );
      const activeSlugCandidate = slugify(
        person.name,
        exhaustedSlugsExceptThisPerson,
      );
      let foundActiveSlug = false;
      for (const slugEntry of person.slugs) {
        if (slugEntry.slug === activeSlugCandidate) {
          slugEntry.isActive = true;
          foundActiveSlug = true;
          continue;
        }
        slugEntry.isActive = false;
      }
      if (!foundActiveSlug) {
        person.slugs.push({
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
      title={"People Configuration"}
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
            <Label>People</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>
              Manage staff and personnel associated with organisations.
            </p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const person = withConfigurationId(emptyPerson, "person");
              append(person);
              setEditingPersonId(person.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add person
          </Button>
        </div>

        {editingPersonId === null ? (
          <>
            {peopleWatch.map((person) => (
              <div
                key={person.id}
                className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}
              >
                <PersonCardHeader
                  person={person}
                  onEdit={() => setEditingPersonId(person.id)}
                  onDelete={() => {
                    const idx = people.findIndex((p) => p.id === person.id);
                    if (idx !== -1) deletePerson(idx);
                  }}
                />

                <div className={"grid gap-1 border-t pt-4"}>
                  <PersonPreview person={person} />
                </div>
              </div>
            ))}

            {people.length === 0 && (
              <div
                className={
                  "rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"
                }
              >
                No people yet. Add your first person.
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
          <PersonForm
            personIndex={people.findIndex(
              (person) => person.id === editingPersonId,
            )}
            onClose={() => setEditingPersonId(null)}
            onSave={async () => await save(schema.parse(formValues))}
            onDelete={async (index) => await deletePerson(index)}
            saving={isSavingConfig}
            deleting={deletingPerson}
            hasMetadataChanges={hasChanges}
          />
        )}
      </form>
    </ConfigurationFormWrapper>
  );
}

export default PageContent;
