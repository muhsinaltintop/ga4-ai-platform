/*
  Warnings:

  - You are about to drop the `GAConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GAProperty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TenantUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GAConnection` DROP FOREIGN KEY `GAConnection_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `GAConnection` DROP FOREIGN KEY `GAConnection_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GAProperty` DROP FOREIGN KEY `GAProperty_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `TenantUser` DROP FOREIGN KEY `TenantUser_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `TenantUser` DROP FOREIGN KEY `TenantUser_userId_fkey`;

-- DropTable
DROP TABLE `GAConnection`;

-- DropTable
DROP TABLE `GAProperty`;

-- DropTable
DROP TABLE `Tenant`;

-- DropTable
DROP TABLE `TenantUser`;

-- DropTable
DROP TABLE `User`;
