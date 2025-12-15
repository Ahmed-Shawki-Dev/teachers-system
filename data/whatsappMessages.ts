export const whatsappOverViewPage = (studentName:string,parentLink:string)=>{
  const message = `السلام عليكم، \nلمتابعة تقرير الطالب: *${studentName}*\nيرجى زيارة الرابط التالي:\n${parentLink}`

  return message
}