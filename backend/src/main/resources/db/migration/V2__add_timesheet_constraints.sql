-- Add comment to timesheets table documenting that week_start_date should always be a Sunday
COMMENT ON COLUMN timesheets.week_start_date IS 'Week start date must always be a Sunday (start of the week). This is enforced at the application level.';

-- Add comment to time_entries table documenting date validation
COMMENT ON COLUMN time_entries.entry_date IS 'Entry date must be within the timesheet week (Sunday to Saturday). This is enforced at the application level.';

-- Add check constraint to ensure hours are positive
ALTER TABLE time_entries ADD CONSTRAINT chk_time_entries_hours_positive
    CHECK (hours > 0);

