-- 1. Creas los esquemas
CREATE SCHEMA IF NOT EXISTS movement_money_normal;
CREATE SCHEMA IF NOT EXISTS savings;
CREATE SCHEMA IF NOT EXISTS users;

-- 2. Mueves las tablas existentes a sus nuevos esquemas (¡sin borrar nada!)
ALTER TABLE public.current_balances SET SCHEMA movement_money_normal;
ALTER TABLE public.expenses SET SCHEMA movement_money_normal;
ALTER TABLE public.savings SET SCHEMA movement_money_normal;

ALTER TABLE public.savings_money_users SET SCHEMA savings;
ALTER TABLE public.savings_movements SET SCHEMA savings;
ALTER TABLE public.savings_plan_id SET SCHEMA savings;

ALTER TABLE public.users SET SCHEMA users;
