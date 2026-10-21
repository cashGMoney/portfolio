# Portfolio site

A plain HTML and CSS portfolio that runs on GitHub Pages. No build tools needed.

## Files

| File | What it is |
|---|---|
| `index.html` | Home page |
| `projects.html` | List of all projects |
| `projects/red-rock-admissions.html` | Red Rock admissions case study with the video |
| `about.html` | Bio, skills, experience, education |
| `assets/css/style.css` | All styling. Colors and font are at the top. |
| `assets/img/` | Screenshots, headshot, favicon |
| `assets/resume.pdf` | Add your resume here (the Resume links point to it) |

## Still to fill in

Your name, email, resume and project content are already in place. Remaining:

- **LinkedIn and GitHub links.** Press `Ctrl+Shift+H` in VS Code and replace `your-profile` and `your-username` across all files.
- **Headshot (optional).** To swap in a professional photo, replace `assets/img/headshot.jpg` with a 4:5 portrait image using the same name.
- **Video.** Paste your YouTube embed into `projects/red-rock-admissions.html` (look for the comment), then update the chapter times.
- **Screenshot (optional).** The home and projects pages use the data model image. Swap in a screenshot of your Zoho build if you prefer.

## Preview locally

Install the **Live Server** extension in VS Code, right-click `index.html` and choose **Open with Live Server**.

## Publish on GitHub Pages

1. Create a new public repository named `your-username.github.io` (use your actual GitHub username).
2. Push these files to the `main` branch. In VS Code: open the folder, use the Source Control panel to commit, then **Publish Branch**.
3. In the repository, go to **Settings > Pages**, set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**.
4. After a minute or two the site is live at `https://your-username.github.io`.

## Add a project

Copy the `<article class="project-row">` block in `projects.html`, and copy `projects/red-rock-admissions.html` as a starting point for the new case study.
