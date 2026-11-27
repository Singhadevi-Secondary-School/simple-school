"use client";

import { useEffect, useState } from "react";
import type { NoticePopupItem } from "@/app/(app)/layout.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SmartLink from "@/components/ui/SmartLink";
import { getRecentNoticePopups } from "@/lib/noticePopup";

const dismissedNoticesStorageKey = "simple-school:dismissed-notice-ids";

export default function NoticePopup({
  notices,
  daysToShow,
}: {
  notices: NoticePopupItem[];
  daysToShow: number;
}) {
  const [dismissedNoticeIds, setDismissedNoticeIds] =
    useState<Set<string> | null>(null);

  useEffect(() => {
    let ids: string[] = [];

    try {
      const storedIds = window.localStorage.getItem(dismissedNoticesStorageKey);
      if (storedIds) {
        const parsedIds: unknown = JSON.parse(storedIds);
        if (Array.isArray(parsedIds)) {
          ids = parsedIds.filter((id): id is string => typeof id === "string");
        }
      }
    } catch {}

    setDismissedNoticeIds(new Set(ids));
  }, []);

  const notice = dismissedNoticeIds
    ? getRecentNoticePopups(notices, daysToShow, new Date()).find(
        ({ id }) => !dismissedNoticeIds.has(id),
      )
    : undefined;

  function dismissNotice() {
    if (!notice || !dismissedNoticeIds) {
      return;
    }

    const updatedIds = new Set(dismissedNoticeIds);
    updatedIds.add(notice.id);
    setDismissedNoticeIds(updatedIds);

    try {
      window.localStorage.setItem(
        dismissedNoticesStorageKey,
        JSON.stringify([...updatedIds]),
      );
    } catch {}
  }

  return (
    <Dialog
      open={Boolean(notice)}
      onOpenChange={(open) => {
        if (!open) {
          dismissNotice();
        }
      }}
    >
      {notice && (
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{notice.title}</DialogTitle>
            <DialogDescription>{notice.summary}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <SmartLink
              href={notice.href}
              onClick={dismissNotice}
              className="text-primary underline underline-offset-4 hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Read full notice
            </SmartLink>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
