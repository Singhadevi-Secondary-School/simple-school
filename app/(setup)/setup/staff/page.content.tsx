"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { confirm } from "@/components/ui/Confirm";
import { Card, CardContent } from "@/components/ui/card";
import FullScreenMessage from "@/components/ui/FullScreenMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Identifier, useConfig } from "@/hooks/useConfig";
import styles from "./page.module.css";

type PersonEntry = { id: string; position: string };
type PersonWithKey = PersonEntry & { fieldArrayId: string };

function PageContent() {
  const router = useRouter();
  const { config: peopleConfig, isLoadingConfig: isLoadingPeople } = useConfig(
    Identifier.People,
  );

  const {
    config: orgConfig,
    isLoadingConfig,
    isSavingConfig,
    saveConfig,
  } = useConfig(Identifier.Organization, { id: "school" });

  const [details, setDetails] = useState<{
    summary: OrgTInput["summary"];
    people: PersonWithKey[];
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

  const hasChanges =
    details.people !== undefined &&
    JSON.stringify(details.people.map(({ fieldArrayId, ...rest }) => rest)) !==
      JSON.stringify(orgConfig?.people || []);

  const [deletingPerson, setDeletingPerson] = useState<boolean>(false);

  const peopleOptions =
    peopleConfig?.people.map((p) => ({ id: p.id, name: p.name })) || [];

  async function save() {
    await saveConfig(orgSchema.parse(details));
  }

  async function deletePerson(fieldArrayId: string) {
    setDeletingPerson(true);
    const approved = await confirm({
      title: "Remove staff member?",
      message:
        "Are you sure you want to remove this person from the staff list?",
      actions: [
        {
          label: "Cancel",
          buttonProps: { variant: "outline" },
          onClick: async () => false,
        },
        {
          label: "Remove",
          buttonProps: { variant: "destructive" },
          onClick: async () => true,
        },
      ],
    });

    if (!approved) {
      setDeletingPerson(false);
      return;
    }

    setDetails((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p.fieldArrayId !== fieldArrayId),
    }));
    setDeletingPerson(false);
  }

  async function addPerson() {
    setDetails((prev) => ({
      ...prev,
      people: [
        ...prev.people,
        { id: "", position: "", fieldArrayId: crypto.randomUUID() },
      ],
    }));
  }

  function moveStaffMember(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= details.people.length) return;

    setDetails((prev) => {
      const people = [...prev.people];
      const current = people[index];
      const adjacent = people[nextIndex];
      if (!current || !adjacent) return prev;

      people[index] = adjacent;
      people[nextIndex] = current;
      return { ...prev, people };
    });
  }

  if (isLoadingConfig || isLoadingPeople) {
    return (
      <FullScreenMessage>
        <Spinner className={"size-10"} />
      </FullScreenMessage>
    );
  }

  return (
    <div className={styles.page}>
      <Card
        className={
          "mx-auto w-full max-w-6xl border-border/70 shadow-lg shadow-black/5"
        }
      >
        <CardContent
          className={"max-h-[calc(100dvh-8rem)] overflow-y-auto p-4 sm:p-6"}
        >
          <div
            className={"mb-6 flex items-start justify-between gap-4 border-b pb-4"}
          >
            <div className={"flex min-w-0 items-start gap-3"}>
              <Button
                type={"button"}
                variant={"ghost"}
                size={"icon-sm"}
                className={
                  "mt-0.5 shrink-0 cursor-pointer hover:-translate-y-px"
                }
                onClick={() => router.push("/setup")}
                aria-label={"Return to setup"}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <div>
                <h1 className={"text-xl font-semibold tracking-tight"}>
                  Staff Configuration
                </h1>
                <p className={"mt-1 text-sm text-muted-foreground"}>
                  Manage the school staff list. Add people from the People
                  configuration and assign their positions.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.form}>
            <div className={"grid gap-3"}>
              <div className={"flex items-center justify-between"}>
                <div>
                  <Label>Staff Members</Label>
                  <p className={"text-sm text-muted-foreground"}>
                    Assign people and their positions at the school.
                  </p>
                </div>

                <Button
                  type={"button"}
                  size={"sm"}
                  variant={"outline"}
                  onClick={addPerson}
                  disabled={isSavingConfig}
                  className="cursor-pointer hover:-translate-y-px"
                >
                  <Plus className={"size-4"} />
                  Add staff member
                </Button>
              </div>

              {details.people.map((person, idx) => (
                <div
                  key={person.fieldArrayId}
                  className={"grid gap-3 rounded-lg border p-3"}
                >
                  <div className={"flex items-center justify-between"}>
                    <p className={"text-sm font-medium text-muted-foreground"}>
                      Staff #{idx + 1}
                    </p>
                    <div className={"flex items-center gap-1"}>
                      <div className={"flex flex-col"}>
                        <Button
                          type={"button"}
                          size={"icon-sm"}
                          variant={"ghost"}
                          className={"text-muted-foreground"}
                          onClick={() => moveStaffMember(idx, -1)}
                          aria-label={`Move staff member ${idx + 1} up`}
                          disabled={idx === 0 || isSavingConfig}
                        >
                          <ChevronUp aria-hidden="true" />
                        </Button>
                        <Button
                          type={"button"}
                          size={"icon-sm"}
                          variant={"ghost"}
                          className={"text-muted-foreground"}
                          onClick={() => moveStaffMember(idx, 1)}
                          aria-label={`Move staff member ${idx + 1} down`}
                          disabled={
                            idx === details.people.length - 1 ||
                            isSavingConfig
                          }
                        >
                          <ChevronDown aria-hidden="true" />
                        </Button>
                      </div>
                      <Button
                        type={"button"}
                        size={"icon-sm"}
                        variant={"ghost"}
                        className={
                          "text-destructive cursor-pointer hover:-translate-y-px"
                        }
                        onClick={() => deletePerson(person.fieldArrayId)}
                        aria-label={"Remove staff member"}
                        disabled={deletingPerson || isSavingConfig}
                      >
                        {deletingPerson ? <Spinner /> : <Trash2 />}
                      </Button>
                    </div>
                  </div>

                  <div className={"grid gap-3"}>
                    <div className={"grid gap-2"}>
                      <Label htmlFor={`people.${person.fieldArrayId}.id`}>
                        Person
                      </Label>
                      <Select
                        value={person.id || ""}
                        onValueChange={(value) => {
                          setDetails((prev) => ({
                            ...prev,
                            people: prev.people.map((p) =>
                              p.fieldArrayId === person.fieldArrayId
                                ? { ...p, id: value || "" }
                                : p,
                            ),
                          }));
                        }}
                      >
                        <SelectTrigger
                          id={`people.${person.fieldArrayId}.id`}
                          className={"w-full"}
                        >
                          <SelectValue placeholder={"Select a person"} />
                        </SelectTrigger>
                        <SelectContent>
                          {peopleOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {opt.name || `#${opt.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={"grid gap-2"}>
                      <Label
                        htmlFor={`people.${person.fieldArrayId}.position`}
                      >
                        Position
                      </Label>
                      <Input
                        id={`people.${person.fieldArrayId}.position`}
                        value={person.position || ""}
                        onChange={(e) => {
                          setDetails((prev) => ({
                            ...prev,
                            people: prev.people.map((p) =>
                              p.fieldArrayId === person.fieldArrayId
                                ? { ...p, position: e.target.value }
                                : p,
                            ),
                          }));
                        }}
                        placeholder={
                          "Principal, Class Teacher, Head of Department"
                        }
                        className={"w-full"}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {details.people.length === 0 && (
                <div
                  className={
                    "rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground"
                  }
                >
                  No staff members yet. Add your first staff member.
                </div>
              )}
            </div>

            <div className={"flex justify-end mt-6"}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    disabled={isSavingConfig || !hasChanges}
                  >
                    <Button
                      type={"button"}
                      size={"sm"}
                      variant={"outline"}
                      onClick={async () => await save()}
                      className={
                        "cursor-pointer hover:-translate-y-px bg-primary text-secondary"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PageContent;
