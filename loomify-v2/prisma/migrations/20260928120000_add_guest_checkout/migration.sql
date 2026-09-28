ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Order" ADD COLUMN "guestEmail" TEXT;
ALTER TABLE "Order" ADD COLUMN "guestTokenHash" TEXT;
CREATE UNIQUE INDEX "Order_guestTokenHash_key" ON "Order"("guestTokenHash");
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CouponUsage" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "CouponUsage" ADD COLUMN "guestEmail" TEXT;
ALTER TABLE "CouponUsage" DROP CONSTRAINT "CouponUsage_userId_fkey";
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ReturnRequest" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "ReturnRequest" ADD COLUMN "guestEmail" TEXT;
ALTER TABLE "ReturnRequest" DROP CONSTRAINT "ReturnRequest_userId_fkey";
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;