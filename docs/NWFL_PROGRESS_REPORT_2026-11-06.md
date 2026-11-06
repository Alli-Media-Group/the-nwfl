# NWFL: where things stand (6 Nov 2026)

## What happened
The old server on Amazon (AWS) was suspended, so the NWFL data and site stopped working. We moved everything to the same kind of setup used for WAUG: the server runs on Google Cloud, the database is on Neon. The data was restored from the Supabase copy.

## Done and live
- **Server back online**, running on Google Cloud (not AWS). Tested end to end: both websites load their data from it.
- **Database moved to Neon** and restored (teams, players, matches, standings).
- **Faster pages.** Standings and position-trend pages were slow; they now load quickly. League standings "form" now has a fixed, repeatable order when games share a date.
- **Public site Analytics page tidied.** Neutral dark cards, a clearer position-trends chart, and the form guide and top-scorer cards removed because they did not read clearly.
- **Admin app readability.** The dark purple text was hard to read on the dark background; the brand colour is now lighter in dark mode.
- **Tests added.** The backend had no automated tests. It now has 22.
- **Keep-awake.** A scheduled check (cron-job.org, every 4 minutes) keeps the server and database from going to sleep, so the first visitor does not wait.
- **League API keys.** A new superadmin-only page, "API Access", in the admin app. The league makes its own key, can come back and see it again, replace it, or switch it off. Nobody else sees it. Keys are stored sealed, never in plain text.

## Not done yet (honest list)
1. **Make the league's website use its key.** Plan: a small server-side function on the league's Vercel project holds the key and the website asks that function for data. The key is never in the browser. Until that is in place, the key check is switched off so the live site keeps working.
2. **Switch the key check on** once step 1 is live.
3. **Files uploaded after 31 May 2026 are lost.** They were only on the suspended AWS server and cannot be reached. They need to be uploaded again.
4. **Not moved yet:** the Google Sheets sync, the WordPress sync, the scheduled jobs, and the AI import. These need new Google key files, which were on the old server.
5. **Two small bugs:** the sync's progress check can mislead, and the team page ignores the chosen season.
6. **Deliverables still to write:** installation note and user guide, the zipped project, a demo video, and the bridge design write-up.

## What we need from Alli
- Confirm the plan for the league's site (step 1 above), including who has access to the league's Vercel project.
- Re-upload the images and files from after 31 May 2026.
- New Google key files for the sheet sync, when that sync is wanted back.
- Confirm the AWS account stays closed.
