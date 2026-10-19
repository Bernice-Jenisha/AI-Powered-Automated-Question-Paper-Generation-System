import { QuestionPaper } from '../types';
import { jsPDF } from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle
} from 'docx';

// Export to Microsoft Word DOCX
export async function exportToDocx(paper: QuestionPaper): Promise<void> {
  const { blueprint, questions } = paper;

  // Group questions by section
  const sectionsMap = new Map<string, typeof questions>();
  for (const q of questions) {
    const list = sectionsMap.get(q.sectionId) || [];
    list.push(q);
    sectionsMap.set(q.sectionId, list);
  }

  const docChildren: (Paragraph | Table)[] = [];

  // University Header
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: blueprint.institutionName.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${blueprint.departmentName} - ${blueprint.examType}`,
          bold: true,
          size: 24, // 12pt
          font: 'Times New Roman'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Course: ${blueprint.courseName} (${blueprint.courseCode}) | Semester: ${blueprint.semester} | Year: ${blueprint.academicYear}`,
          italics: true,
          size: 20,
          font: 'Times New Roman'
        })
      ]
    })
  );

  // Metadata Table: Time & Max Marks & Roll No
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Duration: ', bold: true, size: 20 }),
                  new TextRun({ text: `${blueprint.durationMinutes / 60} Hours (${blueprint.durationMinutes} Mins)`, size: 20 })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Max Marks: ', bold: true, size: 20 }),
                  new TextRun({ text: `${blueprint.totalMarks}`, size: 20 })
                ]
              })
            ]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Candidate Roll / Reg No: [ ________________________ ]', size: 20 })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
  docChildren.push(metaTable);

  // Instructions
  docChildren.push(
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({ text: 'General Instructions:', bold: true, size: 20, underline: {} })
      ]
    })
  );

  blueprint.instructions.forEach((inst, idx) => {
    docChildren.push(
      new Paragraph({
        spacing: { after: 60 },
        bullet: { level: 0 },
        children: [new TextRun({ text: inst, size: 18 })]
      })
    );
  });

  docChildren.push(
    new Paragraph({
      spacing: { before: 150, after: 150 },
      children: [new TextRun({ text: '-----------------------------------------------------------------------------------------------------------------', size: 16 })]
    })
  );

  // Sections and Questions
  blueprint.sections.forEach((sec) => {
    const secQuestions = sectionsMap.get(sec.id) || [];
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: `${sec.name.toUpperCase()} (${sec.marksPerQuestion} Marks Each)`,
            bold: true,
            size: 24,
            font: 'Times New Roman'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: `Answer all questions in this section. [Total: ${sec.marksPerQuestion * secQuestions.length} Marks]`,
            italics: true,
            size: 18
          })
        ]
      })
    );

    secQuestions.forEach((q) => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 80 },
          children: [
            new TextRun({
              text: `Q${q.questionNumber}. `,
              bold: true,
              size: 20
            }),
            new TextRun({
              text: q.questionText,
              size: 20
            }),
            new TextRun({
              text: `  [Bloom: ${q.bloomsLevel} (${q.actionVerb})] [${q.marks} Marks]`,
              bold: true,
              size: 18
            })
          ]
        })
      );
    });
  });

  // Marking Rubric Annexure
  docChildren.push(
    new Paragraph({
      spacing: { before: 400, after: 100 },
      pageBreakBefore: true,
      children: [
        new TextRun({
          text: 'FACULTY EVALUATION SCHEME & MODEL ANSWERS (ANNEXURE)',
          bold: true,
          size: 24,
          font: 'Times New Roman'
        })
      ]
    })
  );

  questions.forEach((q) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 160, after: 60 },
        children: [
          new TextRun({
            text: `Q${q.questionNumber}. [${q.bloomsLevel} - ${q.marks}M] Model Solution:`,
            bold: true,
            size: 20
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: q.modelAnswer,
            italics: true,
            size: 18
          })
        ]
      })
    );

    if (q.markingRubric && q.markingRubric.length > 0) {
      q.markingRubric.forEach((crit) => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({ text: `${crit.step}: `, bold: true, size: 16 }),
              new TextRun({ text: `${crit.marks} Mark(s)`, size: 16 })
            ]
          })
        );
      });
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${blueprint.courseCode || 'EXAM'}_Question_Paper_${blueprint.examType.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export formatted PDF directly via jsPDF
export function exportToPdfDirectly(paper: QuestionPaper): void {
  const { blueprint, questions } = paper;
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 50;

  // Helper to add page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 50) {
      doc.addPage();
      currentY = 50;
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.text(`${blueprint.courseCode} - ${blueprint.examType}`, margin, 35);
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin - 40, 35);
      doc.setLineWidth(0.5);
      doc.line(margin, 40, pageWidth - margin, 40);
    }
  };

  // Header
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text(blueprint.institutionName.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 22;

  doc.setFontSize(12);
  doc.text(`${blueprint.departmentName} - ${blueprint.examType}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 18;

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.text(`Course: ${blueprint.courseName} (${blueprint.courseCode}) | Sem: ${blueprint.semester}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 20;

  // Metadata line
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setLineWidth(1);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 16;

  doc.setFont('times', 'bold');
  doc.text(`Duration: ${blueprint.durationMinutes / 60} Hours (${blueprint.durationMinutes} mins)`, margin, currentY);
  doc.text(`Total Marks: ${blueprint.totalMarks}`, pageWidth - margin - 90, currentY);
  currentY += 16;
  doc.text('Roll Number: [ ___________________________ ]', margin, currentY);
  currentY += 16;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 20;

  // Instructions
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text('General Instructions:', margin, currentY);
  currentY += 14;

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  blueprint.instructions.forEach((inst, idx) => {
    const lines = doc.splitTextToSize(`${idx + 1}. ${inst}`, contentWidth);
    checkPageBreak(lines.length * 12);
    doc.text(lines, margin + 5, currentY);
    currentY += lines.length * 12;
  });
  currentY += 10;

  // Group by sections
  const sectionsMap = new Map<string, typeof questions>();
  for (const q of questions) {
    const list = sectionsMap.get(q.sectionId) || [];
    list.push(q);
    sectionsMap.set(q.sectionId, list);
  }

  // Render sections
  blueprint.sections.forEach((sec) => {
    const secQuestions = sectionsMap.get(sec.id) || [];
    checkPageBreak(50);

    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text(`${sec.name.toUpperCase()} (${sec.marksPerQuestion} Marks Each)`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 16;

    secQuestions.forEach((q) => {
      checkPageBreak(40);
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      const qPrefix = `Q${q.questionNumber}. `;
      const qPrefixWidth = doc.getTextWidth(qPrefix);

      doc.text(qPrefix, margin, currentY);

      doc.setFont('times', 'normal');
      const textLines = doc.splitTextToSize(q.questionText, contentWidth - qPrefixWidth - 90);
      doc.text(textLines, margin + qPrefixWidth, currentY);

      // Marks and Bloom tag on the right
      doc.setFont('times', 'bold');
      doc.setFontSize(9);
      doc.text(`[${q.marks}M | ${q.bloomsLevel}]`, pageWidth - margin - 75, currentY);

      currentY += Math.max(textLines.length * 13, 20);
    });

    currentY += 12;
  });

  // Save PDF
  doc.save(`${blueprint.courseCode || 'EXAM'}_Question_Paper.pdf`);
}

// Print trigger
export function triggerPrintDialog(): void {
  window.print();
}
