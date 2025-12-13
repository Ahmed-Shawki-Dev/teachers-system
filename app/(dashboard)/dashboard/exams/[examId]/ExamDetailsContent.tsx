import { getExamDetails } from '@/actions/Exam/getExamDetails'
import ExamSheet from './ExamSheet'

export default async function ExamDetailsContent({ examId }: { examId: string }) {
  // هنا الفيتش التقيل (بيانات الامتحان + كل الطلاب ودرجاتهم)
  const data = await getExamDetails(examId)

  // بنسلم الداتا للـ Client Component المسؤول عن الرصد
  return (
    <ExamSheet
      examId={examId}
      initialData={data.students}
      examInfo={{
        title: data.examTitle,
        maxScore: data.maxScore,
        groupName: data.groupName,
        date: data.date,
      }}
    />
  )
}
