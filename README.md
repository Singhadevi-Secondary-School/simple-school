# Simple School

A modern, configurable school website powered by **Next.js, GitHub, and GitHub Pages**.

A school website that doubles as its own CMS. No application backend, no database, and no separate admin server. Manage your website through a built-in setup interface, with content stored directly in your GitHub repository and deployed as a static website.

Fork it, configure it, and publish your own school website for free.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Security and Access](#security-and-access)
- [Running Locally](#running-locally)
- [Keeping Your Fork Up to Date](#keeping-your-fork-up-to-date)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project started as a personal portfolio and evolved into a reusable [portfolio](https://github.com/nightmaregaurav/portfolio) platform with a built-in content management experience. Later I decided to adapt it for schools, allowing them to manage their website content without needing a separate backend or database.

## Features

### Pages

A collection of configurable pages to present your professional identity, experience, and work.

- **Home:** A personalized landing page with a cover image and introduction.
- **About:** An introduction, profile information, and key highlights.
- **Journey:** An interactive timeline of academic, professional, and personal milestones.
- **Projects:** Showcase projects with descriptions, images, external links, and key details.
- **Skills:** Present technical skills and associate them with relevant projects and milestones.
- **Services:** Describe services you offer and provide relevant links.
- **Testimonials:** Display recommendations and testimonials with author information.
- **Gallery:** Organize photographs into collections.
- **Blog:** Publish articles using a rich-text editing experience.
- **Quick Links:** Provide convenient access to downloadable resources and important links.

Individual pages and their content can be configured independently. The navigation menu can also be customized to show only the sections you want.

### Built-in content management system

The application includes a dedicated Setup interface for managing website content without manually editing configuration files.

Features include:

- Form-based configuration for individual website sections.
- Dynamic management of projects, skills, milestones, testimonials, and other entries.
- Rich-text editing for blog posts.
- Configuration validation using Zod schemas.
- GitHub-backed file management.
- Image and asset selection from the connected repository.
- Automatic generation of stable identifiers for managed entries.
- Configuration migrations to accommodate changes in the application's data structure.
- For more features, see the [Features](https://github.com/nightmaregaurav/portfolio#features) section from the portfolio project from which this project is derived.

---

## How it works

Read the [How it works](https://github.com/nightmaregaurav/portfolio#how-it-works) section from portfolio project from which this project is derived.

### Deployment flow

GitHub Actions builds the application into a static website and publishes the resulting files to GitHub Pages.

The deployed website does not require an application server to execute its pages or manage visitor requests.

This separation keeps content management and public website delivery independent.

---

## Getting started

### 1. Fork the repository

Fork this repository:

[https://github.com/nightmaregaurav/simple-school](https://github.com/nightmaregaurav/simple-school)

Your fork will become the source repository for your personal website.

### 2. Configure GitHub Pages

In your fork:

1. Open **Settings → Pages**.
2. Set the deployment source to **GitHub Actions**.
3. Open the **Actions** tab.
4. Enable the repository workflows if GitHub asks you to.

### 3. Deploy your website

1. Open **Actions**.
2. Select **Deploy to GitHub Pages**.
3. Choose **Run workflow**.
4. Wait for the build and deployment to complete.
5. Open the website URL provided by GitHub Pages.

### 4. Configure your website

Open the deployed website and navigate to the Setup area.

Connect your GitHub repository using a **GitHub Personal Access Token (PAT)**, then configure the available sections.

1. Create a [Fine-grained Personal Access Token](https://github.com/settings/personal-access-tokens/new).
2. Select the repository you want to connect.
3. Under **Repository permissions**, grant **Contents: Read and write** access. This permission is required because the CMS reads your configuration files and commits your changes directly to the repository.
4. Use the generated token to connect your repository through the Setup interface.

For more details, see GitHub's [documentation on managing fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

You can now use this token to manage your website's content through the Setup interface.

Save your changes to commit them directly to your repository.

Your website's content is now managed through its own built-in CMS.

### 5. Connect a custom domain (optional)

If you want to use your own domain:

1. Open **Settings → Pages** in your fork.
2. Configure your custom domain.
3. Complete the DNS configuration required by GitHub Pages.
4. Trigger a new deployment.

The deployment workflow uses the configured GitHub Pages URL when generating canonical URLs and SEO metadata.

---

## Security and access

The Setup interface requires a GitHub Personal Access Token to interact with the connected repository.

For security:

- Use a fine-grained Personal Access Token.
- Restrict the token to the repository you want to manage.
- Grant only the permissions required for repository content management.
- Do not commit your token or expose it in source code.
- Revoke the token if you suspect it has been compromised.

The token is stored in the browser's local storage and is used by the browser to communicate with GitHub directly. It is not stored in an application backend.

For additional information, see [SECURITY.md](SECURITY.md).

---

## Running locally

Read the [Running Locally](https://github.com/nightmaregaurav/portfolio#running-locally) section from portfolio project from which this project is derived.

## Keeping your fork up to date

Your fork includes an automated upstream synchronization workflow.

It periodically checks the original repository for updates and merges upstream changes into your fork.

Website configuration is preserved during synchronization, while application updates are incorporated.

You can also trigger the synchronization manually through:

**Actions → Sync Fork with Upstream → Run workflow**

Configuration migrations are subsequently triggered to keep your existing content compatible with newer application versions.

If you make substantial modifications to the application's source code, review upstream changes carefully before relying on automatic synchronization.

---

## Contributing

Contributions, improvements, and bug reports are welcome.

Before contributing, please read [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

This project is distributed under the **Personal Use, Attribution, Non-Commercial License**.

See [LICENSE](LICENSE) for the complete terms.

---

With love, **[Gaurav Nyaupane](https://github.com/nightmaregaurav)**

[Original Repository](https://github.com/nightmaregaurav/simple-school) a derivative of [Portfolio](https://github.com/nightmaregaurav/portfolio)
