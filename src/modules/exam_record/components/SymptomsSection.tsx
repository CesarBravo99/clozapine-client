import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSymptomOptions } from '@/modules/exam_record/hooks/useSymptomOptions';
import { useExamRecordContext } from '@/modules/exam_record/contexts/ExamRecordContext';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/exam_record/lang';

export function SymptomsSection() {
	const options = useSymptomOptions();
	const { selectedSymptoms, toggleSymptom, notes, setNotes } = useExamRecordContext();
	const lang = useSelector(selectLang);
	const text = langs[lang];

	return (
		<Card className='border border-gray-100 dark:border-gray-800'>
			<CardHeader className='border-b border-gray-100 dark:border-gray-800'>
				<CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
					{text.sections.symptoms}
				</CardTitle>
			</CardHeader>
			<CardContent className='p-4 space-y-4'>
				<p className='text-sm text-gray-600 dark:text-gray-400'>{text.symptoms.instructions}</p>
				<div className='space-y-2'>
					{options.map((option) => (
						<label
							key={option.id}
							className='flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer'
						>
							<Checkbox
								checked={selectedSymptoms.has(option.id)}
								onCheckedChange={() => toggleSymptom(option.id)}
								className='h-4 w-4'
							/>
							<span className='text-sm text-gray-800 dark:text-gray-200'>{option.label}</span>
						</label>
					))}
				</div>
				<div className='space-y-2'>
					<Label className='text-sm font-medium text-gray-800 dark:text-gray-200'>
						{text.sections.notesLabel}
					</Label>
					<Textarea
						value={notes}
						onChange={(event) => setNotes(event.target.value)}
						placeholder={text.symptoms.otherSymptomsLabel}
						className='min-h-[100px]'
					/>
				</div>
			</CardContent>
		</Card>
	);
}

