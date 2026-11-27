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
import { defaultValues, schema, type TOutput } from "@/configuration/about";
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
  } = useConfigurationForm(Identifier.About, schema, defaultValues);

  async function save(values: TOutput) {
    await saveConfig(values);
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "keypoints",
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
      title={"About Configuration"}
      config={formValues}
      form={form}
    >
      <form
        onSubmit={handleSubmit(save)}
        className={cn(styles.form, "grid gap-6 max-w-3xl")}
      >
        <Controller
          control={control}
          name={"introPicture"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"introPicture"}>Introduction Picture</Label>
              <FileUrl
                {...field}
                id={"introPicture"}
                placeholder={"https://example.com/campus.jpg"}
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
              <Label htmlFor={"keypoints"}>Key Points</Label>
              <p className={"text-sm text-muted-foreground"}>
                Add key information like School Name, Address, Established year,
                and Grades Offered.
              </p>
            </div>
            <Button
              type={"button"}
              size={"sm"}
              variant={"outline"}
              onClick={() => append({ title: "", value: "" })}
              className="cursor-pointer hover:-translate-y-px"
            >
              <Plus /> Add Key Point
            </Button>
          </div>
          {fields.map((item, index) => (
            <div
              key={item.id}
              className={"flex gap-2 items-start rounded-md border p-3"}
            >
              <div className={"grid gap-2 flex-1 md:grid-cols-2"}>
                <Controller
                  control={control}
                  name={`keypoints.${index}.title`}
                  render={({ field }) => (
                    <Input {...field} placeholder={"Label"} />
                  )}
                />
                <Controller
                  control={control}
                  name={`keypoints.${index}.value`}
                  render={({ field }) => (
                    <Input {...field} placeholder={"Value"} />
                  )}
                />
              </div>
              <Button
                type={"button"}
                size={"icon"}
                variant={"ghost"}
                className={
                  "text-destructive cursor-pointer hover:-translate-y-px"
                }
                onClick={() => remove(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>

        <Controller
          control={control}
          name={"story"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"story"}>Our Story</Label>
              <RichTextEditor
                id={"story"}
                placeholder={"Tell your school's story, history, or mission"}
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
