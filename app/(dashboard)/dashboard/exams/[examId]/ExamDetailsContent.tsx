import { getExamDetails } from '@/actions/Exam/getExamDetails'
import ExamSheet from './ExamSheet'
// 👇 1. استيراد الدالة
import { getFullGroupName } from '@/utils/groupName'

export default async function ExamDetailsContent({ examId }: { examId: string }) {
  // هنا الفيتش التقيل (بيانات الامتحان + كل الطلاب ودرجاتهم)
  const data = await getExamDetails(examId) // 👇 2. بناء الاسم المدمج قبل تمريره للـ Client Component

  const fullGroupName = getFullGroupName({
    grade: data.groupGrade,
    name: data.groupName,
  }) // بنسلم الداتا للـ Client Component المسؤول عن الرصد

  return (
    <ExamSheet
      examId={examId}
      initialData={data.students}
      examInfo={{
        title: data.examTitle,
        maxScore: data.maxScore,
        groupName: fullGroupName, // <-- تم تمرير الاسم المدمج
        date: data.date,
      }}
    />
  )
}
