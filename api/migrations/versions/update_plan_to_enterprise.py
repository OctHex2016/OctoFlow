"""Update all tenant plans to enterprise

Revision ID: update_plan_to_enterprise
Revises: 
Create Date: 2025-11-03 10:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'update_plan_to_enterprise'
down_revision = None  # Set this to the latest migration ID if you have one
branch_labels = None
depends_on = None


def upgrade():
    # Update all existing tenants to enterprise plan
    op.execute("UPDATE tenants SET plan = 'enterprise' WHERE plan != 'enterprise'")


def downgrade():
    # Revert to basic plan if needed
    op.execute("UPDATE tenants SET plan = 'basic' WHERE plan = 'enterprise'")
