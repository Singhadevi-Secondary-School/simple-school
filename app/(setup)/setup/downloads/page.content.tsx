"use client";

import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import { FileUrl } from "@/components/ui/FileUrl";
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
import { defaultValues, schema, type TOutput } from "@/configuration/downloads";
import { Identifier } from "@/hooks/useConfig";
import { useConfigurationForm } from "@/hooks/useConfigurationForm";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

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
  } = useConfigurationForm(Identifier.Downloads, schema, defaultValues);

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "downloads",
  });

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
      title={"Downloads Configuration"}
      config={formValues}
      form={form}
    >
      <form
        onSubmit={handleSubmit(save)}
        className={cn(styles.form, "grid gap-6 max-w-3xl")}
      >
        <Controller
          control={control}
          name={"summary"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"downloadsSummary"}>Summary</Label>
              <RichTextEditor
                id={"downloadsSummary"}
                placeholder={"Introduce the downloadable files available"}
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

        <div className={"grid gap-3"}>
          <div className={"flex justify-between items-center"}>
            <div>
              <Label>Downloads</Label>
              <p className={"text-sm text-muted-foreground"}>
                Add downloadable files with their names and URLs.
              </p>
            </div>
            <Button
              type={"button"}
              size={"sm"}
              variant={"outline"}
              onClick={() => append({ name: "", url: "" })}
              className="cursor-pointer hover:-translate-y-px"
            >
              <Plus /> Add Download
            </Button>
          </div>
          {fields.map((item, index) => (
            <div key={item.id} className={"grid gap-3 rounded-lg border p-3"}>
              <div className={"flex items-center justify-between"}>
                <p className={"text-sm font-medium text-muted-foreground"}>
                  Download #{index + 1}
                </p>
                <Button
                  type={"button"}
                  size={"icon-sm"}
                  variant={"ghost"}
                  className={
                    "text-destructive cursor-pointer hover:-translate-y-px"
                  }
                  onClick={() => remove(index)}
                  aria-label={"Remove download"}
                >
                  <Trash2 />
                </Button>
              </div>

              <div className={"grid gap-3"}>
                <Controller
                  control={control}
                  name={`downloads.${index}.name`}
                  render={({ field, fieldState: { error } }) => (
                    <div className={"grid gap-2"}>
                      <Label htmlFor={`downloads.${index}.name`}>
                        Document Name
                      </Label>
                      <Input
                        {...field}
                        id={`downloads.${index}.name`}
                        placeholder={"Academic Calendar 2083 BS"}
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
                  name={`downloads.${index}.url`}
                  render={({ field, fieldState: { error } }) => (
                    <div className={"grid gap-2"}>
                      <Label htmlFor={`downloads.${index}.url`}>
                        Download URL
                      </Label>
                      <FileUrl
                        {...field}
                        id={`downloads.${index}.url`}
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

          {fields.length === 0 && (
            <div
              className={
                "rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"
              }
            >
              No downloads yet. Add your first downloadable file.
            </div>
          )}
        </div>

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
      </form>
    </ConfigurationFormWrapper>
  );
}

export default PageContent;
