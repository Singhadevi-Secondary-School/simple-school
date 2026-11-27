"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Control,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { ArrayInput } from "@/components/ui/ArrayInput";
import { Button } from "@/components/ui/button";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import { confirm } from "@/components/ui/Confirm";
import { DatePicker } from "@/components/ui/DatePicker";
import { FileUrl } from "@/components/ui/FileUrl";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/configuration/contents";
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

const emptyItem: NonNullable<TInput["list"]>[number] = {
  type: "notice",
  id: "",
  slugs: [],
  title: "",
  summary: "",
  date: "",
  category: "",
  associatedOrganisationIds: [],
  attachments: [],
};

function NoticeMetadataFields({
  control,
  index,
  categorySuggestions,
}: {
  control: Control<TInput>;
  index: number;
  categorySuggestions: string[];
}) {
  const {
    fields: attachments,
    append: appendAttachment,
    remove: removeAttachment,
  } = useFieldArray({
    control,
    name: `list.${index}.attachments`,
  });

  return (
    <>
      <div className={"grid gap-3 md:grid-cols-2"}>
        <Controller
          control={control}
          name={`list.${index}.title`}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={`list.${index}.title`}>Title</Label>
              <Input
                {...field}
                id={`list.${index}.title`}
                placeholder={"Notice title"}
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
          name={`list.${index}.date`}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={`list.${index}.date`}>Date</Label>
              <DatePicker
                {...field}
                id={`list.${index}.date`}
                className={cn("w-full", error && "border-destructive")}
              />
              {error && (
                <small className={"text-destructive"}>{error.message}</small>
              )}
            </div>
          )}
        />
      </div>

      <Controller
        control={control}
        name={`list.${index}.summary`}
        render={({ field, fieldState: { error } }) => (
          <div className={"grid gap-2"}>
            <Label htmlFor={`list.${index}.summary`}>Summary</Label>
            <Textarea
              {...field}
              id={`list.${index}.summary`}
              placeholder={"A concise description of this notice"}
              className={cn("w-full", error && "border-destructive")}
            />
            <p className={"text-xs text-muted-foreground"}>
              Shown on the notice card and used in search previews.
            </p>
            {error && (
              <small className={"text-destructive"}>{error.message}</small>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name={`list.${index}.category`}
        render={({ field, fieldState: { error } }) => (
          <div className={"grid gap-2"}>
            <Label htmlFor={`list.${index}.category`}>
              Category (optional)
            </Label>
            <ArrayInput
              value={[field.value || ""].filter(Boolean)}
              onChange={(values) => field.onChange(values?.[0] || "")}
              id={`list.${index}.category`}
              placeholder={"Type a category and press Enter"}
              suggestions={categorySuggestions}
              className={cn("w-full", error && "border-destructive")}
            />
            {error && (
              <small className={"text-destructive"}>{error.message}</small>
            )}
          </div>
        )}
      />

      <div className={"grid gap-3"}>
        <div className={"flex items-center justify-between gap-3"}>
          <div>
            <Label>Attachments (optional)</Label>
            <p className={"text-xs text-muted-foreground"}>
              Add a name and URL for each attachment.
            </p>
          </div>
          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => appendAttachment({ name: "", url: "" })}
          >
            <Plus aria-hidden="true" /> Add Attachment
          </Button>
        </div>

        {attachments.map((attachment, attachmentIndex) => (
          <div
            key={attachment.id}
            className={"grid gap-3 rounded-lg border p-3"}
          >
            <div className={"flex items-center justify-between"}>
              <p className={"text-sm font-medium text-muted-foreground"}>
                Attachment #{attachmentIndex + 1}
              </p>
              <Button
                type={"button"}
                size={"icon-sm"}
                variant={"ghost"}
                className={"text-destructive"}
                aria-label={`Remove ${attachment.name || "attachment"}`}
                onClick={() => removeAttachment(attachmentIndex)}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>

            <div className={"grid gap-3 md:grid-cols-2"}>
              <Controller
                control={control}
                name={`list.${index}.attachments.${attachmentIndex}.name`}
                render={({ field, fieldState: { error } }) => (
                  <div className={"grid gap-2"}>
                    <Label htmlFor={field.name}>Document Name</Label>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder={"Annual Examination Schedule"}
                      className={cn("w-full", error && "border-destructive")}
                    />
                    {error && (
                      <small className={"text-destructive"}>
                        {error.message}
                      </small>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`list.${index}.attachments.${attachmentIndex}.url`}
                render={({ field, fieldState: { error } }) => (
                  <div className={"grid gap-2"}>
                    <Label htmlFor={field.name}>Download URL</Label>
                    <FileUrl
                      {...field}
                      id={field.name}
                      placeholder={"https://example.com/file.pdf"}
                      className={cn("w-full", error && "border-destructive")}
                    />
                    {error && (
                      <small className={"text-destructive"}>
                        {error.message}
                      </small>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function NoticeForm({
  itemIndex,
  onClose,
  onSave,
  onDelete,
  saving,
  deleting,
  categorySuggestions,
  hasMetadataChanges,
}: {
  itemIndex: number;
  onClose: () => void;
  onSave: () => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  saving: boolean;
  deleting: boolean;
  categorySuggestions: string[];
  hasMetadataChanges: boolean;
}) {
  const { control, trigger } = useFormContext<TInput>();
  const selectedItem = useWatch({ control, name: `list.${itemIndex}` });
  const selectedItemId = selectedItem?.id || "NA";

  const {
    config,
    isLoadingConfig: isLoadingChildContent,
    isSavingConfig: isSavingChildContent,
    saveConfig: saveChildContent,
  } = useConfig(Identifier.Content, { id: selectedItemId });

  const [content, setContent] = useState<string>("");
  const [contentError, setContentError] = useState<string | null>(null);
  const prevConfigRef = useRef<typeof config | undefined>(undefined);

  useEffect(() => {
    if (config !== undefined && config !== prevConfigRef.current) {
      setContent(config.content || "");
      prevConfigRef.current = config;
    }
  }, [config]);

  if (contentError && !isNullOrWhitespace(content)) {
    setContentError(null);
  }

  const hasContentChanges = content !== (config?.content || "");

  async function saveContent() {
    if (!selectedItem) {
      return;
    }

    if (isNullOrWhitespace(content)) {
      setContentError("Content cannot be empty.");
      return;
    }

    await saveChildContent({ content });
  }

  async function saveMetadata() {
    if (!selectedItem) {
      return;
    }

    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    await onSave();
  }

  if (!selectedItem) {
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
              {selectedItem.title || "Untitled notice"}
            </h2>
            <p className={"mt-1 text-sm text-muted-foreground"}>
              Notice metadata
            </p>
          </div>

          <Button
            type={"button"}
            size={"icon-sm"}
            variant={"ghost"}
            className={"text-destructive cursor-pointer hover:-translate-y-px"}
            onClick={() => onDelete(itemIndex)}
            aria-label={"Delete notice"}
            disabled={deleting}
          >
            {deleting ? <Spinner /> : <Trash2 />}
          </Button>
        </div>
        <NoticeMetadataFields
          control={control}
          index={itemIndex}
          categorySuggestions={categorySuggestions}
        />

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

      <div className={"grid gap-2"}>
        <Label>Rich-text content</Label>
        {isLoadingChildContent ? (
          <div
            className={
              "flex min-h-40 items-center justify-center rounded-lg border"
            }
          >
            <Spinner />
          </div>
        ) : (
          <RichTextEditor
            key={selectedItem.id}
            value={content}
            onChange={setContent}
            className={cn("min-h-40", contentError && "border-destructive")}
          />
        )}
        {contentError && (
          <small className={"text-destructive"}>{contentError}</small>
        )}

        <div className={"flex justify-end gap-2"}>
          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={onClose}
            className={"cursor-pointer hover:-translate-y-px mt-2"}
            disabled={hasContentChanges || hasMetadataChanges}
          >
            Close
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                type="button"
                disabled={
                  isSavingChildContent ||
                  isLoadingChildContent ||
                  !hasContentChanges
                }
              >
                <Button
                  type={"button"}
                  size={"sm"}
                  variant={"outline"}
                  onClick={async () => await saveContent()}
                  className={
                    "cursor-pointer hover:-translate-y-px mt-2 bg-primary text-secondary"
                  }
                  disabled={
                    isSavingChildContent ||
                    isLoadingChildContent ||
                    !hasContentChanges
                  }
                >
                  {isSavingChildContent ? <Spinner /> : "Save"}
                </Button>
              </TooltipTrigger>
              {!hasContentChanges && !isSavingChildContent && (
                <TooltipContent>No content changes to save</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

function NoticePreview({
  item,
}: {
  item: NonNullable<TInput["list"]>[number];
}) {
  return (
    <>
      <p className={"truncate font-medium text-muted-foreground"}>
        {item.title || "Untitled notice"}
      </p>

      <p className={"truncate text-sm text-muted-foreground"}>
        {item.date || "No date"}
        {item.category ? ` · ${item.category}` : ""}
      </p>
    </>
  );
}

function NoticeCardHeader({
  item,
  isCurrentlyEditing,
  onEdit,
  onDelete,
}: {
  item: NonNullable<TInput["list"]>[number];
  isCurrentlyEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <div className={"min-w-0"}>
        <p className={"truncate font-medium text-muted-foreground"}>
          #{item.id}
        </p>
      </div>

      <div className={"flex shrink-0 gap-2"}>
        {!isCurrentlyEditing && (
          <Button
            type={"button"}
            size={"icon-sm"}
            variant={"ghost"}
            onClick={onEdit}
            className="cursor-pointer hover:-translate-y-px"
            aria-label={"Edit notice"}
          >
            <Pencil />
          </Button>
        )}

        <Button
          type={"button"}
          size={"icon-sm"}
          variant={"ghost"}
          className={"text-destructive cursor-pointer hover:-translate-y-px"}
          onClick={onDelete}
          aria-label={"Delete notice"}
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
  } = useConfigurationForm(Identifier.Contents, schema, defaultValues);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({ control, name: "list", keyName: "fieldArrayId" });
  const itemsWatch = useWatch({ control, name: "list" }) || [];

  const categorySuggestions = useMemo(() => {
    const names = itemsWatch
      .flatMap((item) => (item.category ? [item.category] : []))
      .filter(Boolean);
    return names.filter(
      (name, index) =>
        name.trim() &&
        names.findIndex(
          (candidate) =>
            candidate.trim().toLocaleLowerCase() ===
            name.trim().toLocaleLowerCase(),
        ) === index,
    );
  }, [itemsWatch]);

  const [deletingItem, setDeletingItem] = useState<boolean>(false);

  async function deleteItem(index: number) {
    setDeletingItem(true);
    const approved = await confirm({
      title: "Delete notice?",
      message:
        "Are you sure you want to delete this notice? This action cannot be undone.",
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
      setDeletingItem(false);
      return;
    }

    const item = items[index];
    if (!item) {
      setDeletingItem(false);
      return;
    }

    const deletedItemId = item.id;
    const wasPreviouslySaved =
      originalConfig?.list?.some((p) => p.id === deletedItemId) ?? false;
    remove(index);
    if (wasPreviouslySaved) {
      await save(schema.parse(form.getValues()));
    }
    if (editingItemId === deletedItemId) {
      setEditingItemId(null);
    }
    setDeletingItem(false);
  }

  async function save(values: TOutput) {
    for (const item of values.list) {
      if (isNullOrWhitespace(item.id)) {
        item.id = createConfigurationId("notice");
      }

      const exhaustedSlugsExceptThisItem = new Set(
        values.list
          .filter((x) => x.id !== item.id)
          .flatMap((x) => x.slugs)
          .map((x) => x.slug),
      );
      const activeSlugCandidate = slugify(
        item.title,
        exhaustedSlugsExceptThisItem,
      );
      let foundActiveSlug = false;
      for (const slugEntry of item.slugs) {
        if (slugEntry.slug === activeSlugCandidate) {
          slugEntry.isActive = true;
          foundActiveSlug = true;
          continue;
        }
        slugEntry.isActive = false;
      }
      if (!foundActiveSlug) {
        item.slugs.push({
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
      title={"Notices Configuration"}
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
            <Label>Notices</Label>
            <p className={"mt-1 text-sm text-muted-foreground"}>
              Manage your notices and their content.
            </p>
          </div>

          <Button
            type={"button"}
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              const notice = withConfigurationId(emptyItem, "notice");
              append(notice);
              setEditingItemId(notice.id);
            }}
            className="cursor-pointer hover:-translate-y-px"
          >
            <Plus /> Add notice
          </Button>
        </div>

        {editingItemId === null ? (
          <>
            {itemsWatch.map((item) => (
              <div
                key={item.id}
                className={"grid gap-4 rounded-xl border bg-card p-4 shadow-sm"}
              >
                <NoticeCardHeader
                  item={item}
                  isCurrentlyEditing={false}
                  onEdit={() => setEditingItemId(item.id)}
                  onDelete={() => {
                    const idx = items.findIndex((p) => p.id === item.id);
                    if (idx !== -1) deleteItem(idx);
                  }}
                />

                <div className={"grid gap-1 border-t pt-4"}>
                  <NoticePreview item={item} />
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div
                className={
                  "rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"
                }
              >
                No notices yet. Add your first notice.
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
          <NoticeForm
            itemIndex={items.findIndex((item) => item.id === editingItemId)}
            onClose={() => setEditingItemId(null)}
            onSave={async () => await save(schema.parse(formValues))}
            onDelete={async (index) => await deleteItem(index)}
            saving={isSavingConfig}
            deleting={deletingItem}
            categorySuggestions={categorySuggestions}
            hasMetadataChanges={hasChanges}
          />
        )}
      </form>
    </ConfigurationFormWrapper>
  );
}

export default PageContent;
