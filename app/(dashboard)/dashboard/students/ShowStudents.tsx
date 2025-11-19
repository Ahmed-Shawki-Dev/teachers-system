import { getAllStudentsAction } from '../../../../actions/Student/getStudents'
import { Card, CardContent } from '../../../../components/ui/card'

async function ShowStudents() {
  const students = await getAllStudentsAction()
  return (
    <div>
      <Card>
        <CardContent>
          {students[0].name}
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowStudents
