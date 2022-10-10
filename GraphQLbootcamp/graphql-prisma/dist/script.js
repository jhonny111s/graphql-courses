"use strict";

var _client = require("@prisma/client");

// 1
// 2
const prisma = new _client.PrismaClient(); // 3

async function main() {
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
} // 4


main() // 5
.finally(async () => {
  await prisma.$disconnect();
});