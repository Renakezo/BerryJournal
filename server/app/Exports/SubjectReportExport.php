<?php

namespace App\Exports;

use App\Models\Final_Mark;
use App\Models\Group_Subject;
use App\Models\User;
use App\Models\Date;
use App\Models\Mark;
use App\Models\Skip;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SubjectReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $groupSubject;
    protected $dates;
    protected $students;

    protected $monthOrder = [
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август'
    ];

    public function __construct(Group_Subject $groupSubject)
    {
        $this->groupSubject = $groupSubject;
        $dates = Date::where('group_subject_id', $groupSubject->id)->orderBy('date')->get();

        $groupedDates = [];
        $monthOrder = [
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август'
        ];
        foreach ($dates as $date) {
            array_push($groupedDates, $date);
        }

        uksort($groupedDates, function ($a, $b) use ($monthOrder) {
            return array_search($a, $monthOrder) - array_search($b, $monthOrder);
        });

        $this->dates = $dates;

        $this->students = User::where('group_id', $groupSubject->group_id)
            ->where('role_id', 4) // ID роли студента
            ->where('isArchive', false)
            ->orderBy('surname')
            ->orderBy('name')
            ->get();
    }

    public function collection()
    {
        return $this->students;
    }

    public function headings(): array
    {
        $headings = [
            'ФИО',
        ];

        foreach ($this->dates as $date) {
            $headings[] = Carbon::parse($date->date)->format('d.m');
        }

        array_push($headings, 'Средний балл', 'Итоговая оценка');
        return $headings;
    }

    public function map($student): array
    {
        $row = [
            $student->surname . ' ' . $student->name . ' ' . $student->patronymic,
        ];

        $grades = [];
        $totalNumeric = 0;
        $countNumeric = 0;

        foreach ($this->dates as $date) {
            // Получение оценки
            $mark = Mark::where('date_id', $date->id)
                ->where('student_id', $student->id)
                ->first();

            $skip = Skip::where('date_id', $date->id)
                ->where('student_id', $student->id)
                ->exists();

            $cellValue = '';
            if ($mark) {
                $cellValue = $mark->mark;

                // Для среднего балла
                if (is_numeric($mark->mark)) {
                    $totalNumeric += (float) $mark->mark;
                    $countNumeric++;
                    $grades[] = (float) $mark->mark;
                }
            }

            if ($skip) {
                $cellValue .= ($cellValue ? ', ' : '') . 'н';
            }

            $row[] = $cellValue;
        }

        // Средний балл
        $average = $countNumeric > 0 ? round($totalNumeric / $countNumeric, 2) : '';
        $row[] = $average;

        // Итоговая оценка
        $finalMark = Final_Mark::where('group_subject_id', $this->groupSubject->id)
            ->where('student_id', $student->id)
            ->first();

        $row[] = $finalMark ? $finalMark->mark : '';

        return $row;
    }

    public function styles(Worksheet $sheet)
    {
        // Применяем стили ко всем ячейкам
        $lastRow = $sheet->getHighestRow();
        $lastColumn = $sheet->getHighestColumn();

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_LEFT,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ];

        $sheet->getStyle("A1:{$lastColumn}{$lastRow}")->applyFromArray($styleArray);

        // Жирный шрифт для заголовков
        $sheet->getStyle("A1:{$lastColumn}1")->getFont()->setBold(true);

        // Выравнивание заголовков по центру
        $sheet->getStyle("A1:{$lastColumn}1")->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER);

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // Авто-ширина для всех колонок
                $worksheet = $event->sheet->getDelegate();
                $lastColumn = $worksheet->getHighestColumn();
                $lastColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($lastColumn);

                for ($col = 1; $col <= $lastColumnIndex; $col++) {
                    $worksheet->getColumnDimensionByColumn($col)->setAutoSize(true);
                }

                // Дополнительные настройки стилей
                $worksheet->getStyle($worksheet->calculateWorksheetDimension())
                    ->getAlignment()
                    ->setWrapText(true);
            },
        ];
    }
}
