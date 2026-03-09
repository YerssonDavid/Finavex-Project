ALTER TABLE users
DROP
COLUMN age;

ALTER TABLE savings_money_users
ALTER
COLUMN amount TYPE DECIMAL USING (amount::DECIMAL);

ALTER TABLE savings_movements
ALTER
COLUMN amount TYPE DECIMAL USING (amount::DECIMAL);

ALTER TABLE current_balances
ALTER
COLUMN current_balance TYPE DECIMAL USING (current_balance::DECIMAL);

ALTER TABLE savings_plan_id
    ALTER COLUMN description_plan_savings DROP NOT NULL;

ALTER TABLE expenses
ALTER
COLUMN expense_value TYPE DECIMAL USING (expense_value::DECIMAL);

ALTER TABLE savings_plan_id
ALTER
COLUMN meta_plan TYPE DECIMAL USING (meta_plan::DECIMAL);

ALTER TABLE savings
ALTER
COLUMN savings_value TYPE DECIMAL USING (savings_value::DECIMAL);