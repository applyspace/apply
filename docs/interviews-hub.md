# Interviews page: views

Linear: APP-101. Related: APP-93 (templates), APP-94 (preparation), APP-95 (calendar sync).

## What it is

`/interviews` shows every interview with its application and company, in three layouts of the same list, switched with `?layout=list|kanban|calendar` (default `list`, same pattern as the Applications hub). The calendar adds `&view=month|week` (default `month`).

| Layout | What |
|---|---|
| List | Sections Upcoming (soonest first), Not scheduled, Past (latest first). Row: date block, company, role, time and relative day, stage, outcome. |
| Kanban | One column per stage (HR, Manager, Design case, Team fit, Technical, Final; Other only when used). Upcoming on top. Read-only: a stage is the kind of interview, not a step to drag to. Mobile: stage strip, one column at a time. |
| Calendar | Month grid (Monday first, 4 to 6 rows) or week columns; previous, today, next. The selected day's interviews and the unscheduled ones are listed below. Arrow keys, Home and End move between days. Mobile: dots in the month grid, a vertical list for the week. |

Shared: search (company, role, stage, place), "Upcoming only", outcome chips, a peek sheet with links to the interview page and the application. Loading skeleton, error retry, empty and no-match states. EN and FR strings in `lib/interviewsI18n.ts`.

Times are shown in the viewer's time zone (`useTimeZone`: UTC on the server, browser zone after hydration). Pure helpers and their tests: `lib/interviewsHub.ts`, `lib/interviewsHub.test.ts`.

## Data

Read only, no migration. `interviews` (stage, scheduled_at, completed_at, outcome, notes) joined to `applications` and `companies`. Reader: `lib/interviews.ts` (Supabase when signed in, the demo account fixtures from `@apply/core/demo` on the demo host, dated around today, else empty).

## Schema proposal (not applied, needs the founder's go)

The current schema covers the three layouts. A richer calendar and APP-95 need, on `interviews`:

| Column | Type | Why |
|---|---|---|
| `duration_minutes` | `integer null` (check 5 to 600) | Blocks of the right height in a timed week grid, end time in the peek and in synced events. Default display 60 min. |
| `format` | `text null` check in (`video`, `phone`, `onsite`) | Icon on cards, filter, what to prepare. |
| `location` | `text null` | Address for on-site interviews. |
| `meeting_url` | `text null` | Join link for video interviews. |
| `interviewers` | `jsonb not null default '[]'` (`[{ name, role }]`) | Who you meet; feeds APP-94 preparation. |
| `calendar_event_id`, `calendar_provider` | `text null` | Two-way sync (APP-95): match an interview with its calendar event. |

All nullable or defaulted, so existing rows and the current UI keep working; RLS unchanged (per-user policies already cover the table).
