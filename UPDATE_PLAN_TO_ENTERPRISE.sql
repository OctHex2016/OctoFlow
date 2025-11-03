-- Update all existing workspaces to Enterprise plan
-- Run this SQL in your PostgreSQL database

UPDATE tenants SET plan = 'enterprise' WHERE plan != 'enterprise';

-- Verify the update
SELECT id, name, plan, status FROM tenants;
