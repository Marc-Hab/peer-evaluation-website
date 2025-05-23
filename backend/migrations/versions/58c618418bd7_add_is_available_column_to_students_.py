"""Add is_available column to Students model

Revision ID: 58c618418bd7
Revises: b2a27cab704d
Create Date: 2024-10-26 20:04:32.648358

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '58c618418bd7'
down_revision = 'b2a27cab704d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('students', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_available', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('students', schema=None) as batch_op:
        batch_op.drop_column('is_available')

    # ### end Alembic commands ###
