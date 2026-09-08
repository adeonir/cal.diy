# cal.diy

## Business hours and timezone

Conventions for the outside-business-hours warning.

- Business hours come from a per-user setting, never from a hardcoded constant and never from the event type availability schedule. Organization-level hours are out of scope for now.
- Storage shape: one start time, one end time, and a list of active weekdays. Do not model per-weekday ranges.
- Default when the setting is absent: 09:00 to 17:00, Monday to Friday.
- Evaluate whether a slot is outside business hours in the organizer timezone. Convert the selected slot to that timezone before comparing; never compare against the booker timezone or a fixed project timezone.
- Use `@calcom/dayjs` for every timezone conversion and comparison. `@calcom/lib/dayjs` holds helpers on top of it. Do not add another date library.
- The warning is non-blocking but requires acknowledgement: the booker sees it in the booking page and must confirm before the booking submits.
- Show the warning in the booking page only. Do not add it to the API response or to the event type settings screen.
