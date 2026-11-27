"use client";

import { AlertCircle, Search } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import type { PageContentProps } from "@/app/(app)/results/[resultSlug]/page.types";
import { DatePicker } from "@/components/ui/DatePicker";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {
  AttachmentList,
  getFileName,
  PageHeader,
} from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({ result }: PageContentProps) {
  const [symbolNumber, setSymbolNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [individualResultUrl, setIndividualResultUrl] = useState<
    string | null | undefined
  >();

  function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!dateOfBirth) {
      setDateOfBirthError(true);
      setIndividualResultUrl(undefined);
      return;
    }

    const expectedFileName =
      `${symbolNumber.trim()}_${dateOfBirth}.pdf`.toLowerCase();
    const match = result.individualResults.find(
      (url) => getFileName(url).toLowerCase() === expectedFileName,
    );

    setIndividualResultUrl(match || null);
  }

  return (
    <section className={styles.container} aria-label={result.title}>
      <PageHeader
        title={result.title}
        description="Enter your candidate number and date of birth to find an individual result."
        breadcrumbs={[
          { label: "Results", href: "/results/" },
          { label: result.title },
        ]}
      />

      {result.description && (
        <div className={styles.articleBody}>
          <HtmlRenderer>{result.description}</HtmlRenderer>
        </div>
      )}

      <section className={styles.resultLookup} aria-labelledby="lookup-title">
        <h2 id="lookup-title" className={styles.lookupTitle}>
          Search an individual result
        </h2>
        <form className={styles.lookupForm} onSubmit={handleLookup}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Candidate / roll number</span>
            <input
              className={styles.fieldInput}
              type="text"
              name="symbol"
              value={symbolNumber}
              onChange={(event) => setSymbolNumber(event.currentTarget.value)}
              placeholder="Enter candidate or roll number"
              aria-describedby="symbol-hint"
              required
            />
            <span id="symbol-hint" className={styles.fieldHint}>
              Use the number provided for this assessment.
            </span>
          </label>

          <div className={styles.field}>
            <label htmlFor="dateOfBirth" className={styles.fieldLabel}>
              Date of birth
            </label>
            <DatePicker
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(value) => {
                setDateOfBirth(value);
                setDateOfBirthError(false);
              }}
              aria-describedby={
                dateOfBirthError
                  ? "birth-date-hint birth-date-error"
                  : "birth-date-hint"
              }
              aria-invalid={dateOfBirthError}
              aria-required="true"
              className={styles.fieldInput}
            />
            <span id="birth-date-hint" className={styles.fieldHint}>
              Use the date of birth on the institution's record.
            </span>
            {dateOfBirthError && (
              <span
                id="birth-date-error"
                className={styles.fieldHint}
                role="alert"
              >
                Select a date of birth to search.
              </span>
            )}
          </div>

          <div className={styles.lookupFormFooter}>
            <button type="submit" className={styles.btnPrimary}>
              <Search size={18} aria-hidden="true" />
              Find result
            </button>
          </div>
        </form>

        {individualResultUrl !== undefined && (
          <div aria-live="polite">
            {individualResultUrl ? (
              <AttachmentList
                attachments={[individualResultUrl]}
                title="Individual result"
              />
            ) : (
              <div className={styles.lookupError} role="alert">
                <AlertCircle size={20} aria-hidden="true" />
                <p>
                  No result found for those details. Check them and try again.
                </p>
              </div>
            )}
          </div>
        )}

        <AttachmentList
          attachments={result.attachments}
          title="Group results and reports"
        />
      </section>
    </section>
  );
}

export default PageContent;
