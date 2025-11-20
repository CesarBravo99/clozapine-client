import { useExamRecordContext } from '@/modules/exam_record/contexts/ExamRecordContext';

export function useDocumentRequirements() {
	const { overview } = useExamRecordContext();
	return overview?.documents ?? [];
}

