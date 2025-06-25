import useSWR from 'swr';
import { fetcher } from '@/lib/api';

interface Mark {
  _id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  marksObtained: number;
  totalMarks: number;
}

export default function MarksPage() {
  const { data, error } = useSWR<Mark[]>('/marks', fetcher);
  if (error) return <div className="p-4">Failed to load marks.</div>;
  if (!data) return <div className="p-4">Loading marks...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Marks</h1>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-4 py-2">Student</th>
            <th className="px-4 py-2">Subject</th>
            <th className="px-4 py-2">Marks Obtained</th>
            <th className="px-4 py-2">Total Marks</th>
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr key={m._id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2">{m.studentId}</td>
              <td className="px-4 py-2">{m.subjectId}</td>
              <td className="px-4 py-2">{m.marksObtained}</td>
              <td className="px-4 py-2">{m.totalMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
