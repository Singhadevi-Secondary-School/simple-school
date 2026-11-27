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
import { FileUrlArray } from "@/components/ui/FileUrlArray";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type TInput as ResultTInput,
  defaultValues as resultDefaultValues,
  schema as resultSchema,
} from "@/configuration/result";
import {
  defaultValues,
  schema,
  type TInput,
  type TOutput,
} from "@/configuration/results";
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

const emptyResult: NonNullable<TInput["results"]>[number] = {
  id: "",
  slugs: [],
  title: "",
};

function ResultMetadataFields({
  control,
  index,
}: {
  control: Control<TInput>;
  index: number;
}) {
  return (
    <Controller
      control={control}
      name={`results.${index}.title`}
      render={({ field, fieldState: { error } }) => (
        <div className={"grid gap-2"}>
          <Label htmlFor={`results.${index}.title`}>Title</Label>
          <Input
            {...field}
            id={`results.${index}.title`}
            placeholder={"Final Exam 2026"}
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

function ResultForm({
  resultIndex,
  onClose,
  onSave,
  onDelete,
  saving,
  deleting,
  hasMetadataChanges,
}: {
  resultIndex: number;
  onClose: () => void;
  onSave: () => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  saving: boolean;
  deleting: boolean;
  hasMetadataChanges: boolean;
}) {
  const { control, trigger } = useFormContext<TInput>();
  const selectedResult = useWatch({
    control,
    name: `results.${resultIndex}`,
  });
  const selectedResultId = selectedResult?.id || "NA";

  const {
    config: resultConfig,
    isLoadingConfig: isLoadingResultDetails,
    isSavingConfig: isSavingResultDetails,
    saveConfig: saveResultDetails,
  } = useConfig(Identifier.Result, { id: selectedResultId });

  const [details, setDetails] = useState<ResultTInput>(resultDefaultValues);
  const prevConfigRef = useRef<typeof resultConfig | undefined>(undefined);

  useEffect(() => {
    if (resultConfig !== undefined && resultConfig !== prevConfigRef.current) {
      setDetails({
        description: resultConfig.description || "",
        attachments: resultConfig.attachments || [],
        individualResults: resultConfig.individualResults || [],
      });
      prevConfigRef.current = resultConfig;
    }
  }, [resultConfig]);

  const hasDetailsChanges =
    details.description !== (resultConfig?.description || "") ||
    JSON.stringify(details.attachments) !==
      JSON.stringify(resultConfig?.attachments || []) ||
    JSON.stringify(details.individualResults) !==
      JSON.stringify(resultConfig?.individualResults || []);

  async function saveDetails() {
    if (!selectedResult) {
      return;
    }
    await saveResultDetails(resultSchema.parse(details));
  }

  async function saveMetadata() {
    if (!selectedResult) {
      return;
    }
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    await onSave();
  }

  if (!selectedResult) {
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
              {selectedResult.title || "Untitled result"}
            </h2>
            <p className={"mt-1 text-sm text-muted-foreground"}>
              Result metadata
            </p>
          </div>

          <Button
            type={"button"}
            size={"icon-sm"}
            variant={"ghost"}
            className={"text-destructive cursor-pointer hover:-translate-y-px"}
            onClick={() => onDelete(resultIndex)}
            aria-label={"Delete result"}
            disabled={deleting}
          >
            {deleting ? <Spinner /> : <Trash2 />}
          </Button>
        </div>
        <ResultMetadataFields control={control} index={resultIndex} />

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
          <h2 className={"font-medium"}>Result details</h2>
          <p className={"mt-1 text-sm text-muted-foreground"}>
            Description, class-wide attachments, and individual results
          </p>
        </div>

        <div className={"grid gap-2"}>
          <Label>Description (optional)</Label>
          {isLoadingResultDetails ? (
            <div
              className={
                "flex min-h-40 items-center justify-center rounded-lg border"
              }
            >
              <Spinner />
            </div>
          ) : (
            <RichTextEditor
              key={selectedResult.id}
              value={details.description || ""}
              onChange={(value) =>
                setDetails((prev) => ({ ...prev, description: value }))
              }
              className={"min-h-40"}
            />
          )}
        </div>

        <div className={"grid gap-2"}>
          <Label>Class-wide Attachments (PDF URLs)</Label>
          {isLoadingResultDetails ? (
            <div
              className={
                "flex min-h-10 items-center justify-center rounded-lg border"
              }
            >
              <Spinner />
            </div>
          ) : (
            <FileUrlArray
              value={details.attachments || []}
              onChange={(value) =>
                setDetails((prev) => ({ ...prev, attachments: value }))
              }
              id={`result-${selectedResult.id}-attachments`}
              placeholder={"https://example.com/result.pdf"}
            />
          )}
          <p className={"text-xs text-muted-foreground"}>
            PDF files available to the whole class, such as a complete mark
            sheet.
          </p>
        </div>

        <div className={"grid gap-2"}>
          <Label>Individual Results (PDF URLs)</Label>
          {isLoadingResultDetails ? (
            <div
              className={
                "flex min-h-10 items-center justify-center rounded-lg border"
              }
            >
              <Spinner />
            </div>
          ) : (
            <FileUrlArray
              value={details.individualResults || []}
              onChange={(value) =>
                setDetails((prev) => ({ ...prev, individualResults: value }))
              }
              id={`result-${selectedResult.id}-individual-results`}
              placeholder={
                "https://example.com/results/2083-0412_2008-07-19.pdf"
              }
            />
          )}
          <p className={"text-xs text-muted-foreground"}>
            Name each PDF using symbolNumber_yyyy-mm-dd.pdf so it matches the
            symbol number and date of birth entered on the results page.
          </p>
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
                  isSavingResultDetails ||
                  isLoadingResultDetails ||
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
                    isSavingResultDetails ||
                    isLoadingResultDetails ||
                    !hasDetailsChanges
                  }
                >
                  {isSavingResultDetails ? <Spinner /> : "Save"}
                </Button>
              </TooltipTrigger>
              {!hasDetailsChanges && !isSavingResultDetails && (
                <TooltipContent>No details changes to save</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

function ResultPreview({
  result,
}: {
  result: NonNullable<TInput["results"]>[number];
}) {
  return (
    <p className={"truncate font-medium text-muted-foreground"}>
      {result.title || "Untitled result"}
    </p>
  );
}

function ResultCardHeader({
  result,
  onEdit,
  onDelete,
}: {
  result: NonNullable<TInput["results"]>[number];
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0"}>
        <p className={"truncate font-medium text-muted-foreground"}>
          #{result.id}
        </p>
      </div>

      <div className={"flex shrink-0 gap-2"}>
        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          onClick={onEdit}
          className="cursor-pointer hover:-translate-y-px"
          aria-label={"Edit result"}
        >
          <Pencil />
        </Button>

        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          className={"text-destructive cursor-pointer hover:-translate-y-px"}
          onClick={onDelete}
          aria-label={"Delete result"}
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
  } = useConfigurationForm(Identifier.Results, schema, defaultValues);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const {
    fields: results,
    append,
    remove,
  } = useFieldArray({ control, name: "results", keyName: "fieldArrayId" });
  const resultsWatch = useWatch({ control, name: "results" }) || [];

  const [deletingResult, setDeletingResult] = useState<boolean>(false);

  async function deleteResult(index: number) {
    setDeletingResult(true);
    const approved = await confirm({
      title: "Delete result?",
      message:
        "Are you sure you want to delete this result? This action cannot be undone.",
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
      setDeletingResult(false);
      return;
    }

    const result = results[index];
    if (!result) {
      setDeletingResult(false);
      return;
    }

    const deletedResultId = result.id;
    const wasPreviouslySaved =
      originalConfig?.results?.some((p) => p.id === deletedResultId) ?? false;
    remove(index);
    if (wasPreviouslySaved) {
      await save(schema.parse(form.getValues()));
    }
    if (editingResultId === deletedResultId) {
      setEditingResultId(null);
    }
    setDeletingResult(false);
  }

  async function save(values: TOutput) {
    for (const result of values.results) {
      if (isNullOrWhitespace(result.id)) {
        result.id = createConfigurationId("result");
      }

      const exhaustedSlugsExceptThisResult = new Set(
        values.results
          .filter((x) => x.id !== result.id)
          .flatMap((x) => x.slugs)
          .map((x) => x.slug),
      );
      const activeSlugCandidate = slugify(
        result.title,
        exhaustedSlugsExceptThisResult,
      );
      let foundActiveSlug = false;
      for (const slugEntry of result.slugs) {
        if (slugEntry.slug === activeSlugCandidate) {
          slugEntry.isActive = true;
          foundActiveSlug = true;
          continue;
        }
        slugEntry.isActive = false;
      }
      if (!foundActiveSlug) {
        result.slugs.push({
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
      title={"Results Configuration"}
      config={formValues}
      form={form}
    >
      <form
        onSubmit={handleSubmit(save)}
        className={cn(styles.form, "grid max-w-3xl gap-6")}
      >
        <Controller
          control={control}
          name={"summary"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"resultsSummary"}>Summary</Label>
              <RichTextEditor
                id={"resultsSummary"}
                placeholder={"Introduce the results page"}
                value={field.value || ""}
                onChange={field.onChange}
                className={cn("w-full", error && "border-destructive")}
              />
              {error && (
                <small className={"text-destructive"}>{error.message}</small>
              )}
            </div>
          )}
        />

        <div
          className={
            "flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
          }
        >
          <div>
            <Label>Results</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>
              Manage exam results and their attachments.
            </p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const result = withConfigurationId(emptyResult, "result");
              append(result);
              setEditingResultId(result.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add result
          </Button>
        </div>

        {editingResultId === null ? (
          <>
            {resultsWatch.map((result) => (
              <div
                key={result.id}
                className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}
              >
                <ResultCardHeader
                  result={result}
                  onEdit={() => setEditingResultId(result.id)}
                  onDelete={() => {
                    const idx = results.findIndex((p) => p.id === result.id);
                    if (idx !== -1) deleteResult(idx);
                  }}
                />

                <div className={"grid gap-1 border-t pt-4"}>
                  <ResultPreview result={result} />
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <div
                className={
                  "rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"
                }
              >
                No results yet. Add your first result.
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
          <ResultForm
            resultIndex={results.findIndex(
              (result) => result.id === editingResultId,
            )}
            onClose={() => setEditingResultId(null)}
            onSave={async () => await save(schema.parse(formValues))}
            onDelete={async (index) => await deleteResult(index)}
            saving={isSavingConfig}
            deleting={deletingResult}
            hasMetadataChanges={hasChanges}
          />
        )}
      </form>
    </ConfigurationFormWrapper>
  );
}

export default PageContent;
