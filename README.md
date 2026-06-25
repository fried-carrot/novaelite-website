# NoVa Elite College Consulting — Website

Marketing site for NoVa Elite College Consulting: college admissions advising
from recent Northern Virginia graduates who got into top-20 schools.

## Stack

Static site, zero build step. Three files:

- `index.html` — markup and copy
- `styles.css` — design system (regal/editorial: paper-white & ink-black base, royal crimson, gold accent)
- `script.js` — sticky nav, mobile menu, scroll-reveal

## Run locally

```
python3 -m http.server 4178
```

Then open http://localhost:4178

## Deploy

Any static host. For GitHub Pages: push to `main`, enable Pages on the root of
the default branch. No build command needed.

## Notes / open decisions (from the planning doc)

- Pricing is intentionally NOT on the site yet — the team has not finalized
  package prices or the T20-guarantee stat thresholds (4.4+ GPA / 1450+ SAT were
  tentative). The guarantee section sells the concept without numbers.
- Team bios use placeholders for each founder's individual acceptances; the doc
  only has the combined acceptance list. Fill in per-person details before launch.
- Instagram link points to the planned handle `novaelitecollegeconsulting`.
- School logos (acceptance wall + advisor cards) are the founders' supplied
  image files. These are trademarked university marks: using them on a
  commercial site implies an affiliation the schools have not granted and is a
  real cease-and-desist risk. Confirm you accept that before going public, or
  switch to plain text wordmarks.
- Stanford's mark is AVIF (`block-s-right.avif`); fine in current browsers but
  unsupported in older Safari. Provide a PNG fallback if that matters.
