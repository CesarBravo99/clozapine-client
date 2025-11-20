import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/exam_record/lang';
import { useExamRecordContext } from '@/modules/exam_record/contexts/ExamRecordContext';

export function SubmitSection() {
	const lang = useSelector(selectLang);
	const text = langs[lang];
	const {
		submitExamRecord,
		isSubmitting,
		isSubmitSuccess,
		setErrorDialogOpen,
	} = useExamRecordContext();

	return (
		<div className='space-y-4'>
			<Alert className='border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'>
				<AlertTriangle className='h-4 w-4' />
				<AlertDescription className='text-sm'>{text.alerts.submitWarning}</AlertDescription>
			</Alert>
			<div className='flex flex-col sm:flex-row gap-3'>
				<Button
					className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
					onClick={submitExamRecord}
					disabled={isSubmitting}
				>
					{isSubmitting ? text.buttons.submitting : text.buttons.submit}
				</Button>
				<Button variant='outline' onClick={() => setErrorDialogOpen(true)}>
					{text.buttons.errorReport}
				</Button>
			</div>
			{isSubmitSuccess && (
				<div className='flex items-center gap-2 text-green-600 dark:text-green-400 text-sm'>
					<Check className='h-4 w-4' />
					<span>{text.page.successMessage}</span>
				</div>
			)}
		</div>
	);
}

