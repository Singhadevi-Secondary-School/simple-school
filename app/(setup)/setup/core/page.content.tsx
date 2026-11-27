"use client";

import { Controller } from "react-hook-form";
import { ArrayInput } from "@/components/ui/ArrayInput";
import { Button } from "@/components/ui/button";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import { FileUrl } from "@/components/ui/FileUrl";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SmartLink from "@/components/ui/SmartLink";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { defaultValues, schema, type TOutput } from "@/configuration/core";
import { Identifier } from "@/hooks/useConfig";
import { useConfigurationForm } from "@/hooks/useConfigurationForm";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export default function PageContent({
  templates,
  templatesWithAboutPages,
}: {
  templates: string[];
  templatesWithAboutPages: string[];
}) {
  const {
    isLoadingConfig,
    saveConfig,
    isSavingConfig,
    form,
    control,
    handleSubmit,
    formValues,
    hasChanges,
  } = useConfigurationForm(Identifier.Core, schema, defaultValues);

  async function save(values: TOutput) {
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
      title={"Core Configuration"}
      config={formValues}
      form={form}
    >
      <form
        onSubmit={handleSubmit(save)}
        className={cn(styles.form, "grid gap-6 max-w-3xl")}
      >
        <Controller
          control={control}
          name={"logoIcon"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"logoIcon"}>Logo Icon</Label>
              <FileUrl
                {...field}
                id={"logoIcon"}
                placeholder={"https://example.com/logo-icon.ico"}
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
          name={"schoolName"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"schoolName"}>School Name</Label>
              <Input
                {...field}
                id={"schoolName"}
                placeholder={"My School"}
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
          name={"location"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"location"}>Location</Label>
              <Input
                {...field}
                id={"location"}
                placeholder={"Jhamsikhel, Lalitpur · Nepal"}
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
          name={"logo"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"logo"}>Logo</Label>
              <FileUrl
                {...field}
                id={"logo"}
                placeholder={"https://example.com/logo.png"}
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
          name={"seoDescription"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"seoDescription"}>SEO Description</Label>
              <Textarea
                {...field}
                id={"seoDescription"}
                placeholder={"A brief description of your website"}
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
          name={"seoKeywords"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"seoKeywords"}>SEO Keywords</Label>
              <ArrayInput
                {...field}
                id={"seoKeywords"}
                placeholder={"Type a keyword and press Enter"}
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
          name={"template"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"template"}>Template</Label>
              <Select
                value={field.value || "default"}
                onValueChange={field.onChange}
                defaultValue={"default"}
              >
                <SelectTrigger
                  id={"template"}
                  className={cn("w-full", error && "border-destructive")}
                >
                  <SelectValue placeholder={"Select a template"} />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && (
                <small className={"text-destructive"}>{error.message}</small>
              )}
              {field.value && templatesWithAboutPages.includes(field.value) && (
                <SmartLink
                  href={`/setup/template/${field.value}/about.html`}
                  target={"_blank"}
                  className={"text-primary underline hover:text-primary/80"}
                  aria-label={`Read about the ${field.value} template`}
                >
                  Read about this template.
                </SmartLink>
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
