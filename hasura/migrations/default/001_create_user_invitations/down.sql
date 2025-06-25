-- Drop user_invitations table and related objects
DROP TRIGGER IF EXISTS update_user_invitations_updated_at ON user_invitations;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS user_invitations;