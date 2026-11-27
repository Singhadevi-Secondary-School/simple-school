"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import ConfigurationFormWrapper from "@/components/ui/ConfigurationFormWrapper";
import { FileUrl } from "@/components/ui/FileUrl";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { defaultValues, schema, type TOutput } from "@/configuration/contact";
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
  } = useConfigurationForm(Identifier.Contact, schema, defaultValues);

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
      title={"Contact & Feedback Configuration"}
      config={formValues}
      form={form}
    >
      <form
        onSubmit={handleSubmit(save)}
        className={cn(styles.form, "grid gap-6 max-w-3xl")}
      >
        <Controller
          control={control}
          name={"contactImage"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"contactImage"}>Contact Image</Label>
              <FileUrl
                {...field}
                id={"contactImage"}
                placeholder={"https://example.com/contact.jpg"}
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
          name={"contactName"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"contactName"}>Contact Name</Label>
              <Input
                {...field}
                id={"contactName"}
                placeholder={"Contact person"}
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
          name={"contactSummary"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"contactSummary"}>Contact Summary</Label>
              <Textarea
                {...field}
                id={"contactSummary"}
                placeholder={"Brief description of the contact office"}
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
          name={"contactEmail"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"contactEmail"}>Contact Email</Label>
              <Input
                {...field}
                id={"contactEmail"}
                type="email"
                placeholder={"contact@school.edu.np"}
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
          name={"contactPhone"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"contactPhone"}>Contact Phone</Label>
              <Input
                {...field}
                id={"contactPhone"}
                placeholder={"01-4XXXXXX"}
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
          name={"contactAddress"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"contactAddress"}>Contact Address</Label>
              <Textarea
                {...field}
                id={"contactAddress"}
                placeholder={"Jhamsikhel, Lalitpur, Nepal"}
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
          name={"contactHour"}
          render={({ field, fieldState: { error } }) => (
            <div className={"grid gap-2"}>
              <Label htmlFor={"contactHour"}>Contact Hours</Label>
              <Input
                {...field}
                id={"contactHour"}
                placeholder={"Mon-Fri, 9:00 AM - 5:00 PM"}
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
