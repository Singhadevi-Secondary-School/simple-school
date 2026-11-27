"use client";

import { ChevronDown, ChevronRight, Menu, School, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { LayoutContentProps } from "@/app/(app)/layout.types";
import GoToTopButton from "@/components/ui/GoToTopButton";
import NoticePopup from "@/components/ui/NoticePopup";
import SmartLink from "@/components/ui/SmartLink";
import { getActiveSlug } from "@/lib/slugs";
import styles from "./layout.module.css";

function isCurrentPath(pathname: string, href: string) {
  const target = href.endsWith("/") ? href : `${href}/`;
  return target === "/" ? pathname === "/" : pathname.startsWith(target);
}

function NavigationLink({
  href,
  currentPath,
  className,
  children,
}: {
  href: string;
  currentPath: string;
  className: string;
  children: React.ReactNode;
}) {
  const active = isCurrentPath(currentPath, href);

  return (
    <SmartLink
      href={href}
      className={className + (active ? ` ${styles.navLinkActive}` : "")}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </SmartLink>
  );
}

function Header({
  coreConfig,
  navigationConfig,
  organizationsConfig,
}: {
  coreConfig: NonNullable<LayoutContentProps["coreConfig"]>;
  navigationConfig: NonNullable<LayoutContentProps["navigationConfig"]>;
  organizationsConfig: NonNullable<LayoutContentProps["organizationsConfig"]>;
}) {
  const pathname = usePathname() || "/";
  const currentPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const enabledNavs = navigationConfig.enabledNavigations;
  const classes = organizationsConfig.organizations.filter(
    (organization) =>
      organization.type === "Class" && organization.slugs.length,
  );
  const faculties = organizationsConfig.organizations.filter(
    (organization) =>
      organization.type === "Faculty" && organization.slugs.length,
  );
  const organisations = organizationsConfig.organizations.filter(
    (organization) =>
      organization.type === "Others" && organization.slugs.length,
  );

  function toggleDropdown(name: string) {
    setOpenDropdown((current) => (current === name ? null : name));
  }

  useEffect(() => {
    if (!openDropdown) return;

    function closeIfOutside(event: Event) {
      const openDropdownElement = desktopNavRef.current?.querySelector(
        "[data-dropdown-open]",
      );

      if (
        openDropdownElement &&
        event.target instanceof Node &&
        !openDropdownElement.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenDropdown(null);
    }

    document.addEventListener("pointerdown", closeIfOutside);
    document.addEventListener("focusin", closeIfOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeIfOutside);
      document.removeEventListener("focusin", closeIfOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openDropdown]);

  const moreIsCurrent = [
    "/organisations/",
    "/downloads/",
    "/results/",
    "/contact/",
  ].some((href) => isCurrentPath(currentPath, href));

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <SmartLink
          href="/"
          className={styles.brand}
          aria-label="Go to home page"
        >
          <span className={styles.brandIcon} aria-hidden="true">
            {coreConfig.logo ? (
              <img
                src={coreConfig.logo}
                alt=""
                className={styles.brandIconImg}
              />
            ) : (
              <School size={22} aria-hidden="true" />
            )}
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{coreConfig.schoolName}</span>
            {coreConfig.location && (
              <span className={styles.brandLocation}>
                {coreConfig.location}
              </span>
            )}
          </span>
        </SmartLink>

        <nav
          ref={desktopNavRef}
          className={styles.desktopNav}
          aria-label="Primary navigation"
        >
          {enabledNavs.includes("about") && (
            <NavigationLink
              href="/about/"
              currentPath={currentPath}
              className={styles.navLink}
            >
              About
            </NavigationLink>
          )}
          {enabledNavs.includes("notices") && (
            <NavigationLink
              href="/notices/"
              currentPath={currentPath}
              className={styles.navLink}
            >
              Notices
            </NavigationLink>
          )}
          {enabledNavs.includes("publications") && (
            <NavigationLink
              href="/publications/"
              currentPath={currentPath}
              className={styles.navLink}
            >
              Publications
            </NavigationLink>
          )}
          {enabledNavs.includes("activities") && (
            <NavigationLink
              href="/activities/"
              currentPath={currentPath}
              className={styles.navLink}
            >
              Activities
            </NavigationLink>
          )}
          {enabledNavs.includes("classes") && (
            <Dropdown
              trigger="Classes"
              isCurrent={isCurrentPath(currentPath, "/classes/")}
              open={openDropdown === "classes"}
              onToggle={() => toggleDropdown("classes")}
            >
              <NavigationLink
                href="/classes/"
                currentPath={currentPath}
                className={styles.dropdownPinnedLink}
              >
                View all classes
              </NavigationLink>
              {classes.length > 0 && <DropdownDivider />}
              {classes.map((organization) => (
                <NavigationLink
                  key={organization.id}
                  href={`/classes/${getActiveSlug(organization.slugs)}/`}
                  currentPath={currentPath}
                  className={styles.dropdownLink}
                >
                  {organization.name}
                </NavigationLink>
              ))}
            </Dropdown>
          )}
          {(enabledNavs.includes("all-staffs") ||
            enabledNavs.includes("faculties")) && (
            <Dropdown
              trigger="Faculties"
              isCurrent={
                isCurrentPath(currentPath, "/faculties/") ||
                isCurrentPath(currentPath, "/all-staffs/")
              }
              open={openDropdown === "faculties"}
              onToggle={() => toggleDropdown("faculties")}
            >
              {enabledNavs.includes("all-staffs") && (
                <NavigationLink
                  href="/all-staffs/"
                  currentPath={currentPath}
                  className={styles.dropdownPinnedLink}
                >
                  Staff
                </NavigationLink>
              )}
              {enabledNavs.includes("faculties") && (
                <NavigationLink
                  href="/faculties/"
                  currentPath={currentPath}
                  className={styles.dropdownPinnedLink}
                >
                  All Faculties
                </NavigationLink>
              )}
              {enabledNavs.includes("faculties") && faculties.length > 0 && (
                <>
                  <DropdownDivider />
                  {faculties.map((organization) => (
                    <NavigationLink
                      key={organization.id}
                      href={`/faculties/${getActiveSlug(organization.slugs)}/`}
                      currentPath={currentPath}
                      className={styles.dropdownLink}
                    >
                      {organization.name}
                    </NavigationLink>
                  ))}
                </>
              )}
            </Dropdown>
          )}
          {(enabledNavs.includes("organisations") ||
            enabledNavs.includes("downloads") ||
            enabledNavs.includes("results") ||
            enabledNavs.includes("contact")) && (
            <Dropdown
              trigger="More"
              isCurrent={moreIsCurrent}
              open={openDropdown === "more"}
              onToggle={() => toggleDropdown("more")}
            >
              {enabledNavs.includes("organisations") && (
                <Submenu
                  trigger="Organisations"
                  isCurrent={isCurrentPath(currentPath, "/organisations/")}
                >
                  <NavigationLink
                    href="/organisations/"
                    currentPath={currentPath}
                    className={styles.dropdownPinnedLink}
                  >
                    All Organisations
                  </NavigationLink>
                  {organisations.length > 0 && <DropdownDivider />}
                  {organisations.map((organization) => (
                    <NavigationLink
                      key={organization.id}
                      href={
                        "/organisations/" +
                        getActiveSlug(organization.slugs) +
                        "/"
                      }
                      currentPath={currentPath}
                      className={styles.dropdownLink}
                    >
                      {organization.name}
                    </NavigationLink>
                  ))}
                </Submenu>
              )}
              {enabledNavs.includes("downloads") && (
                <NavigationLink
                  href="/downloads/"
                  currentPath={currentPath}
                  className={styles.dropdownLink}
                >
                  Downloads
                </NavigationLink>
              )}
              {enabledNavs.includes("results") && (
                <NavigationLink
                  href="/results/"
                  currentPath={currentPath}
                  className={styles.dropdownLink}
                >
                  Results
                </NavigationLink>
              )}
              {enabledNavs.includes("contact") && (
                <NavigationLink
                  href="/contact/"
                  currentPath={currentPath}
                  className={styles.dropdownLink}
                >
                  Contact & Feedback
                </NavigationLink>
              )}
            </Dropdown>
          )}
        </nav>

        <button
          type="button"
          className={styles.mobileToggle}
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className={styles.mobileMenu}
          aria-label="Mobile navigation"
        >
          <div className={styles.mobileMenuInner}>
            {enabledNavs.includes("about") && (
              <NavigationLink
                href="/about/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                About
              </NavigationLink>
            )}
            {enabledNavs.includes("notices") && (
              <NavigationLink
                href="/notices/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Notices
              </NavigationLink>
            )}
            {enabledNavs.includes("publications") && (
              <NavigationLink
                href="/publications/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Publications
              </NavigationLink>
            )}
            {enabledNavs.includes("activities") && (
              <NavigationLink
                href="/activities/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Activities
              </NavigationLink>
            )}
            {enabledNavs.includes("classes") && (
              <NavigationLink
                href="/classes/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Classes
              </NavigationLink>
            )}
            {enabledNavs.includes("all-staffs") && (
              <NavigationLink
                href="/all-staffs/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Staff
              </NavigationLink>
            )}
            {enabledNavs.includes("faculties") && (
              <NavigationLink
                href="/faculties/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Faculties
              </NavigationLink>
            )}
            {enabledNavs.includes("organisations") && (
              <NavigationLink
                href="/organisations/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Organisations
              </NavigationLink>
            )}
            {enabledNavs.includes("downloads") && (
              <NavigationLink
                href="/downloads/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Downloads
              </NavigationLink>
            )}
            {enabledNavs.includes("results") && (
              <NavigationLink
                href="/results/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Results
              </NavigationLink>
            )}
            {enabledNavs.includes("contact") && (
              <NavigationLink
                href="/contact/"
                currentPath={currentPath}
                className={styles.mobileLink}
              >
                Contact & Feedback
              </NavigationLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function Dropdown({
  trigger,
  children,
  isCurrent,
  open,
  onToggle,
}: {
  trigger: string;
  children: React.ReactNode;
  isCurrent: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={styles.dropdown}
      data-dropdown-open={open ? "true" : undefined}
    >
      <button
        type="button"
        className={
          styles.dropdownToggle + (isCurrent ? ` ${styles.navLinkActive}` : "")
        }
        aria-expanded={open}
        aria-current={isCurrent ? "page" : undefined}
        onClick={onToggle}
      >
        <span>{trigger}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      {open && <div className={styles.dropdownMenu}>{children}</div>}
    </div>
  );
}

function Submenu({
  trigger,
  children,
  isCurrent,
}: {
  trigger: string;
  children: React.ReactNode;
  isCurrent: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.submenu}>
      <button
        type="button"
        className={
          styles.submenuToggle +
          (isCurrent ? ` ${styles.submenuToggleActive}` : "")
        }
        aria-expanded={open}
        aria-current={isCurrent ? "page" : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{trigger}</span>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
      {open && <div className={styles.submenuMenu}>{children}</div>}
    </div>
  );
}

function DropdownDivider() {
  return <div className={styles.dropdownDivider} aria-hidden="true" />;
}

function Footer({
  coreConfig,
}: {
  coreConfig: NonNullable<LayoutContentProps["coreConfig"]>;
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.footerCopyright}>
          © {new Date().getFullYear()} {coreConfig.schoolName}. All rights
          reserved.
        </p>
        <p className={styles.footerAttribution}>
          Built using{" "}
          <SmartLink
            href="https://github.com/nightmaregaurav/simple-school"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerAttributionLink}
          >
            simple-school
          </SmartLink>
          . Provided with{" "}
          <span className={styles.footerHeart} aria-hidden="true">
            ❤
          </span>{" "}
          by{" "}
          <SmartLink
            href="https://gauravnyaupane.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerAttributionLink}
          >
            Gaurav Nyaupane
          </SmartLink>
        </p>
      </div>
    </footer>
  );
}

export default function ShellTemplate({
  children,
  coreConfig,
  navigationConfig,
  organizationsConfig,
  noticePopupItems,
}: LayoutContentProps) {
  return (
    <div className={styles.page}>
      <SmartLink href="#main-content" className={styles.skipLink}>
        Skip to main content
      </SmartLink>
      <NoticePopup
        notices={noticePopupItems}
        daysToShow={coreConfig.daysToShowNoticePopupFor}
      />
      <Header
        coreConfig={coreConfig}
        navigationConfig={navigationConfig}
        organizationsConfig={organizationsConfig}
      />
      <main
        id="main-content"
        tabIndex={-1}
        className={styles.main}
        aria-label="Main content"
      >
        {children}
      </main>
      <Footer coreConfig={coreConfig} />
      <GoToTopButton />
    </div>
  );
}
