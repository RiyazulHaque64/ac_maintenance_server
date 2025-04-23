import prisma from "../shared/prisma";

const clearOldOtps = async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  try {
    const deleteOtps = await prisma.oTP.deleteMany({
      where: {
        created_at: {
          lt: tenMinutesAgo,
        },
      },
    });
    console.log(`Deleted ${deleteOtps.count} old OTPs`);
  } catch (error) {
    console.error("Error deleting old OTPs:", error);
  }
};

export default clearOldOtps;
