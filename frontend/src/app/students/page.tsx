import useSWR from 'swr';
import { fetcher } from '@/lib/api';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  gradeLevel: string;
}

export default function StudentsPage() {
  const { data, error } = useSWR<Student[]>('/students', fetcher);
  if (error) return <div className="p-4">Failed to load students.</div>;
  if (!data) return <div className="p-4">Loading students...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-4 py-2">Student ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Grade Level</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s._id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2">{s.studentId}</td>
              <td className="px-4 py-2">{s.firstName} {s.lastName}</td>
              <td className="px-4 py-2">{s.email}</td>
              <td className="px-4 py-2">{s.gradeLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
