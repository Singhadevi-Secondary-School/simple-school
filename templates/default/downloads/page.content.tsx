"use client";

import { Download, FileText, Search } from "lucide-react";
import { useState } from "react";
import type { PageContentProps } from "@/app/(app)/downloads/page.types";
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import SmartLink from "@/components/ui/SmartLink";
import { getFileType, PageHeader } from "@/templates/default/components";
import styles from "@/templates/default/shared.module.css";

function PageContent({ downloadsConfig }: PageContentProps) {
  const [query, setQuery] = useState("");
  const filteredDownloads = downloadsConfig.downloads.filter((download) =>
    `${download.name} ${getFileType(download.url)}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <section className={styles.container} aria-label="Downloads">
      <PageHeader
        title="Downloads"
        description={
          downloadsConfig.summary ? (
            <HtmlRenderer className={styles.pageDescription}>
              {downloadsConfig.summary}
            </HtmlRenderer>
          ) : undefined
        }
        breadcrumbs={[{ label: "Downloads" }]}
      />

      {downloadsConfig.downloads.length === 0 ? (
        <p className={styles.emptyState}>No downloads available yet.</p>
      ) : (
        <>
          <label className={styles.searchToolbar}>
            <span>Search documents</span>
            <span className={styles.searchControl}>
              <Search size={20} aria-hidden="true" />
              <input
                className={styles.searchInput}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or file type..."
              />
            </span>
          </label>
          <p className={styles.visuallyHidden} aria-live="polite">
            {filteredDownloads.length} document
            {filteredDownloads.length === 1 ? "" : "s"}
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label="Downloadable files">
              <thead>
                <tr>
                  <th scope="col">Document</th>
                  <th scope="col">Type</th>
                  <th scope="col" className={styles.tableActionCell}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDownloads.map((download, index) => (
                  <tr key={download.url || index}>
                    <td>
                      <span className={styles.tableDocument}>
                        <FileText
                          size={22}
                          className={styles.tableIcon}
                          aria-hidden="true"
                        />
                        {download.name}
                      </span>
                    </td>
                    <td className={styles.tableType}>
                      {getFileType(download.url)}
                    </td>
                    <td className={styles.tableActionCell}>
                      <SmartLink
                        href={download.url}
                        download
                        className={styles.tableAction}
                        aria-label={`Download ${download.name}`}
                        target="_self"
                      >
                        <Download size={16} aria-hidden="true" />
                        Download
                      </SmartLink>
                    </td>
                  </tr>
                ))}
                {filteredDownloads.length === 0 && (
                  <tr>
                    <td colSpan={3} className={styles.tableEmpty}>
                      No documents match your search.
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
