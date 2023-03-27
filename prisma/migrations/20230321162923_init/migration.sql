-- CreateTable
CREATE TABLE "satellite" (
    "name" VARCHAR(100) NOT NULL,
    "position_x" DECIMAL(6,2) NOT NULL,
    "position_y" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "satellite_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "satellite_com" (
    "satellite" VARCHAR(100) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL,
    "distance" DECIMAL(6,2) NOT NULL,
    "message" VARCHAR(50)[],

    CONSTRAINT "satellite_com_pkey" PRIMARY KEY ("satellite")
);

-- AddForeignKey
ALTER TABLE "satellite_com" ADD CONSTRAINT "satellite_com_satellite_fkey" FOREIGN KEY ("satellite") REFERENCES "satellite"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
