-- =========================================
-- FUNCTION: Update Product Unit Price
-- =========================================

CREATE OR REPLACE FUNCTION update_product_price()
RETURNS TRIGGER AS $$
BEGIN

    -- Update product unit price
    UPDATE product
    SET unitprice = NEW.unitprice
    WHERE prodcode = NEW.prodcode;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;


-- =========================================
-- TRIGGER: pricehist insert
-- =========================================

DROP TRIGGER IF EXISTS trg_update_product_price
ON pricehist;

CREATE TRIGGER trg_update_product_price
AFTER INSERT ON pricehist
FOR EACH ROW
EXECUTE FUNCTION update_product_price();
