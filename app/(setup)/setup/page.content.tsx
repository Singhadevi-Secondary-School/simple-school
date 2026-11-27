"use client";

import {
  AlignJustify,
  BuildingComplex,
  Download,
  FileText,
  House,
  Mail,
  NotebookPen,
  ScrollText,
  SquareUser,
  TableProperties,
  Trophy,
  User,
  Users,
  Wrench,
} from "lucide-react";
import ConfigurationGroupCard from "@/components/ui/ConfigurationGroupCard";
import styles from "./page.module.css";

function PageContent() {
  return (
    <div className={styles.page}>
      <div className={"w-full max-w-6xl"}>
        <div className={"max-w-2xl"}>
          <h1 className={"text-3xl font-semibold tracking-tight sm:text-4xl"}>
            Website setup
          </h1>
          <p className={"mt-3 text-base text-muted-foreground"}>
            Configure each part of your school website using focused forms. Your
            changes are saved to the connected repository.
          </p>
        </div>
      </div>
      <div className={styles.cards}>
        <ConfigurationGroupCard
          icon={<Wrench />}
          title="Core"
          description="Set core configuration values for the website."
          pagePath="/setup/core"
        />
        <ConfigurationGroupCard
          icon={<House />}
          title="Home"
          description="Customize the Landing page."
          pagePath="/setup/home"
        />
        <ConfigurationGroupCard
          icon={<AlignJustify />}
          title="Navigation"
          description="Customize the navigation panel."
          pagePath="/setup/navigation"
        />
        <ConfigurationGroupCard
          icon={<User />}
          title="About"
          description="Customize the About page."
          pagePath="/setup/about"
        />
        <ConfigurationGroupCard
          icon={<ScrollText />}
          title="Notices"
          description="Manage notices and announcements."
          pagePath="/setup/notices"
        />
        <ConfigurationGroupCard
          icon={<FileText />}
          title="Publications"
          description="Manage publications and articles."
          pagePath="/setup/publications"
        />
        <ConfigurationGroupCard
          icon={<NotebookPen />}
          title="Activities"
          description="Manage activities and events."
          pagePath="/setup/activities"
        />
        <ConfigurationGroupCard
          icon={<SquareUser />}
          title="People"
          description="Manage staff and personnel."
          pagePath="/setup/people"
        />
        <ConfigurationGroupCard
          icon={<Users />}
          title="Staff"
          description="Manage school staff members."
          pagePath="/setup/staff"
        />
        <ConfigurationGroupCard
          icon={<BuildingComplex />}
          title="Faculties"
          description="Manage school faculties."
          pagePath="/setup/faculties"
        />
        <ConfigurationGroupCard
          icon={<TableProperties />}
          title="Classes"
          description="Manage school classes."
          pagePath="/setup/classes"
        />
        <ConfigurationGroupCard
          icon={<BuildingComplex />}
          title="Organisations"
          description="Manage other organisations like committees and associations."
          pagePath="/setup/organisations"
        />
        <ConfigurationGroupCard
          icon={<Trophy />}
          title="Results"
          description="Manage exam results."
          pagePath="/setup/results"
        />
        <ConfigurationGroupCard
          icon={<Download />}
          title="Downloads"
          description="Manage downloadable files."
          pagePath="/setup/downloads"
        />
        <ConfigurationGroupCard
          icon={<Mail />}
          title="Grievance & Contact"
          description="Configure the grievance and contact page."
          pagePath="/setup/grievance"
        />
      </div>
    </div>
  );
}

export default PageContent;
