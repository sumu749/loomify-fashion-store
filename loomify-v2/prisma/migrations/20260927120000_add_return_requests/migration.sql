CREATE TYPE "ReturnRequestStatus" AS ENUM (
    'REQUESTED',
    'APPROVED',
    'REJECTED',
    'RECEIVED',
    'COMPLETED'
);

CREATE TYPE "ReturnResolution" AS ENUM ('REFUND', 'EXCHANGE');

CREATE TABLE "ReturnRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL CHECK ("quantity" > 0),
    "reason" TEXT NOT NULL,
    "requestedResolution" "ReturnResolution" NOT NULL,
    "status" "ReturnRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReturnRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ReturnRequest_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReturnRequest_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReturnRequest_orderItemId_fkey" FOREIGN KEY ("orderItemId")
        REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ReturnRequest_userId_createdAt_idx"
    ON "ReturnRequest"("userId", "createdAt");
CREATE INDEX "ReturnRequest_orderId_idx" ON "ReturnRequest"("orderId");
CREATE INDEX "ReturnRequest_orderItemId_idx" ON "ReturnRequest"("orderItemId");
CREATE INDEX "ReturnRequest_status_createdAt_idx"
    ON "ReturnRequest"("status", "createdAt");