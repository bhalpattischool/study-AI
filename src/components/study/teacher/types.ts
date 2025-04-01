
export interface TeacherFormValues {
  subject: string;
  customSubjectText: string;
  chapter: string;
  studentName: string;
  teachingStyle: 'teacher' | 'standard';
  category: 'concise' | 'detailed';
  action: 'read' | 'notes';
  voiceInteraction: 'enabled' | 'disabled';
}

export interface TeacherModeProps {
  onSendMessage: (message: string) => void;
}
