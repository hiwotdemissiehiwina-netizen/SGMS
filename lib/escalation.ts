// 3 ቀን (72 ሰዓታት) በሚሊሰከንድ
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export async function checkAndEscalateGrievances(GrievanceModel: any) {
  const threeDaysAgo = new Date(Date.now() - THREE_DAYS_MS);

  // ከ 3 ቀን በፊት የቀረቡ፣ እስካሁን 'Pending' የሆኑ እና 'isEscalated' ያልሆኑ ቅሬታዎችን መፈለግ
  await GrievanceModel.updateMany(
    {
      createdAt: { $lte: threeDaysAgo },
      status: 'Pending',
      isEscalated: { $ne: true }
    },
    {
      $set: { 
        isEscalated: true,
        status: 'Escalated' 
      }
    }
  );
}