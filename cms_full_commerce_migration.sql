-- ==============================================================================
-- CMS FULL NATIVE COMMERCE MIGRATION
-- Modifies the order_items schema and process_checkout RPC to allow 
-- purchasing digital CMS items natively without polluting the products table.
-- Supports: workout_plans, programs, meal_plans, manual_therapy, 
-- lifestyle_pillars, lifestyle_tips.
-- ==============================================================================

-- 1. Modify order_items to support all CMS items
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE SET NULL;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS manual_therapy_id UUID REFERENCES public.manual_therapy(id) ON DELETE SET NULL;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS lifestyle_pillar_id UUID REFERENCES public.lifestyle_pillars(id) ON DELETE SET NULL;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS lifestyle_tip_id UUID REFERENCES public.lifestyle_tips(id) ON DELETE SET NULL;

-- Relax constraints on physical product columns
ALTER TABLE public.order_items ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE public.order_items ALTER COLUMN variant_id DROP NOT NULL;

-- 2. Update process_checkout RPC
CREATE OR REPLACE FUNCTION process_checkout(
    p_order_data JSONB,
    p_order_items JSONB
) RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_current_stock INT;
    v_new_stock INT;
    v_item_total DECIMAL;
BEGIN
    -- 1. Check idempotency
    IF p_order_data->>'idempotency_key' IS NOT NULL THEN
        SELECT id INTO v_order_id FROM public.orders WHERE idempotency_key = (p_order_data->>'idempotency_key')::UUID;
        IF v_order_id IS NOT NULL THEN
            -- Idempotent return - already exists
            RETURN jsonb_build_object('success', true, 'order_id', v_order_id, 'is_duplicate', true);
        END IF;
    END IF;

    -- 2. Insert order
    INSERT INTO public.orders (
        order_number,
        user_id,
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_phone,
        country,
        city,
        address,
        apartment,
        delivery_notes,
        subtotal,
        delivery_fee,
        total,
        payment_method,
        payment_status,
        order_status,
        idempotency_key,
        coupon_code,
        discount_amount
    ) VALUES (
        p_order_data->>'order_number',
        NULLIF(p_order_data->>'user_id', '')::UUID,
        p_order_data->>'customer_first_name',
        p_order_data->>'customer_last_name',
        p_order_data->>'customer_email',
        p_order_data->>'customer_phone',
        p_order_data->>'country',
        p_order_data->>'city',
        p_order_data->>'address',
        p_order_data->>'apartment',
        p_order_data->>'delivery_notes',
        (p_order_data->>'subtotal')::DECIMAL,
        (p_order_data->>'delivery_fee')::DECIMAL,
        (p_order_data->>'total')::DECIMAL,
        (p_order_data->>'payment_method')::public.payment_method,
        COALESCE(p_order_data->>'payment_status', 'pending')::public.payment_status,
        COALESCE(p_order_data->>'order_status', 'pending')::public.order_status,
        NULLIF(p_order_data->>'idempotency_key', '')::UUID,
        p_order_data->>'coupon_code',
        (p_order_data->>'discount_amount')::DECIMAL
    ) RETURNING id INTO v_order_id;

    -- 3. Process items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_order_items)
    LOOP
        IF COALESCE((v_item->>'is_cms_item')::BOOLEAN, false) = true THEN
            -- Digital CMS Item: Bypass stock deduction and physical product checks
            INSERT INTO public.order_items (
                order_id,
                product_id,
                variant_id,
                workout_plan_id,
                program_id,
                meal_plan_id,
                manual_therapy_id,
                lifestyle_pillar_id,
                lifestyle_tip_id,
                product_name,
                variant_name,
                price_at_purchase,
                quantity,
                flavor
            ) VALUES (
                v_order_id,
                NULL,
                NULL,
                CASE WHEN v_item->>'cms_type' = 'workout_plan' THEN (v_item->>'cms_id')::UUID ELSE NULL END,
                CASE WHEN v_item->>'cms_type' = 'program' THEN (v_item->>'cms_id')::UUID ELSE NULL END,
                CASE WHEN v_item->>'cms_type' = 'meal_plan' THEN (v_item->>'cms_id')::UUID ELSE NULL END,
                CASE WHEN v_item->>'cms_type' = 'manual_therapy' THEN (v_item->>'cms_id')::UUID ELSE NULL END,
                CASE WHEN v_item->>'cms_type' = 'lifestyle_pillar' THEN (v_item->>'cms_id')::UUID ELSE NULL END,
                CASE WHEN v_item->>'cms_type' = 'lifestyle_tip' THEN (v_item->>'cms_id')::UUID ELSE NULL END,
                v_item->>'product_name',
                v_item->>'variant_name',
                (v_item->>'price_at_purchase')::DECIMAL,
                (v_item->>'quantity')::INT,
                NULL
            );
        ELSE
            -- Standard Physical Product: Lock row for update and deduct stock
            SELECT stock_quantity INTO v_current_stock
            FROM public.product_variants
            WHERE id = (v_item->>'variant_id')::UUID
            FOR UPDATE;

            IF v_current_stock IS NULL THEN
                RAISE EXCEPTION 'Variant not found: %', (v_item->>'variant_id');
            END IF;

            IF v_current_stock < (v_item->>'quantity')::INT THEN
                -- Throw structured error for frontend mapping
                RAISE EXCEPTION '{"code":"INSUFFICIENT_STOCK", "variant_id":"%", "available":%}', (v_item->>'variant_id'), v_current_stock;
            END IF;

            v_new_stock := v_current_stock - (v_item->>'quantity')::INT;

            UPDATE public.product_variants
            SET stock_quantity = v_new_stock,
                in_stock = v_new_stock > 0
            WHERE id = (v_item->>'variant_id')::UUID;

            INSERT INTO public.order_items (
                order_id,
                product_id,
                variant_id,
                workout_plan_id,
                program_id,
                meal_plan_id,
                manual_therapy_id,
                lifestyle_pillar_id,
                lifestyle_tip_id,
                product_name,
                variant_name,
                price_at_purchase,
                quantity,
                flavor
            ) VALUES (
                v_order_id,
                (v_item->>'product_id')::UUID,
                (v_item->>'variant_id')::UUID,
                NULL,
                NULL,
                NULL,
                NULL,
                NULL,
                NULL,
                v_item->>'product_name',
                v_item->>'variant_name',
                (v_item->>'price_at_purchase')::DECIMAL,
                (v_item->>'quantity')::INT,
                v_item->>'flavor'
            );
        END IF;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'order_id', v_order_id, 'is_duplicate', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
