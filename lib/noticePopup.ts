import { differenceInCalendarDays, isValid, parseISO } from "date-fns";
import type { NoticePopupItem } from "@/app/(app)/layout.types";

export function getRecentNoticePopups(
  notices: NoticePopupItem[],
  daysToShow: number,
  now: Date,
): NoticePopupItem[] {
  if (!Number.isInteger(daysToShow) || daysToShow <= 0) {
    return [];
  }

  return notices
    .map((notice) => ({ notice, publishedDate: parseISO(notice.date) }))
    .filter(({ publishedDate }) => {
      if (!isValid(publishedDate)) {
        return false;
      }

      const ageInDays = differenceInCalendarDays(now, publishedDate);
      return ageInDays >= 0 && ageInDays < daysToShow;
    })
    .sort(
      (first, second) =>
        second.publishedDate.getTime() - first.publishedDate.getTime(),
    )
    .map(({ notice }) => notice);
}
