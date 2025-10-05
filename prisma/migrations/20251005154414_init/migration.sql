-- CreateTable
CREATE TABLE "TreeStock" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TreeStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryStock" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AccessoryStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "discount" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "email" TEXT,
    "soldBy" TEXT,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "tree" TEXT,
    "size" TEXT,
    "metalStand" INTEGER NOT NULL DEFAULT 0,
    "plasticStand" INTEGER NOT NULL DEFAULT 0,
    "artificialWreath" INTEGER NOT NULL DEFAULT 0,
    "handmadeWreath" INTEGER NOT NULL DEFAULT 0,
    "hollyWreath" INTEGER NOT NULL DEFAULT 0,
    "smallReindeer" INTEGER NOT NULL DEFAULT 0,
    "mediumReindeer" INTEGER NOT NULL DEFAULT 0,
    "largeReindeer" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockHistory" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TreeStock_type_size_key" ON "TreeStock"("type", "size");

-- CreateIndex
CREATE UNIQUE INDEX "AccessoryStock_name_key" ON "AccessoryStock"("name");

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
