"use client";

import { ClipboardList, Eye, Search } from "lucide-react";
import { useState } from "react";
import type { PageContentProps } from "@/app/(app)/results/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import SmartLink from "@/components/ui/SmartLink";
import { getActiveSlug } from "@/lib/slugs";
import { PageHeader } from "@/templates/default/components";
import shared from "@/templates/default/shared.module.css";

function PageContent({ resultsConfig }: PageContentProps) {
  const [query, setQuery] = useState("");
  const filteredResults = resultsConfig.results.filter((result) =>
    result.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section className={shared.container} aria-label="Results">
      <PageHeader
        title="Results"
        description={
          resultsConfig.summary ? (
            <HtmlRenderer className={shared.pageDescription}>
              {resultsConfig.summary}
            </HtmlRenderer>
          ) : undefined
        }
        breadcrumbs={[{ label: "Results" }]}
      />

      {resultsConfig.results.length === 0 ? (
        <p className={shared.emptyState}>No results available yet.</p>
      ) : (
        <>
          <label className={shared.searchToolbar}>
            <span>Search results</span>
            <span className={shared.searchControl}>
              <Search size={20} aria-hidden="true" />
              <input
                className={shared.searchInput}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by result title..."
              />
            </span>
          </label>
          <p className={shared.visuallyHidden} aria-live="polite">
            {filteredResults.length} result
            {filteredResults.length === 1 ? "" : "s"}
          </p>
          <div className={shared.tableWrapper}>
            <table className={shared.table} aria-label="Published results">
              <thead>
                <tr>
                  <th scope="col">Result</th>
                  <th scope="col" className={shared.tableActionCell}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.id}>
                    <td>
                      <span className={shared.tableDocument}>
                        <ClipboardList
                          size={22}
                          className={shared.tableIcon}
                          aria-hidden="true"
                        />
                        {result.title}
                      </span>
                    </td>
                    <td className={shared.tableActionCell}>
                      <SmartLink
                        href={`/results/${getActiveSlug(result.slugs)}/`}
                        className={shared.tableAction}
                        aria-label={`View ${result.title}`}
                      >
                        <Eye size={16} aria-hidden="true" />
                        View
                      </SmartLink>
                    </td>
                  </tr>
                ))}
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={2} className={shared.tableEmpty}>
                      No results match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

export default PageContent;
